import React from 'react';
import { DoorsProperty } from '@/lib/doorsData';
import { Heart, Film } from 'lucide-react';

interface Props {
  property: DoorsProperty;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}

const PortalCard: React.FC<Props> = ({ property: p, saved, onToggleSave, onOpen }) => (
  <div className="group">
    <button onClick={onOpen} className="relative block w-full overflow-hidden aspect-[4/3] bg-[#2C2C2C]/5 text-left">
      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
      {p.private && (
        <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-[#2C2C2C] text-[#C9A961] px-2.5 py-1">
          Private
        </span>
      )}
      {p.video && (
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-white/90">
          <Film size={12} /> Film
        </span>
      )}
    </button>
    <div className="pt-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[#C9A961] text-[10px] tracking-[0.25em] uppercase">{p.area} · {p.ref}</p>
          <h3 className="font-serif text-xl leading-snug mt-1 truncate">{p.title}</h3>
        </div>
        <button
          onClick={onToggleSave}
          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center border transition-colors ${saved ? 'bg-[#C9A961] border-[#C9A961] text-[#F8F6F3]' : 'border-[#2C2C2C]/20 text-[#2C2C2C]/60 hover:border-[#C9A961]'}`}
          aria-label={saved ? 'Remove from saved' : 'Save home'}
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex items-center gap-3 mt-3 text-[#2C2C2C]/60 text-xs">
        <span>{p.exactPrice || p.priceBand}</span>
        <span className="w-px h-3 bg-[#2C2C2C]/15" />
        <span>{p.bedrooms} bed</span>
        <span className="w-px h-3 bg-[#2C2C2C]/15" />
        <span>{p.sizeSqm} m²</span>
      </div>
      <button
        onClick={onOpen}
        className="inline-block mt-4 text-[11px] tracking-[0.2em] uppercase border-b border-[#C9A961] pb-1 hover:text-[#C9A961] transition-colors"
      >
        View in full
      </button>
    </div>
  </div>
);

export default PortalCard;
