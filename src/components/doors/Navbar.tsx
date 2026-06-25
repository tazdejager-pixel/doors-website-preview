import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wordmark } from './Wordmark';


interface Props {
  onEnquire: () => void;
}

const Navbar: React.FC<Props> = ({ onEnquire }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const links = [
    { label: 'How It Works', action: () => scrollTo('philosophy') },
    { label: 'Collection', action: () => scrollTo('collection') },
    { label: 'For Sellers', action: () => scrollTo('sellers') },
    { label: 'Register', action: () => navigate('/register') },
    { label: 'Sign In', action: () => navigate('/signin') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-ivory/95 backdrop-blur-md py-4 shadow-[0_1px_0_rgba(10,9,8,0.06)]' : 'py-6 sm:py-8'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        <Link to="/">
          <Wordmark tone={scrolled ? 'onyx' : 'ivory'} size="md" />
        </Link>


        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.action}
              className={`text-[11px] tracking-[0.22em] uppercase transition-colors ${
                scrolled ? 'text-[#2C2C2C]/70 hover:text-[#2C2C2C]' : 'text-[#F8F6F3]/80 hover:text-[#F8F6F3]'
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={onEnquire}
            className={`text-[11px] tracking-[0.22em] uppercase px-5 py-2.5 border transition-colors ${
              scrolled
                ? 'border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#F8F6F3]'
                : 'border-[#F8F6F3]/60 text-[#F8F6F3] hover:bg-[#F8F6F3] hover:text-[#2C2C2C]'
            }`}
          >
            Enquire
          </button>
        </nav>

        <button
          className={`md:hidden ${scrolled ? 'text-[#2C2C2C]' : 'text-[#F8F6F3]'}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#F8F6F3] mt-4 px-6 pb-8 pt-4 border-t border-[#2C2C2C]/10">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.action}
              className="block w-full text-left py-3 text-sm tracking-[0.18em] uppercase text-[#2C2C2C]/80"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onEnquire(); }}
            className="mt-3 w-full text-center py-3.5 text-xs tracking-[0.2em] uppercase bg-[#2C2C2C] text-[#F8F6F3]"
          >
            Enquire
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
