// One-off: seed doors_properties from the static doorsData.ts collection as
// DUMMY data (is_demo=true) so the DB-backed site has content to show until
// Chris loads his real listings. Idempotent (upsert on ref).
//   node supabase/seed_listings.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), '../../../../'); // workspace root
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env'), 'utf8')
    .split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);
const URL = env.DOORS_SUPABASE_URL;
const KEY = env.DOORS_SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) throw new Error('DOORS_SUPABASE_URL / SERVICE_ROLE_KEY missing from .env');

// Extract the `collection` array literal from doorsData.ts and eval it as JS.
let src = fs.readFileSync('src/lib/doorsData.ts', 'utf8');
const m = src.match(/export const collection:[^=]*=\s*(\[[\s\S]*?\n\];)/);
if (!m) throw new Error('could not locate collection array');
const arrLiteral = m[1].replaceAll('${import.meta.env.BASE_URL}', ''); // local images become 'images/...'
const collection = eval(arrLiteral);

const rows = collection.map((p) => ({
  ref: p.ref,
  title: p.title,
  area: p.area,
  price_band: p.priceBand ?? null,
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
  pipeline_stage: 'mandate_won',
  status: 'active',
  is_published: !p.private,
  is_demo: true,
}));

const res = await fetch(`${URL}/rest/v1/doors_properties?on_conflict=ref`, {
  method: 'POST',
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify(rows),
});
const body = await res.json();
if (!res.ok) { console.error('FAILED', res.status, body); process.exit(1); }
console.log(`Seeded ${body.length} listings:`, body.map((r) => `${r.ref} (${r.discretion_level})`).join(', '));
