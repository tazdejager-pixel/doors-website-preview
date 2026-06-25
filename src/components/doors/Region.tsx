import React from 'react';
import { REGION_IMG } from '@/lib/doorsData';
import Reveal from './Reveal';

const towns = [
  { name: 'Mossel Bay', note: 'The corridor begins' },
  { name: 'George', note: 'Home of DOORS' },
  { name: 'Knysna', note: 'Lagoon & headlands' },
  { name: 'Plettenberg Bay', note: 'Beachfront & estates' },
];

const Region: React.FC = () => {
  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <img src={REGION_IMG} alt="The Garden Route coastline" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#2C2C2C]/45" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[#F8F6F3]/75 text-[11px] tracking-[0.3em] uppercase mb-6">The Corridor We Know</p>
              <h2 className="font-serif text-4xl sm:text-6xl text-[#F8F6F3] font-light leading-tight">
                Mossel Bay to Plettenberg Bay
              </h2>
              <p className="text-[#F8F6F3]/80 text-base font-light leading-relaxed mt-6 max-w-lg mx-auto">
                One stretch of coast, known intimately. Based in George, we work the whole corridor — quietly,
                and on foot where it matters.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-[#2C2C2C]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 grid grid-cols-2 md:grid-cols-4">
          {towns.map((t, i) => (
            <div
              key={t.name}
              className={`py-10 sm:py-14 text-center ${i < towns.length - 1 ? 'md:border-r' : ''} ${
                i < 2 ? 'border-b md:border-b-0' : ''
              } ${i % 2 === 0 ? 'border-r md:border-r' : ''} border-[#F8F6F3]/10`}
            >
              <h3 className="font-serif text-[#F8F6F3] text-xl sm:text-2xl">{t.name}</h3>
              <p className="text-[#C9A961] text-[10px] tracking-[0.2em] uppercase mt-2">{t.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Region;
