import { createClient } from '@supabase/supabase-js';

/**
 * Interim lead capture for the DOORS preview site.
 *
 * Enquiries are stored in the DOORS-owned Supabase project via the publishable
 * key. RLS allows anon INSERT only on `doors_enquiries` (no read), so this is
 * safe to ship in the client. Migrated off LAUNCHT's Supabase 07/07/2026.
 */
const LEADS_URL = 'https://stgpdnxengnhsliqwavh.supabase.co';
const LEADS_KEY = 'sb_publishable_54HNuuXIbonI-x0YUToYWw_9gwuI6pK';

const leadsClient = createClient(LEADS_URL, LEADS_KEY);

export interface LeadPayload {
  kind: 'buyer' | 'seller';
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  budget_band?: string | null;
  area_interest?: string | null;
  property_ref?: string | null;
  source?: string;
  /** POPIA: explicit, recorded consent to be contacted. Never defaulted to true. */
  contact_consent?: boolean;
  /** Seller flow: they have asked for an introductory viewing. */
  viewing_requested?: boolean;
}

export async function captureLead(payload: LeadPayload): Promise<{ error?: string }> {
  const base = {
    kind: payload.kind,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    message: payload.message || null,
    budget_band: payload.budget_band || null,
    area_interest: payload.area_interest || null,
    property_ref: payload.property_ref || null,
    source: payload.source || payload.kind,
  };

  const consentedAt = new Date().toISOString();
  const { error } = await leadsClient.from('doors_enquiries').insert({
    ...base,
    contact_consent: !!payload.contact_consent,
    consented_at: payload.contact_consent ? consentedAt : null,
    viewing_requested: !!payload.viewing_requested,
  });

  if (!error) return {};

  // The consent columns arrive with migration 0002. Until that has been applied
  // to the DOORS project, PostgREST rejects the insert for an unknown column
  // (PGRST204 / Postgres 42703). An enquiry must never be lost to a schema lag,
  // so fall back to the columns that certainly exist and keep the consent record
  // in the note. Remove this fallback once 0002 is live.
  const missingColumn =
    error.code === 'PGRST204' ||
    error.code === '42703' ||
    /column .* does not exist|could not find the '.*' column/i.test(error.message);

  if (!missingColumn) return { error: error.message };

  const trail = [
    payload.contact_consent
      ? `Consent to contact given ${consentedAt} (POPIA).`
      : 'No consent to contact recorded.',
    payload.viewing_requested ? 'Introductory viewing requested.' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const { error: retryError } = await leadsClient.from('doors_enquiries').insert({
    ...base,
    message: [base.message, `[${trail}]`].filter(Boolean).join('\n\n'),
  });
  if (retryError) return { error: retryError.message };
  return {};
}
