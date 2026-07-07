// DOORS private engine - single edge function behind the studio.
// Invoked by the frontend via supabase.functions.invoke('doors-engine', { body: { action, payload } }).
// Auth model: the caller's JWT identifies the user; team membership (doors_team)
// gates every action except whoami. Data access uses the service_role key, so
// this function is the ONLY writer to the studio-managed tables.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    // Identify the caller from their JWT.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user ?? null;

    const { action, payload = {} } = await req.json().catch(() => ({ action: null }));
    if (!action) return json({ error: 'no_action' }, 400);

    if (!user) return json({ error: 'not_authenticated' }, 401);

    // Resolve team membership (match on user_id OR email so a member added by
    // email before signing up is still recognised).
    const { data: teamRow } = await admin
      .from('doors_team')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    const isTeam = !!teamRow;
    const isAdmin = teamRow?.role === 'admin';

    // Backfill user_id the first time a member added by email signs in.
    if (teamRow && !teamRow.user_id) {
      await admin.from('doors_team').update({ user_id: user.id }).eq('id', teamRow.id);
    }

    if (action === 'whoami') return json({ is_team: isTeam });

    if (!isTeam) return json({ error: 'not_team' }, 403);

    const requireAdmin = () => {
      if (!isAdmin) throw new Error('not_admin');
    };

    switch (action) {
      case 'overview': {
        const [properties, settings, team, requests, outreach, buyers, introductions] = await Promise.all([
          admin.from('doors_properties').select('*').order('created_at', { ascending: false }),
          admin.from('doors_settings').select('*').eq('id', 1).maybeSingle(),
          admin.from('doors_team').select('*').order('created_at', { ascending: true }),
          admin.from('doors_viewing_requests').select('*').order('created_at', { ascending: false }),
          admin.from('doors_outreach').select('*').order('created_at', { ascending: false }),
          admin.from('profiles').select('*').order('created_at', { ascending: false }),
          admin.from('doors_private_introductions').select('*'),
        ]);
        return json({
          me: { id: teamRow.id, full_name: teamRow.full_name, email: teamRow.email, role: teamRow.role },
          isAdmin,
          properties: properties.data ?? [],
          settings: settings.data ?? { id: 1, mandate_marketing_unlocked: false },
          team: team.data ?? [],
          requests: requests.data ?? [],
          outreach: outreach.data ?? [],
          buyers: buyers.data ?? [],
          introductions: introductions.data ?? [],
        });
      }

      case 'save_property': {
        const p = payload.property ?? {};
        const row: Record<string, unknown> = {
          ref: p.ref, title: p.title, area: p.area, price_band: p.price_band,
          exact_price: p.exact_price ?? null, address: p.address ?? null,
          size_sqm: p.size_sqm ?? null, erf_sqm: p.erf_sqm ?? null,
          bedrooms: p.bedrooms ?? null, bathrooms: p.bathrooms ?? null,
          summary: p.summary ?? null, image_url: p.image_url ?? null, video_url: p.video_url ?? null,
          character: p.character ?? null, gallery: p.gallery ?? null, specifics: p.specifics ?? null,
          discretion_level: p.discretion_level ?? 'public-curated',
          pipeline_stage: p.pipeline_stage ?? 'mandate_won',
          status: p.status ?? 'active',
          is_published: p.is_published ?? false,
          is_demo: p.is_demo ?? false,
          owner_id: p.owner_id ?? null,
        };
        if (p.id) {
          const { error } = await admin.from('doors_properties').update(row).eq('id', p.id);
          if (error) return json({ error: error.message }, 400);
        } else {
          const { error } = await admin.from('doors_properties').insert(row);
          if (error) return json({ error: error.message }, 400);
        }
        return json({ ok: true });
      }

      case 'delete_property': {
        const { error } = await admin.from('doors_properties').delete().eq('id', payload.id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'update_pipeline': {
        const { error } = await admin.from('doors_properties').update({ pipeline_stage: payload.stage }).eq('id', payload.id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'make_introduction': {
        const { error } = await admin.from('doors_private_introductions')
          .upsert({ user_id: payload.user_id, property_ref: payload.property_ref }, { onConflict: 'user_id,property_ref' });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'remove_introduction': {
        const { error } = await admin.from('doors_private_introductions').delete()
          .eq('user_id', payload.user_id).eq('property_ref', payload.property_ref);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'update_request': {
        const { error } = await admin.from('doors_viewing_requests').update({ status: payload.status }).eq('id', payload.id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'create_outreach': {
        const { error } = await admin.from('doors_outreach').insert({
          property_ref: payload.property_ref ?? null,
          kind: payload.kind ?? 'editorial',
          title: payload.title ?? null,
          audience_note: payload.audience_note ?? null,
          status: 'draft',
        });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'update_outreach_status': {
        const { error } = await admin.from('doors_outreach').update({ status: payload.status }).eq('id', payload.id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'toggle_marketing': {
        requireAdmin();
        const { error } = await admin.from('doors_settings')
          .update({ mandate_marketing_unlocked: !!payload.unlocked, ffc_reference: payload.ffc_reference ?? null, updated_at: new Date().toISOString() })
          .eq('id', 1);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'add_team': {
        requireAdmin();
        const { error } = await admin.from('doors_team').insert({
          email: payload.email, full_name: payload.full_name ?? null, role: payload.role ?? 'agent',
        });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'remove_team': {
        requireAdmin();
        if (payload.id === teamRow.id) return json({ error: 'cannot_remove_self' }, 400);
        const { error } = await admin.from('doors_team').delete().eq('id', payload.id);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'seed_demo': {
        requireAdmin();
        const demo = [
          {
            ref: 'DR-DEMO-1', title: 'Cliffside Villa, Herolds Bay', area: 'Herolds Bay',
            price_band: 'R18m - R25m', exact_price: 'R21,500,000', bedrooms: 5, bathrooms: 5,
            size_sqm: 620, summary: 'A demonstration listing. Remove before launch.',
            discretion_level: 'public-curated', pipeline_stage: 'mandate_won', status: 'active',
            is_published: true, is_demo: true,
          },
          {
            ref: 'DR-DEMO-2', title: 'Private Estate, Plettenberg Bay', area: 'Plettenberg Bay',
            price_band: 'R30m - R45m', bedrooms: 6, bathrooms: 6, size_sqm: 900,
            summary: 'A demonstration private listing. Remove before launch.',
            discretion_level: 'fully-private', pipeline_stage: 'matched', status: 'active',
            is_published: false, is_demo: true,
          },
        ];
        const { error } = await admin.from('doors_properties').upsert(demo, { onConflict: 'ref' });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      case 'remove_demo': {
        requireAdmin();
        const { error } = await admin.from('doors_properties').delete().eq('is_demo', true);
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }

      default:
        return json({ error: 'unknown_action', action }, 400);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'server_error';
    return json({ error: msg }, msg === 'not_admin' ? 403 : 500);
  }
});
