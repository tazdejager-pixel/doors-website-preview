// Listings data layer. Listings live in the DOORS-owned Supabase (doors_properties),
// managed by the studio. The public site reads published public-curated homes; a
// signed-in buyer additionally sees the private homes they have been introduced to
// (both enforced by RLS). Rows are mapped to the DoorsProperty shape the UI expects.
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { DoorsProperty } from '@/lib/doorsData';

const BASE = import.meta.env.BASE_URL;

// Local images are stored relative (e.g. "images/foo.jpg"); resolve against the
// app base path. Remote (http) images pass through untouched.
const resolveImg = (u?: string | null): string => {
  if (!u) return '';
  return /^https?:\/\//.test(u) ? u : `${BASE}${u.replace(/^\//, '')}`;
};

export function mapRow(r: Record<string, any>): DoorsProperty {
  return {
    ref: r.ref,
    title: r.title,
    area: r.area,
    priceBand: r.price_band ?? '',
    sizeSqm: r.size_sqm ?? 0,
    bedrooms: r.bedrooms ?? 0,
    summary: r.summary ?? '',
    image: resolveImg(r.image_url),
    video: r.video_url ?? undefined,
    character: r.character ?? undefined,
    private: r.discretion_level === 'fully-private',
    exactPrice: r.exact_price ?? undefined,
    address: r.address ?? undefined,
    bathrooms: r.bathrooms ?? undefined,
    erfSqm: r.erf_sqm ?? undefined,
    gallery: Array.isArray(r.gallery) ? r.gallery.map(resolveImg) : undefined,
    specifics: r.specifics ?? undefined,
  };
}

// Published, public-curated listings - readable by anyone (RLS).
export function usePublicCollection() {
  const [properties, setProperties] = useState<DoorsProperty[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    supabase
      .from('doors_properties')
      .select('*')
      .eq('is_published', true)
      .eq('discretion_level', 'public-curated')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setProperties((data ?? []).map(mapRow));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { properties, loading };
}

// Everything a signed-in buyer may see: public-curated + any private homes they
// have been introduced to. RLS filters the rows; we just map them.
export async function fetchVisibleListings(): Promise<DoorsProperty[]> {
  const { data } = await supabase
    .from('doors_properties')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapRow);
}
