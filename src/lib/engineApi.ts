import { supabase } from '@/lib/supabase';

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

export async function engine<T = any>(action: string, payload: any = {}): Promise<{ data?: T; error?: string; status?: number }> {
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
