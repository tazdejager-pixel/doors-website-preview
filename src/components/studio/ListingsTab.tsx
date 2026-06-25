import React, { useState } from 'react';
import { EngineProperty, DISCRETION_LABELS, engine } from '@/lib/engineApi';
import ListingForm from './ListingForm';
import { Plus, BookOpen, Trash2, Pencil, X } from 'lucide-react';

const discTone: Record<string, string> = {
  'public-curated': 'text-[#9DC183] border-[#9DC183]/40',
  'registered-only': 'text-[#C9A961] border-[#C9A961]/40',
  'fully-private': 'text-[#E07a5f] border-[#E07a5f]/40',
};

const ListingsTab: React.FC<{ properties: EngineProperty[]; reload: () => void }> = ({ properties, reload }) => {
  const [editing, setEditing] = useState<EngineProperty | null>(null);
  const [creating, setCreating] = useState(false);
  const [book, setBook] = useState<EngineProperty | null>(null);

  const save = async (p: EngineProperty) => {
    const { error } = await engine('save_property', { property: p });
    if (error) return error;
    setEditing(null); setCreating(false); reload();
  };
  const del = async (id?: string) => {
    if (!id || !confirm('Remove this home entirely?')) return;
    await engine('delete_property', { id }); reload();
  };

  if (creating || editing) {
    return (
      <div className="max-w-4xl">
        <h2 className="font-serif text-2xl mb-6">{creating ? 'New home' : `Editing ${editing?.ref}`}</h2>
        <ListingForm initial={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSave={save} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl">The Collection</h2>
          <p className="text-[#F8F6F3]/45 text-sm">{properties.length} homes · entered once, published everywhere automatically.</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[#C9A961] text-[#1F1F1F] px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#d8b977]">
          <Plus size={15} /> New home
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {properties.map((p) => (
          <div key={p.id} className="bg-[#262626] border border-[#F8F6F3]/8 overflow-hidden">
            <div className="flex">
              <div className="w-32 h-32 shrink-0 bg-[#1F1F1F]" style={{ backgroundImage: `url(${p.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.2em] text-[#F8F6F3]/40">{p.ref} · {p.area}</p>
                    <h3 className="font-serif text-lg truncate">{p.title}</h3>
                  </div>
                  {p.is_demo && <span className="shrink-0 text-[9px] tracking-[0.15em] uppercase bg-[#E07a5f]/20 text-[#E07a5f] px-2 py-0.5">Demo</span>}
                </div>
                <p className="text-[#F8F6F3]/55 text-xs mt-1">{p.price_band}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className={`text-[9px] tracking-[0.12em] uppercase border px-1.5 py-0.5 ${discTone[p.discretion_level]}`}>{DISCRETION_LABELS[p.discretion_level]}</span>
                  {!p.is_published && <span className="text-[9px] tracking-[0.12em] uppercase border border-[#F8F6F3]/20 text-[#F8F6F3]/45 px-1.5 py-0.5">Unpublished</span>}
                </div>
              </div>
            </div>
            <div className="flex border-t border-[#F8F6F3]/8 text-[11px] tracking-[0.12em] uppercase">
              <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#F8F6F3]/60 hover:bg-[#F8F6F3]/5"><Pencil size={13} /> Edit</button>
              <button onClick={() => setBook(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#F8F6F3]/60 hover:bg-[#F8F6F3]/5 border-x border-[#F8F6F3]/8"><BookOpen size={13} /> Book</button>
              <button onClick={() => del(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[#E07a5f]/70 hover:bg-[#E07a5f]/5"><Trash2 size={13} /> Remove</button>
            </div>
          </div>
        ))}
      </div>

      {book && <PropertyBook p={book} onClose={() => setBook(null)} />}
    </div>
  );
};

const PropertyBook: React.FC<{ p: EngineProperty; onClose: () => void }> = ({ p, onClose }) => {
  const outputs: string[] = [];
  if (p.discretion_level === 'public-curated' && p.is_published) outputs.push('Public editorial page (hero, video, area, price band)');
  if (p.discretion_level !== 'fully-private') outputs.push('Registered-buyer detail (full gallery, exact figures, address)');
  outputs.push('Shareable private property book (this document)');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#F8F6F3] text-[#2C2C2C] max-w-2xl w-full max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={p.image_url || ''} className="w-full h-56 object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full"><X size={18} /></button>
          <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase bg-[#2C2C2C] text-[#C9A961] px-3 py-1">Private Property Book</span>
        </div>
        <div className="p-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#9a8a6a]">{p.ref} · {p.area}</p>
          <h3 className="font-serif text-3xl mt-1">{p.title}</h3>
          <p className="text-[#2C2C2C]/70 mt-3 leading-relaxed">{p.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
            <Stat label="Guide" value={p.exact_price || p.price_band} />
            <Stat label="Beds" value={String(p.bedrooms ?? '—')} />
            <Stat label="Baths" value={String(p.bathrooms ?? '—')} />
            <Stat label="Erf" value={p.erf_sqm ? `${p.erf_sqm} m²` : '—'} />
          </div>
          {p.address && <p className="mt-5 text-sm"><span className="text-[#9a8a6a] uppercase tracking-[0.15em] text-[10px]">Address</span><br />{p.address}</p>}

          {!!(p.specifics && p.specifics.length) && (
            <div className="mt-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a8a6a] mb-2">The finer detail</p>
              <ul className="space-y-1.5 text-sm">{p.specifics.map((s, i) => <li key={i}>— {s}</li>)}</ul>
            </div>
          )}

          <div className="mt-7 border-t border-[#2C2C2C]/10 pt-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a8a6a] mb-2">Auto-produced from this single record</p>
            <ul className="space-y-1 text-sm text-[#2C2C2C]/70">{outputs.map((o, i) => <li key={i}>• {o}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><p className="text-[10px] tracking-[0.15em] uppercase text-[#9a8a6a]">{label}</p><p className="font-serif text-lg">{value}</p></div>
);

export default ListingsTab;
