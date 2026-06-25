import React, { useState } from 'react';
import { EngineProperty, EngineOutreach, EngineSettings, engine } from '@/lib/engineApi';
import { Lock, Mail, Newspaper, Share2, Plus } from 'lucide-react';

const kindMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  email: { icon: <Mail size={14} />, label: 'Private email introduction' },
  editorial: { icon: <Newspaper size={14} />, label: 'Discreet editorial' },
  social: { icon: <Share2 size={14} />, label: 'Low-volume social' },
};

const MarketingTab: React.FC<{
  outreach: EngineOutreach[];
  properties: EngineProperty[];
  settings: EngineSettings;
  reload: () => void;
}> = ({ outreach, properties, settings, reload }) => {
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState(properties[0]?.ref || '');
  const [kind, setKind] = useState<'email' | 'editorial' | 'social'>('email');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setErr(''); setBusy(true);
    const { error } = await engine('create_outreach', { property_ref: ref, kind, title, audience_note: note });
    setBusy(false);
    if (error) { setErr(error); return; }
    setOpen(false); setTitle(''); setNote(''); reload();
  };
  const setStatus = async (id: string, status: string) => { await engine('update_outreach_status', { id, status }); reload(); };

  const gateClosed = !settings?.mandate_marketing_unlocked;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl">Marketing</h2>
          <p className="text-[#F8F6F3]/45 text-sm">Deliberately quiet, deliberately selective.</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-[#C9A961] text-[#1F1F1F] px-4 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#d8b977]">
          <Plus size={15} /> New outreach
        </button>
      </div>

      {gateClosed && (
        <div className="bg-[#E07a5f]/10 border border-[#E07a5f]/30 p-4 mb-6 flex items-start gap-3">
          <Lock size={16} className="text-[#E07a5f] mt-0.5 shrink-0" />
          <p className="text-sm text-[#F8F6F3]/70 leading-relaxed">
            The launch gate is closed. You can build the brand and the buyer database, but active marketing of
            live public mandates is locked until the Fidelity Fund Certificate is held. Registered-only and
            fully-private outreach to the known circle is still permitted.
          </p>
        </div>
      )}

      {open && (
        <div className="bg-[#262626] border border-[#F8F6F3]/10 p-5 mb-6 max-w-xl">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A961] mb-4">New private outreach</p>
          <div className="space-y-3">
            <select value={ref} onChange={(e) => setRef(e.target.value)} className="w-full bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]">
              {properties.map((p) => <option key={p.ref} value={p.ref}>{p.ref} · {p.title}</option>)}
            </select>
            <div className="flex gap-2">
              {(['email', 'editorial', 'social'] as const).map((k) => (
                <button key={k} onClick={() => setKind(k)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] tracking-[0.1em] uppercase border ${kind === k ? 'border-[#C9A961] text-[#C9A961]' : 'border-[#F8F6F3]/15 text-[#F8F6F3]/50'}`}>
                  {kindMeta[k].icon} {k}
                </button>
              ))}
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Internal title" className="w-full bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]" />
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Audience note - who in the circle this reaches" className="w-full bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3] h-20" />
            {err && <p className="text-[#E07a5f] text-xs">{err === 'gate_closed' ? 'Locked by the launch gate.' : err}</p>}
            <div className="flex gap-3">
              <button disabled={busy} onClick={create} className="bg-[#C9A961] text-[#1F1F1F] px-5 py-2 text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#d8b977] disabled:opacity-50">Save draft</button>
              <button onClick={() => setOpen(false)} className="px-5 py-2 text-xs tracking-[0.18em] uppercase text-[#F8F6F3]/55 border border-[#F8F6F3]/15">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {outreach.map((o) => {
          const p = properties.find((x) => x.ref === o.property_ref);
          return (
            <div key={o.id} className="bg-[#262626] border border-[#F8F6F3]/8 p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[#C9A961]">{kindMeta[o.kind]?.icon}</span>
                <div className="min-w-0">
                  <p className="font-serif text-base truncate">{o.title || kindMeta[o.kind]?.label}</p>
                  <p className="text-xs text-[#F8F6F3]/45 truncate">{p?.title || o.property_ref} · {o.audience_note}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 ${o.status === 'sent' ? 'bg-[#9DC183]/15 text-[#9DC183]' : 'bg-[#F8F6F3]/10 text-[#F8F6F3]/50'}`}>{o.status}</span>
                {o.status === 'draft' && <button onClick={() => setStatus(o.id, 'sent')} className="text-[11px] tracking-[0.1em] uppercase text-[#C9A961] hover:underline">Send to circle</button>}
              </div>
            </div>
          );
        })}
        {!outreach.length && <p className="text-[#F8F6F3]/45 text-sm">No outreach yet.</p>}
      </div>
    </div>
  );
};

export default MarketingTab;
