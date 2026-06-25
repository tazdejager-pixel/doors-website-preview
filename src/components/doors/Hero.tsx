import React from 'react';
import { HERO_IMG } from '@/lib/doorsData';

interface Props {
  onEnquire: () => void;
}

const Hero: React.FC<Props> = ({ onEnquire }) => {
  const scrollDown = () => {
    const el = document.getElementById('philosophy');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <img src={HERO_IMG} alt="A Garden Route estate at golden hour" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/40 via-[#2C2C2C]/20 to-[#2C2C2C]/55" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-[#F8F6F3]/80 text-[11px] sm:text-xs tracking-[0.4em] uppercase mb-8 animate-[fadeIn_1.4s_ease]">
          Garden Route · By Private Introduction
        </p>
        <h1 className="font-serif text-[#F8F6F3] text-5xl sm:text-7xl lg:text-8xl font-light leading-[1.05] animate-[fadeIn_1.8s_ease]">
          The Key to
          <br />
          <span className="italic">Extraordinary</span>
        </h1>
        <p className="text-[#F8F6F3]/85 text-base sm:text-lg font-light max-w-xl mt-8 leading-relaxed animate-[fadeIn_2.2s_ease]">
          A private brokerage for the coast's most exceptional homes. We open doors — we do not sell houses.
        </p>
        <button
          onClick={onEnquire}
          className="mt-10 text-[11px] tracking-[0.25em] uppercase text-[#F8F6F3] border border-[#F8F6F3]/60 px-9 py-4 hover:bg-[#F8F6F3] hover:text-[#2C2C2C] transition-colors animate-[fadeIn_2.6s_ease]"
        >
          Request an introduction
        </button>
      </div>

      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#F8F6F3]/70 hover:text-[#F8F6F3] transition-colors"
        aria-label="Scroll down"
      >
        <svg width="22" height="34" viewBox="0 0 22 34" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="1" y="1" width="20" height="32" rx="10" />
          <circle cx="11" cy="9" r="2" fill="currentColor" stroke="none" className="animate-[scrollDot_1.8s_ease_infinite]" />
        </svg>
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scrollDot { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(10px); opacity: 0; } 100% { opacity: 0; } }
      `}</style>
    </section>
  );
};

export default Hero;
