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
            <div className="mb-5"><Wordmark tone="ivory" size="md" /></div>
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


        <div className="border-t border-[#F8F6F3]/10 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-[#F8F6F3]/40 text-xs font-light">
          <p>© {new Date().getFullYear()} Doors Properties (Pty) Ltd. All rights reserved.</p>
          <p>Prices shown as bands. Homes shown by private introduction only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
