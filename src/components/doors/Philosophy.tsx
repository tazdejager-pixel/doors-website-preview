import React from 'react';
import Reveal from './Reveal';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="bg-[#F8F6F3] py-28 sm:py-40">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-24 sm:mb-32">
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-7">The DOORS Approach</p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2C2C] font-light leading-[1.2]">
              At the very top of the market, the best homes never reach it.
            </h2>
            <p className="text-[#2C2C2C]/55 text-base sm:text-lg font-light leading-relaxed mt-8">
              No boards on the verge. No public show days. No address and price for everyone to browse.
              The open market is built for volume. The extraordinary asks for discretion.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 sm:gap-16">
          {[
            {
              n: '01',
              title: 'Access by Introduction',
              body: 'Homes are shown to a small, registered circle - never advertised to the open market. You are introduced, not sold to.',
            },
            {
              n: '02',
              title: 'A Private Collection',
              body: 'A curated, mostly-unadvertised group of exceptional homes along the coast. Quality over quantity, always.',
            },
            {
              n: '03',
              title: 'Advisory, Not Sales',
              body: 'Honest, numerate counsel from an advisor who knows the market - not a salesperson chasing a transaction.',
            },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 120}>
              <div className="text-center md:text-left">
                <span className="font-serif text-[#C9A961] text-2xl">{item.n}</span>
                <h3 className="font-serif text-2xl text-[#2C2C2C] mt-4 mb-4">{item.title}</h3>
                <p className="text-[#2C2C2C]/55 text-[15px] font-light leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
