import React from 'react';
import { EngineProperty, EngineRequest, EngineBuyer, STAGES, engine } from '@/lib/engineApi';
import { ArrowRight } from 'lucide-react';

const PipelineTab: React.FC<{
  properties: EngineProperty[];
  requests: EngineRequest[];
  buyers: EngineBuyer[];
  reload: () => void;
}> = ({ properties, requests, buyers, reload }) => {
  const move = async (p: EngineProperty, stage: string) => {
    await engine('update_pipeline', { id: p.id, stage });
    reload();
  };
  const setReq = async (id: string, status: string) => {
    await engine('update_request', { id, status });
    reload();
  };
  const buyerName = (uid: string) => {
    const b = buyers.find((x) => x.id === uid);
    return b?.full_name || b?.email || 'A buyer';
  };
  const openReqs = requests.filter((r) => r.status !== 'closed');

  return (
    <div>
      <h2 className="font-serif text-2xl mb-1">Sales Pipeline</h2>
      <p className="text-[#F8F6F3]/45 text-sm mb-6">Where every home sits on the journey, and who is asking to view.</p>

      {!!openReqs.length && (
        <div className="bg-[#262626] border border-[#C9A961]/30 p-5 mb-7">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A961] mb-3">Viewing & introduction requests</p>
          <div className="space-y-2">
            {openReqs.map((r) => {
              const p = properties.find((x) => x.ref === r.property_ref);
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 flex-wrap text-sm border-b border-[#F8F6F3]/8 pb-2 last:border-0">
                  <div className="min-w-0">
                    <span className="text-[#F8F6F3]">{buyerName(r.user_id)}</span>
                    <span className="text-[#F8F6F3]/45"> · {r.request_type} · {p?.title || r.property_ref}</span>
                    {r.message && <p className="text-[#F8F6F3]/40 text-xs italic mt-0.5">"{r.message}"</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {r.status === 'new' && <button onClick={() => setReq(r.id, 'arranging')} className="text-[11px] tracking-[0.12em] uppercase text-[#C9A961] hover:underline">Arranging</button>}
                    <button onClick={() => setReq(r.id, 'closed')} className="text-[11px] tracking-[0.12em] uppercase text-[#F8F6F3]/45 hover:underline">Close</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {STAGES.map((s, si) => {
          const homes = properties.filter((p) => p.pipeline_stage === s.key);
          return (
            <div key={s.key} className="bg-[#222] border border-[#F8F6F3]/8 p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#F8F6F3]/55">{s.label}</p>
                <span className="text-[10px] text-[#F8F6F3]/35">{homes.length}</span>
              </div>
              <div className="space-y-2">
                {homes.map((p) => (
                  <div key={p.id} className="bg-[#2C2C2C] border border-[#F8F6F3]/8 p-3">
                    <p className="text-[9px] tracking-[0.15em] text-[#F8F6F3]/35">{p.ref}</p>
                    <p className="font-serif text-sm leading-snug">{p.title}</p>
                    <p className="text-[11px] text-[#F8F6F3]/45 mt-1">{p.price_band}</p>
                    {si < STAGES.length - 1 && (
                      <button onClick={() => move(p, STAGES[si + 1].key)} className="mt-2 flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-[#C9A961] hover:underline">
                        {STAGES[si + 1].label} <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                ))}
                {!homes.length && <p className="text-[11px] text-[#F8F6F3]/25">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineTab;
