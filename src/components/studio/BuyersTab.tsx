import React, { useMemo, useState } from 'react';
import { EngineBuyer, EngineProperty, EngineIntro, engine } from '@/lib/engineApi';
import { Check, UserPlus, Phone, Mail, Target } from 'lucide-react';

// crude price-band parsing to a midpoint in millions
function bandMid(s?: string | null): number | null {
  if (!s) return null;
  const nums = (s.match(/\d+/g) || []).map(Number);
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function fitScore(b: EngineBuyer, p: EngineProperty): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  // area
  if (b.area_interest && (b.area_interest === p.area || b.area_interest === 'Across the corridor')) { score += 3; reasons.push('Area'); }
  // budget
  const bm = bandMid(b.budget_band); const pm = bandMid(p.price_band);
  if (bm && pm && Math.abs(bm - pm) <= Math.max(8, pm * 0.35)) { score += 3; reasons.push('Budget'); }
  // bedrooms
  if (b.bedrooms_min && p.bedrooms && p.bedrooms >= b.bedrooms_min) { score += 1; reasons.push('Beds'); }
  // priorities heuristic
  const prio = (b.priorities || []).join(' ').toLowerCase();
  const text = `${p.summary} ${(p.character || []).join(' ')} ${(p.specifics || []).join(' ')}`.toLowerCase();
  let pHit = 0;
  (b.priorities || []).forEach((x) => { if (text.includes(x.toLowerCase().split(' ')[0])) pHit++; });
  if (pHit) { score += pHit; reasons.push(`${pHit} priorities`); }
  return { score, reasons };
}

const BuyersTab: React.FC<{
  buyers: EngineBuyer[];
  properties: EngineProperty[];
  introductions: EngineIntro[];
  reload: () => void;
}> = ({ buyers, properties, introductions, reload }) => {
  const [mode, setMode] = useState<'database' | 'match'>('database');
  const [homeRef, setHomeRef] = useState<string>(properties[0]?.ref || '');
  const [busy, setBusy] = useState<string>('');

  const home = properties.find((p) => p.ref === homeRef);
  const introSet = useMemo(() => new Set(introductions.map((i) => `${i.user_id}|${i.property_ref}`)), [introductions]);

  const ranked = useMemo(() => {
    if (!home) return [];
    return buyers
      .map((b) => ({ b, ...fitScore(b, home) }))
      .sort((a, z) => z.score - a.score);
  }, [buyers, home]);

  const toggleIntro = async (b: EngineBuyer) => {
    if (!home) return;
    const key = `${b.id}|${home.ref}`;
    setBusy(key);
    if (introSet.has(key)) await engine('remove_introduction', { user_id: b.id, property_ref: home.ref });
    else await engine('make_introduction', { user_id: b.id, property_ref: home.ref });
    setBusy(''); reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl">Buyer Database</h2>
          <p className="text-[#F8F6F3]/45 text-sm">{buyers.length} qualified buyers · self-registered and team-added.</p>
        </div>
        <div className="flex border border-[#F8F6F3]/15 text-[11px] tracking-[0.15em] uppercase">
          {(['database', 'match'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 ${mode === m ? 'bg-[#C9A961] text-[#1F1F1F]' : 'text-[#F8F6F3]/55'}`}>
              {m === 'database' ? 'Buyers' : 'Match a home'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'database' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyers.map((b) => (
            <div key={b.id} className="bg-[#262626] border border-[#F8F6F3]/8 p-5">
              <h3 className="font-serif text-lg">{b.full_name || 'Unnamed buyer'}</h3>
              <div className="mt-2 space-y-1 text-xs text-[#F8F6F3]/55">
                {b.email && <p className="flex items-center gap-2"><Mail size={12} /> {b.email}</p>}
                {b.phone && <p className="flex items-center gap-2"><Phone size={12} /> {b.phone}</p>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <Tag label="Budget" v={b.budget_band} />
                <Tag label="Area" v={b.area_interest} />
                <Tag label="Timeline" v={b.timeline} />
                <Tag label="Min beds" v={b.bedrooms_min ? String(b.bedrooms_min) : null} />
              </div>
              {!!(b.priorities && b.priorities.length) && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.priorities.map((p) => <span key={p} className="text-[9px] tracking-[0.1em] uppercase border border-[#C9A961]/30 text-[#C9A961] px-1.5 py-0.5">{p}</span>)}
                </div>
              )}
            </div>
          ))}
          {!buyers.length && <p className="text-[#F8F6F3]/45 text-sm">No buyers registered yet.</p>}
        </div>
      ) : (
        <div>
          <div className="bg-[#262626] border border-[#F8F6F3]/8 p-5 mb-5 flex items-center gap-3 flex-wrap">
            <Target size={16} className="text-[#C9A961]" />
            <span className="text-sm text-[#F8F6F3]/60">Match buyers to</span>
            <select value={homeRef} onChange={(e) => setHomeRef(e.target.value)} className="bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3] flex-1 min-w-[200px]">
              {properties.map((p) => <option key={p.ref} value={p.ref}>{p.ref} · {p.title}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {ranked.map(({ b, score, reasons }) => {
              const key = `${b.id}|${home?.ref}`;
              const introduced = introSet.has(key);
              return (
                <div key={b.id} className="bg-[#262626] border border-[#F8F6F3]/8 p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif shrink-0 ${score >= 5 ? 'bg-[#9DC183]/20 text-[#9DC183]' : score >= 3 ? 'bg-[#C9A961]/20 text-[#C9A961]' : 'bg-[#F8F6F3]/10 text-[#F8F6F3]/50'}`}>
                      {score}
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-base truncate">{b.full_name || b.email || 'Unnamed buyer'}</p>
                      <p className="text-xs text-[#F8F6F3]/45 truncate">{b.budget_band || '—'} · {b.area_interest || '—'}{reasons.length ? ` · ${reasons.join(', ')}` : ''}</p>
                    </div>
                  </div>
                  <button
                    disabled={busy === key}
                    onClick={() => toggleIntro(b)}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase shrink-0 ${introduced ? 'bg-[#9DC183]/15 text-[#9DC183] border border-[#9DC183]/40' : 'bg-[#C9A961] text-[#1F1F1F] hover:bg-[#d8b977]'} disabled:opacity-50`}
                  >
                    {introduced ? <><Check size={13} /> Introduced</> : <><UserPlus size={13} /> Introduce</>}
                  </button>
                </div>
              );
            })}
            {!buyers.length && <p className="text-[#F8F6F3]/45 text-sm">No buyers to match yet.</p>}
          </div>
          <p className="text-[10px] text-[#F8F6F3]/40 mt-4 leading-relaxed max-w-xl">
            An introduction makes this home visible to that buyer in their portal. Fully-private homes only ever reach a buyer through a deliberate introduction here. Every viewing is still arranged personally.
          </p>
        </div>
      )}
    </div>
  );
};

const Tag: React.FC<{ label: string; v?: string | null }> = ({ label, v }) => (
  <div className="bg-[#1F1F1F] px-2 py-1.5">
    <p className="text-[9px] tracking-[0.12em] uppercase text-[#F8F6F3]/35">{label}</p>
    <p className="text-[#F8F6F3]/70 truncate">{v || '—'}</p>
  </div>
);

export default BuyersTab;
