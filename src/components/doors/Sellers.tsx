import React from 'react';
import { REGION_IMG } from '@/lib/doorsData';
import Reveal from './Reveal';

interface Props {
  onSeller: () => void;
}

const assurances = [
  { t: 'No boards on the verge', d: 'Your address is never announced. Nothing is staked on the pavement for the street to read.' },
  { t: 'No public show days', d: 'No open houses, no foot traffic, no strangers walking your home. Viewings are by invitation only.' },
  { t: 'Never a portal listing', d: 'Your home does not appear on any property portal, with no price or photographs left to be browsed.' },
  { t: 'Shown to a known circle', d: 'Only registered, qualified buyers are introduced — and only those genuinely suited to your home.' },
];

const Sellers: React.FC<Props> = ({ onSeller }) => {
  return (
    <section id="sellers" className="bg-[#2C2C2C] py-28 sm:py-40">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <div>
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-6">For Sellers</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F3] font-light leading-[1.15] mb-8">
              Sold quietly, never advertised.
            </h2>
            <p className="text-[#F8F6F3]/65 text-base font-light leading-relaxed mb-12 max-w-md">
              An exceptional home deserves judgement, not exposure. We represent a small number of homes
              privately and introduce them, by hand, to the right buyer.
            </p>

            <div className="space-y-7">
              {assurances.map((a) => (
                <div key={a.t} className="flex gap-5">
                  <span className="mt-2 w-6 h-px bg-[#C9A961] shrink-0" />
                  <div>
                    <h3 className="text-[#F8F6F3] font-serif text-lg mb-1">{a.t}</h3>
                    <p className="text-[#F8F6F3]/55 text-sm font-light leading-relaxed">{a.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onSeller}
              className="mt-12 border border-[#C9A961] text-[#C9A961] px-9 py-4 text-xs tracking-[0.22em] uppercase hover:bg-[#C9A961] hover:text-[#2C2C2C] transition-colors"
            >
              Enquire about representation
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <img src={REGION_IMG} alt="" className="w-full aspect-[4/5] object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-[#F8F6F3]/10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Sellers;
