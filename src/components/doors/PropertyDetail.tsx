import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorsProperty } from '@/lib/doorsData';
import { BrandName } from './Wordmark';

interface Props {
  property: DoorsProperty | null;
  onClose: () => void;
  onRequest: (p: DoorsProperty) => void;
}

const Lock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="5" y="11" width="14" height="9" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const PropertyDetail: React.FC<Props> = ({ property, onClose, onRequest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (property) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [property]);

  if (!property) return null;

  const held = [
    'The full gallery and floor plans',
    'Exact asking and the seller\u2019s position',
    'Precise location and address',
    'Title, compliance and supporting documents',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1d1d1d]">
      {/* Both controls return to the collection. The arrow reads as "back", the
          cross as "close" - deliberately obvious, per client feedback 28/07/2026. */}
      <button
        onClick={onClose}
        className="fixed top-6 left-6 z-10 flex items-center gap-3 bg-[#1d1d1d]/70 backdrop-blur-sm border border-[#F8F6F3]/25 px-5 py-3 text-[#F8F6F3]/85 hover:text-[#F8F6F3] hover:border-[#C9A961] transition-colors"
        aria-label="Back to the collection"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        <span className="text-[11px] tracking-[0.22em] uppercase">Back to the collection</span>
      </button>

      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-10 flex items-center justify-center w-12 h-12 bg-[#1d1d1d]/70 backdrop-blur-sm border border-[#F8F6F3]/25 text-[#F8F6F3]/85 hover:text-[#F8F6F3] hover:border-[#C9A961] transition-colors"
        aria-label="Close and return to the collection"
        title="Return to the collection"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="relative w-full h-[58vh] sm:h-[72vh] bg-black">
        {property.video ? (
          <video
            src={property.video}
            poster={property.image}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1d1d1d] to-transparent" />
      </div>

      <div className="max-w-[820px] mx-auto px-6 sm:px-10 pb-28 -mt-12 relative">
        <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-4">
          {property.isShowcase ? `${property.area} · Architectural Showcase` : property.area}
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F3] font-light leading-[1.12]">
          {property.title}
        </h2>

        {property.isShowcase ? (
          <p className="mt-7 text-[#F8F6F3]/50 text-xs tracking-wide italic">
            An illustration of the calibre of home DOORS represents. Not a property currently available.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-5 mt-7 text-[#F8F6F3]/65 text-xs tracking-wide">
            <span>{property.priceBand}</span>
            <span className="w-px h-3 bg-[#F8F6F3]/20" />
            <span>{property.bedrooms} bed</span>
            <span className="w-px h-3 bg-[#F8F6F3]/20" />
            <span>{property.sizeSqm} m²</span>

            <span className="text-[#F8F6F3]/35">{property.ref}</span>
          </div>
        )}

        <p className="text-[#F8F6F3]/70 text-lg font-light leading-relaxed mt-10 max-w-2xl">
          {property.summary}
        </p>

        {property.character && (
          <ul className="mt-10 space-y-4 border-t border-[#F8F6F3]/10 pt-10">
            {property.character.map((c) => (
              <li key={c} className="flex items-start gap-4 text-[#F8F6F3]/65 text-[15px] font-light">
                <span className="mt-2.5 w-1 h-1 rounded-full bg-[#C9A961] shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        )}

        {property.isShowcase ? (
          <>
            <div className="mt-14 border border-[#C9A961]/30 bg-[#C9A961]/[0.05] p-8 sm:p-10">
              <div className="text-[#C9A961] text-[11px] tracking-[0.25em] uppercase mb-6">
                Architectural Showcase
              </div>
              <p className="text-[#F8F6F3]/65 text-sm font-light leading-relaxed max-w-xl">
                This is part of our architectural showcase - a representation of the standard of home
                DOORS is built to represent. It is not a live mandate and is not available to view or
                purchase. Our represented homes are held privately and shared by introduction only.
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { onClose(); navigate('/register'); }}
                className="flex-1 bg-[#C9A961] text-[#2C2C2C] py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#F8F6F3] transition-colors"
              >
                Register as a buyer
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-[#F8F6F3]/40 text-[#F8F6F3] py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#F8F6F3] hover:text-[#2C2C2C] transition-colors"
              >
                Back to the collection
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-14 border border-[#F8F6F3]/12 bg-[#F8F6F3]/[0.03] p-8 sm:p-10">
              <div className="flex items-center gap-3 text-[#C9A961] text-[11px] tracking-[0.25em] uppercase mb-6">
                <Lock /> Held in confidence
              </div>
              <p className="text-[#F8F6F3]/60 text-sm font-light leading-relaxed mb-7 max-w-xl">
                What is shown here is an impression only. The finer detail is shared once you are
                registered as a buyer within the <BrandName tone="ivory" /> circle.
              </p>
              <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-8">
                {held.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-[#F8F6F3]/45 text-sm font-light">
                    <span className="text-[#F8F6F3]/30"><Lock /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onRequest(property)}
                className="flex-1 bg-[#C9A961] text-[#2C2C2C] py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#F8F6F3] transition-colors"
              >
                Request a private introduction
              </button>
              <button
                onClick={() => { onClose(); navigate('/register'); }}
                className="flex-1 border border-[#F8F6F3]/40 text-[#F8F6F3] py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#F8F6F3] hover:text-[#2C2C2C] transition-colors"
              >
                Register to view in full
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
