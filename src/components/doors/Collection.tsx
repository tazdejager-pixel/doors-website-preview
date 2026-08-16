import React from 'react';
import { DoorsProperty } from '@/lib/doorsData';
import { usePublicCollection } from '@/lib/listings';
import PropertyCard from './PropertyCard';
import Reveal from './Reveal';

interface Props {
  onView: (p: DoorsProperty) => void;
}

const Collection: React.FC<Props> = ({ onView }) => {
  const { properties: publicCollection, loading } = usePublicCollection();

  // Until real mandates are loaded, everything on show is an architectural
  // showcase and must read as one. The moment a live mandate is published
  // (is_demo = false) the section speaks as a collection again, with each
  // showcase home still individually marked.
  const hasMandates = publicCollection.some((p) => !p.isShowcase);

  return (
    <section id="collection" className="bg-[#EFEBE5] py-28 sm:py-40">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="max-w-2xl mb-20">
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-6">
              {hasMandates ? 'A Glimpse of the Collection' : 'Architectural Showcase'}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#2C2C2C] font-light leading-[1.15]">
              {hasMandates
                ? 'A few of the homes we quietly represent.'
                : 'The calibre of home we are built to represent.'}
            </h2>
            <p className="text-[#2C2C2C]/70 text-base font-light leading-relaxed mt-7">
              {hasMandates
                ? `Most of what we hold is never published. What appears here is shown without address or
                   price - a short film and a few lines, an impression only. The full collection is shared
                   by introduction.`
                : `What follows is an architectural showcase, not a list of available homes. Each is an
                   illustration of the standard DOORS represents along the Garden Route. Our represented
                   homes are never published - they are held privately and shared by introduction only.`}
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#2C2C2C]/5" />
                  <div className="h-4 bg-[#2C2C2C]/5 mt-5 w-1/2" />
                  <div className="h-3 bg-[#2C2C2C]/5 mt-3 w-3/4" />
                </div>
              ))
            : publicCollection.map((p, i) => (
                <Reveal key={p.ref} delay={(i % 3) * 100}>
                  <PropertyCard property={p} onView={onView} />
                </Reveal>
              ))}
        </div>

        <Reveal>
          <p className="text-center text-[#2C2C2C]/70 text-sm font-light italic mt-20 max-w-xl mx-auto">
            {hasMandates
              ? `A number of homes are held entirely in private and never appear here. They are shown only
                 within the registered circle.`
              : `Homes marked as an architectural showcase are illustrative and are not available to view or
                 purchase. Represented homes are shown only within the registered circle.`}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Collection;
