import React from 'react';
import { FOUNDER_IMG } from '@/lib/doorsData';
import Reveal from './Reveal';

const Founder: React.FC = () => {
  return (
    <section id="founder" className="bg-[#F8F6F3] py-28 sm:py-40">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <div className="relative">
            <img src={FOUNDER_IMG} alt="Chris, founder of DOORS" className="w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-5 -right-5 hidden sm:block bg-[#C9A961] text-[#2C2C2C] px-7 py-5">
              <p className="font-serif text-lg leading-none">Chris</p>
              <p className="text-[10px] tracking-[0.2em] uppercase mt-1">Founder</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-6">A Personal Word</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#2C2C2C] font-light leading-[1.15] mb-8">
              I counsel a small circle, personally.
            </h2>
            <div className="space-y-5 text-[#2C2C2C]/60 text-[15px] font-light leading-relaxed">
              <p>
                DOORS began with a simple conviction: that the people buying and selling the finest homes on this
                coast deserve judgement and privacy, not boards and billboards.
              </p>
              <p>
                I keep the circle small on purpose. I would rather know a handful of buyers and a handful of
                sellers well than chase a market I cannot serve properly. Every conversation is held in
                confidence, and every number is honest.
              </p>
              <p>
                If you are relocating within South Africa, semigrating to the Garden Route, or quietly considering
                a sale — I would be glad to talk. No obligation, and nothing made public.
              </p>
            </div>
            <p className="font-serif text-2xl text-[#2C2C2C] italic mt-8">— Chris</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Founder;
