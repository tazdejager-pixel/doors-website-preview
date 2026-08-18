import React from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from './Wordmark';

interface Props {
  onEnquire: () => void;
}

const Footer: React.FC<Props> = ({ onEnquire }) => {
  return (
    <footer className="bg-onyx text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-5"><Wordmark tone="gold" size="lg" /></div>
            <p className="text-ivory/55 text-sm font-light leading-relaxed max-w-sm">
              The Key to Extraordinary. A private property brokerage for the Garden Route's most exceptional
              homes - by introduction, never advertised.
            </p>
          </div>


          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-5">The Office</p>
            <p className="text-[#F8F6F3]/60 text-sm font-light leading-relaxed">
              George<br />Garden Route<br />Western Cape, South Africa
            </p>
            <button onClick={onEnquire} className="mt-5 text-sm text-[#F8F6F3] border-b border-[#C9A961] pb-0.5 hover:text-[#C9A961] transition-colors">
              Enquire privately
            </button>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-5">Explore</p>
            <ul className="space-y-3 text-sm text-ivory/60 font-light">
              <li><Link to="/register" className="hover:text-ivory transition-colors">Register</Link></li>
              <li><Link to="/signin" className="hover:text-ivory transition-colors">Sign In</Link></li>
              <li><Link to="/legal" className="hover:text-ivory transition-colors">Privacy &amp; Legal</Link></li>
              <li><Link to="/signin" className="hover:text-ivory transition-colors">DOORS Engine</Link></li>
            </ul>
          </div>
        </div>


        {/* Statutory footer - wording fixed by C Dreyer 12/08/2026. The PPRA
            registration and FFC number are a regulatory requirement, not copy.
            Do not reword or abbreviate. */}
        <div className="border-t border-[#F8F6F3]/10 pt-8 text-[#F8F6F3]/45 text-xs font-light leading-relaxed">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-0.5">
              <p className="text-[#F8F6F3]/60">C DREYER</p>
              <p>DOORS (PTY) LTD T/A DOORS PROPERTIES</p>
              <p>REGISTERED WITH THE PPRA - FFC 202614020700000</p>
              <p>
                <a href="tel:+27824583334" className="hover:text-[#C9A961] transition-colors">082 458 3334</a>
                <span className="px-2 text-[#F8F6F3]/25">|</span>
                <a href="mailto:chris@wildernessaccounting.com" className="hover:text-[#C9A961] transition-colors">chris@wildernessaccounting.com</a>
              </p>
            </div>

            <div className="lg:text-right space-y-0.5 text-[#F8F6F3]/35">
              <p>© {new Date().getFullYear()} Doors (Pty) Ltd. All rights reserved.</p>
              <p>Where a price is shown, it is shown as a band. Homes shown by private introduction only.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
