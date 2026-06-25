import React, { useState } from 'react';
import { EngineProperty, DISCRETION_LABELS, STAGES } from '@/lib/engineApi';

const field = 'w-full bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm focus:border-[#C9A961] outline-none text-[#F8F6F3]';
const lbl = 'block text-[10px] tracking-[0.2em] uppercase text-[#F8F6F3]/45 mb-1.5';

const blank: EngineProperty = {
  ref: '', title: '', area: 'Knysna', price_band: '', exact_price: '', address: '',
  size_sqm: null, erf_sqm: null, bedrooms: null, bathrooms: null, summary: '',
  image_url: '', video_url: '', character: [], gallery: [], specifics: [],
  discretion_level: 'public-curated', pipeline_stage: 'mandate_won', status: 'available',
  is_published: true,
};

const ListingForm: React.FC<{
  initial?: EngineProperty | null;
  onCancel: () => void;
  onSave: (p: EngineProperty) => Promise<string | void>;
}> = ({ initial, onCancel, onSave }) => {
  const [p, setP] = useState<EngineProperty>(initial ? { ...blank, ...initial } : blank);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof EngineProperty, v: any) => setP((s) => ({ ...s, [k]: v }));
  const setList = (k: keyof EngineProperty, v: string) =>
    set(k, v.split('\n').map((s) => s.trim()).filter(Boolean));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!p.ref || !p.title || !p.price_band) { setErr('Reference, title and price band are required.'); return; }
    setBusy(true);
    const r = await onSave(p);
    setBusy(false);
    if (typeof r === 'string') setErr(r);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={lbl}>Reference</label><input className={field} value={p.ref} onChange={(e) => set('ref', e.target.value)} placeholder="DR-220" /></div>
        <div className="sm:col-span-2"><label className={lbl}>Title</label><input className={field} value={p.title} onChange={(e) => set('title', e.target.value)} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>Area (general)</label>
          <select className={field} value={p.area} onChange={(e) => set('area', e.target.value)}>
            {['Mossel Bay', 'George', 'Knysna', 'Plettenberg Bay'].map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div><label className={lbl}>Price band (public)</label><input className={field} value={p.price_band} onChange={(e) => set('price_band', e.target.value)} placeholder="R22m – R28m" /></div>
        <div><label className={lbl}>Exact price (private)</label><input className={field} value={p.exact_price || ''} onChange={(e) => set('exact_price', e.target.value)} placeholder="R24 500 000" /></div>
      </div>

      <div><label className={lbl}>Address (private — unlocks for registered buyers)</label><input className={field} value={p.address || ''} onChange={(e) => set('address', e.target.value)} /></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className={lbl}>Beds</label><input type="number" className={field} value={p.bedrooms ?? ''} onChange={(e) => set('bedrooms', e.target.value ? +e.target.value : null)} /></div>
        <div><label className={lbl}>Baths</label><input type="number" className={field} value={p.bathrooms ?? ''} onChange={(e) => set('bathrooms', e.target.value ? +e.target.value : null)} /></div>
        <div><label className={lbl}>Home m²</label><input type="number" className={field} value={p.size_sqm ?? ''} onChange={(e) => set('size_sqm', e.target.value ? +e.target.value : null)} /></div>
        <div><label className={lbl}>Erf m²</label><input type="number" className={field} value={p.erf_sqm ?? ''} onChange={(e) => set('erf_sqm', e.target.value ? +e.target.value : null)} /></div>
      </div>

      <div><label className={lbl}>Summary / character intro</label><textarea className={field + ' h-20'} value={p.summary || ''} onChange={(e) => set('summary', e.target.value)} /></div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={lbl}>Hero image URL</label><input className={field} value={p.image_url || ''} onChange={(e) => set('image_url', e.target.value)} /></div>
        <div><label className={lbl}>Video tour URL</label><input className={field} value={p.video_url || ''} onChange={(e) => set('video_url', e.target.value)} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className={lbl}>Character lines (one per line)</label><textarea className={field + ' h-24'} value={(p.character || []).join('\n')} onChange={(e) => setList('character', e.target.value)} /></div>
        <div><label className={lbl}>Gallery URLs (one per line)</label><textarea className={field + ' h-24'} value={(p.gallery || []).join('\n')} onChange={(e) => setList('gallery', e.target.value)} /></div>
        <div><label className={lbl}>Finer specifics (one per line)</label><textarea className={field + ' h-24'} value={(p.specifics || []).join('\n')} onChange={(e) => setList('specifics', e.target.value)} /></div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 border-t border-[#F8F6F3]/10 pt-5">
        <div>
          <label className={lbl}>Discretion level</label>
          <select className={field} value={p.discretion_level} onChange={(e) => set('discretion_level', e.target.value)}>
            {Object.entries(DISCRETION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <p className="text-[10px] text-[#F8F6F3]/40 mt-1.5 leading-relaxed">
            {p.discretion_level === 'public-curated' && 'Shows on the public collection as editorial; full detail unlocks for registered buyers.'}
            {p.discretion_level === 'registered-only' && 'Never public; visible only to matched registered buyers.'}
            {p.discretion_level === 'fully-private' && 'Never appears automatically; surfaced only by a deliberate introduction.'}
          </p>
        </div>
        <div>
          <label className={lbl}>Pipeline stage</label>
          <select className={field} value={p.pipeline_stage} onChange={(e) => set('pipeline_stage', e.target.value)}>
            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-[#F8F6F3]/70 cursor-pointer">
            <input type="checkbox" checked={!!p.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      {err && <p className="text-[#E07a5f] text-xs">{err}</p>}

      <div className="flex gap-3 pt-2">
        <button disabled={busy} className="bg-[#C9A961] text-[#1F1F1F] px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#d8b977] disabled:opacity-50">
          {busy ? 'Saving…' : 'Save home'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-[#F8F6F3]/55 hover:text-[#F8F6F3] border border-[#F8F6F3]/15">
          Cancel
        </button>
      </div>
      <p className="text-[10px] text-[#F8F6F3]/40 leading-relaxed">
        Entered once here. The editorial page, the registered-buyer detail and the shareable private property book are all produced automatically from this single record.
      </p>
    </form>
  );
};

export default ListingForm;
