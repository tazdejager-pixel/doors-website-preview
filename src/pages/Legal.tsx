import React from 'react';
import { Link } from 'react-router-dom';

const Legal: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#2C2C2C]">
      <header className="border-b border-[#2C2C2C]/10">
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
          <Link to="/" className="font-serif tracking-[0.45em] text-xl">DOORS</Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961]">Privacy &amp; Legal</span>
        </div>
      </header>

      <div className="max-w-[760px] mx-auto px-6 sm:px-10 py-20">
        <h1 className="font-serif text-5xl font-light mb-3">Privacy &amp; Legal</h1>
        <p className="text-[#2C2C2C]/50 text-sm mb-14">Doors Properties (Pty) Ltd · George, Western Cape</p>

        <div className="space-y-12 text-[#2C2C2C]/65 text-[15px] font-light leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#2C2C2C] mb-3">Privacy is our default</h2>
            <p>
              Discretion is the whole point of DOORS. We collect only what we need to introduce buyers and
              sellers properly — your name, contact details, and what you are looking for or considering. We
              never publish addresses or exact prices, and we never sell or share your details with third
              parties for marketing.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2C2C2C] mb-3">How we use your information</h2>
            <p>
              The information you share is used solely to advise you, to introduce suitable homes or buyers,
              and to stay in touch about matters relevant to you. You may ask us to update or remove your
              details at any time by contacting the office in George.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2C2C2C] mb-3">Bands, not figures</h2>
            <p>
              On anything public, prices appear as bands rather than exact figures. The full collection,
              including detail and pricing, is shared only with our registered circle by private introduction.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#2C2C2C] mb-3">The entity</h2>
            <p>
              The brand DOORS is operated by Doors Properties (Pty) Ltd, a private company registered in South
              Africa, based in George and working the Garden Route corridor from Mossel Bay through Knysna to
              Plettenberg Bay.
            </p>
          </section>
        </div>

        <Link to="/" className="inline-block mt-16 text-xs tracking-[0.2em] uppercase border-b border-[#C9A961] pb-1 hover:text-[#C9A961]">
          Return home
        </Link>
      </div>
    </div>
  );
};

export default Legal;
