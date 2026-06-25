import React from 'react';
import { COLLECTION_IMG } from '@/lib/doorsData';
import Reveal from './Reveal';

interface Props {
  onBuyer: () => void;
  onSeller: () => void;
}

const RegisterCTA: React.FC<Props> = ({ onBuyer, onSeller }) => {
  return (
    <section id="register" className="relative py-28 sm:py-40 overflow-hidden">
      <img src={COLLECTION_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#2C2C2C]/80" />
      <div className="relative max-w-[1100px] mx-auto px-6 sm:px-10 text-center">
        <Reveal>
          <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-6">By Introduction</p>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#F8F6F3] font-light leading-[1.1] mb-6">
            Quietly begin.
          </h2>
          <p className="text-[#F8F6F3]/75 text-base sm:text-lg font-light max-w-xl mx-auto leading-relaxed mb-14">
            Whether you are looking for an extraordinary home or considering the sale of one, the first step is
            a private conversation.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={onBuyer}
              className="group bg-[#F8F6F3] text-[#2C2C2C] p-10 text-left hover:bg-[#C9A961] transition-colors duration-500"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] group-hover:text-[#2C2C2C] mb-4">For Buyers</p>
              <h3 className="font-serif text-2xl mb-3">Register to be introduced</h3>
              <p className="text-[#2C2C2C]/55 group-hover:text-[#2C2C2C]/70 text-sm font-light">
                Join the registered circle and be shown homes that never reach the market.
              </p>
            </button>
            <button
              onClick={onSeller}
              className="group bg-transparent border border-[#F8F6F3]/40 text-[#F8F6F3] p-10 text-left hover:bg-[#F8F6F3] hover:text-[#2C2C2C] transition-colors duration-500"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-4">For Sellers</p>
              <h3 className="font-serif text-2xl mb-3">Speak about a sale</h3>
              <p className="text-[#F8F6F3]/60 group-hover:text-[#2C2C2C]/70 text-sm font-light">
                A confidential discussion about representing your home — without advertising it.
              </p>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default RegisterCTA;
