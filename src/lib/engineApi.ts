import { supabase } from '@/lib/supabase';
import { collection } from '@/lib/doorsData';

// PREVIEW MODE: no backend (we are off the Famous database). The engine returns
// demo data built from the static collection so the studio + portal can be
// viewed. Set to false once DOORS is wired to its own Supabase edge function.
export const PREVIEW_MODE = true;

export interface EngineProperty {
  id?: string;
  ref: string;
  title: string;
  area: string;
  price_band: string;
  exact_price?: string | null;
  address?: string | null;
  size_sqm?: number | null;
  erf_sqm?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  summary?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  character?: string[] | null;
  gallery?: string[] | null;
  specifics?: string[] | null;
  discretion_level: 'public-curated' | 'registered-only' | 'fully-private';
  pipeline_stage: 'mandate_won' | 'matched' | 'introduction' | 'offer' | 'close';
  status?: string | null;
  is_published?: boolean;
  is_demo?: boolean;
  owner_id?: string | null;
  created_at?: string;
}

export interface EngineBuyer {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  budget_band?: string | null;
  area_interest?: string | null;
  timeline?: string | null;
  bedrooms_min?: number | null;
  priorities?: string[] | null;
  created_at?: string;
}

export interface EngineRequest {
  id: string;
  user_id: string;
  property_ref: string;
  request_type: string;
  message?: string | null;
  status: string;
  created_at: string;
}

export interface EngineOutreach {
  id: string;
  property_ref?: string | null;
  title?: string | null;
  kind: 'email' | 'editorial' | 'social';
  audience_note?: string | null;
  status: string;
  created_at: string;
}

export interface EngineTeam {
  id: string;
  full_name?: string | null;
  email?: string | null;
  role: 'admin' | 'agent';
}

export interface EngineSettings {
  id: number;
  mandate_marketing_unlocked: boolean;
  ffc_reference?: string | null;
  updated_at?: string;
}

export interface EngineIntro { id: string; user_id: string; property_ref: string }

export interface Overview {
  me: EngineTeam;
  isAdmin: boolean;
  properties: EngineProperty[];
  settings: EngineSettings;
  team: EngineTeam[];
  requests: EngineRequest[];
  outreach: EngineOutreach[];
  buyers: EngineBuyer[];
  introductions: EngineIntro[];
}

// ---------------------------------------------------------------------------
// Demo data for PREVIEW_MODE (no backend)
// ---------------------------------------------------------------------------
const demoMe: EngineTeam = { id: 'demo-admin', full_name: 'DOORS Team', email: 'team@doors-properties.com', role: 'admin' };

const demoProperties: EngineProperty[] = collection.map((p, i) => ({
  id: String(i + 1),
  ref: p.ref,
  title: p.title,
  area: p.area,
  price_band: p.priceBand,
  exact_price: p.exactPrice ?? null,
  address: p.address ?? null,
  size_sqm: p.sizeSqm ?? null,
  erf_sqm: p.erfSqm ?? null,
  bedrooms: p.bedrooms ?? null,
  bathrooms: p.bathrooms ?? null,
  summary: p.summary ?? null,
  image_url: p.image ?? null,
  video_url: p.video ?? null,
  character: p.character ?? null,
  gallery: p.gallery ?? null,
  specifics: p.specifics ?? null,
  discretion_level: p.private ? 'fully-private' : 'public-curated',
  pipeline_stage: i % 2 === 0 ? 'mandate_won' : 'matched',
  status: 'active',
  is_published: !p.private,
  is_demo: true,
}));

const demoBuyers: EngineBuyer[] = [
  { id: 'b1', full_name: 'A. Consolidating Family', email: 'family@example.com', phone: null, budget_band: 'R25m - R40m', area_interest: 'Knysna', timeline: 'Within 6 months', bedrooms_min: 4, priorities: ['Absolute privacy', 'Sea views'] },
  { id: 'b2', full_name: 'Semigrating Executive', email: 'exec@example.com', phone: null, budget_band: 'R15m - R25m', area_interest: 'Plettenberg Bay', timeline: 'Actively looking', bedrooms_min: 4, priorities: ['Secure estate', 'Family living'] },
];

const demoOverview: Overview = {
  me: demoMe,
  isAdmin: true,
  properties: demoProperties,
  settings: { id: 1, mandate_marketing_unlocked: false },
  team: [demoMe],
  requests: [
    { id: 'r1', user_id: 'b1', property_ref: demoProperties[0]?.ref ?? 'DR-204', request_type: 'viewing', message: 'Would love a private viewing.', status: 'open', created_at: '2026-06-20T10:00:00Z' },
  ],
  outreach: [
    { id: 'o1', property_ref: null, title: 'Quarterly market note to the private list', kind: 'editorial', audience_note: 'Registered buyers', status: 'draft', created_at: '2026-06-18T09:00:00Z' },
  ],
  buyers: demoBuyers,
  introductions: [],
};

function demoEngine<T>(action: string): { data?: T; error?: string } {
  if (action === 'whoami') return { data: { is_team: true } as unknown as T };
  if (action === 'overview') return { data: demoOverview as unknown as T };
  return { data: {} as unknown as T };
}

export async function engine<T = any>(action: string, payload: any = {}): Promise<{ data?: T; error?: string; status?: number }> {
  if (PREVIEW_MODE) return demoEngine<T>(action);
  const { data, error } = await supabase.functions.invoke('doors-engine', { body: { action, payload } });
  if (error) {
    let body: any = data;
    try {
      const ctx = (error as any).context;
      if (ctx && typeof ctx.json === 'function') body = await ctx.json();
    } catch { /* ignore */ }
    const code = body?.error;
    const message = body?.message || (typeof code === 'string' && code !== 'true' ? code : null) || error.message;
    return { error: code === 'not_team' ? 'not_team' : message, data: body };
  }
  if (data && (data as any).error) return { error: (data as any).message || (data as any).error, data };
  return { data: data as T };
}

export const DISCRETION_LABELS: Record<string, string> = {
  'public-curated': 'Public-curated',
  'registered-only': 'Registered-only',
  'fully-private': 'Fully private',
};

export const STAGES: { key: EngineProperty['pipeline_stage']; label: string }[] = [
  { key: 'mandate_won', label: 'Mandate won' },
  { key: 'matched', label: 'Matched to buyers' },
  { key: 'introduction', label: 'Introduction made' },
  { key: 'offer', label: 'Offer' },
  { key: 'close', label: 'Close' },
];
