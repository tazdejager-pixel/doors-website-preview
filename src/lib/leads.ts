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
}

export async function captureLead(payload: LeadPayload): Promise<{ error?: string }> {
  const { error } = await leadsClient.from('doors_enquiries').insert({
    kind: payload.kind,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    message: payload.message || null,
    budget_band: payload.budget_band || null,
    area_interest: payload.area_interest || null,
    property_ref: payload.property_ref || null,
    source: payload.source || payload.kind,
  });
  if (error) return { error: error.message };
  return {};
}
