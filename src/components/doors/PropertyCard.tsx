import React from 'react';
import { DoorsProperty } from '@/lib/doorsData';

interface Props {
  property: DoorsProperty;
  onView: (p: DoorsProperty) => void;
}

const PropertyCard: React.FC<Props> = ({ property, onView }) => {
  return (
    <button onClick={() => onView(property)} className="group text-left w-full">
      <div className="relative overflow-hidden aspect-[4/3] bg-[#2C2C2C]/5">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        {property.video && (
          <div className="absolute top-4 left-4 flex items-center gap-2 text-[#F8F6F3]/90 text-[10px] tracking-[0.2em] uppercase">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Film
          </div>
        )}
        {property.isShowcase && (
          <div className="absolute top-4 right-4 bg-[#1d1d1d]/75 backdrop-blur-sm border border-[#C9A961]/50 px-3 py-1.5 text-[#C9A961] text-[9px] tracking-[0.2em] uppercase">
            Architectural Showcase
          </div>
        )}
        <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/30 transition-colors duration-500 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[11px] tracking-[0.2em] uppercase text-[#F8F6F3] border border-[#F8F6F3]/70 px-7 py-3.5">
            {property.isShowcase ? 'View the work' : 'View privately'}
          </span>
        </div>
      </div>

      <div className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#C9A961] text-[10px] tracking-[0.25em] uppercase">{property.area}</p>
          <p className="text-[#2C2C2C]/70 text-[10px] tracking-[0.2em] uppercase">{property.ref}</p>
        </div>
        <h3 className="font-serif text-2xl text-[#2C2C2C] leading-snug">{property.title}</h3>
        <p className="text-[#2C2C2C]/70 text-sm font-light leading-relaxed mt-3">{property.summary}</p>
        {/* Showcase homes carry no meta row. The "Architectural Showcase" badge on
            the image is the per-home marker Chris asked for, and the disclaimer is
            stated once at the end of the section rather than repeated on every
            card - client direction 16/08/2026. */}
        {!property.isShowcase && (
          <div className="flex items-center gap-5 mt-5 pt-5 border-t border-[#2C2C2C]/10 text-[#2C2C2C]/70 text-xs tracking-wide">
            <span>{property.priceBand}</span>
            <span className="w-px h-3 bg-[#2C2C2C]/15" />
            <span>{property.bedrooms} bed</span>
            <span className="w-px h-3 bg-[#2C2C2C]/15" />
            <span>{property.sizeSqm} m²</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default PropertyCard;
