import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { budgetBands, areas, HERO_IMG } from '@/lib/doorsData';
import { Wordmark } from './Wordmark';


const inputClass =
  'w-full bg-transparent border-b border-[#2C2C2C]/20 py-3 text-[#2C2C2C] placeholder-[#2C2C2C]/40 focus:border-[#C9A961] focus:outline-none transition-colors text-sm';

const PortalAuth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState('');
  const [area, setArea] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Please choose a password of at least six characters.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        const { error } = await signUp(email, password, {
          full_name: name,
          phone,
          budget_band: budget,
          area_interest: area,
        });
        if (error) {
          setError(error);
        } else {
          fetch('https://famous.ai/api/crm/6a2dcec9cd468ee0fa9c747f/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name: name || undefined,
              phone: phone || undefined,
              sms_opt_in: smsOptIn === true,
              source: 'portal-signup',
              tags: ['doors', 'buyer', 'portal'],
            }),
          }).catch(() => {});
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F6F3]">
      <div className="relative hidden lg:block">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#2C2C2C]/55" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/"><Wordmark tone="ivory" size="md" /></Link>

          <div>
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-5">The Buyer Portal</p>
            <h2 className="font-serif text-5xl text-[#F8F6F3] font-light leading-tight">
              A private door,<br />for our circle alone.
            </h2>
            <p className="text-[#F8F6F3]/70 text-sm font-light leading-relaxed mt-6 max-w-md">
              Sign in to view the full, unadvertised collection and arrange introductions. Your account is
              secure and held in confidence.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="lg:hidden p-6">
          <Link to="/"><Wordmark tone="onyx" size="sm" /></Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-md">
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-4">Buyer Portal</p>
            <h1 className="font-serif text-4xl text-[#2C2C2C] mb-3">
              {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
            </h1>
            <p className="text-[#2C2C2C]/55 text-sm leading-relaxed mb-8">
              {mode === 'signin'
                ? 'Sign in to enter the private collection.'
                : 'A secure account for registered buyers. Already introduced to DOORS? Begin here.'}
            </p>

            <div className="flex border border-[#2C2C2C]/15 mb-8">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                    mode === m ? 'bg-[#2C2C2C] text-[#F8F6F3]' : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-6">
              {mode === 'signup' && (
                <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              )}
              <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {mode === 'signup' && (
                <input className={inputClass} type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              )}
              <input className={inputClass} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              {mode === 'signup' && (
                <>
                  <select className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="">Budget band (optional)</option>
                    {budgetBands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select className={inputClass} value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="">Area of interest (optional)</option>
                    {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <label className="flex items-start gap-3 text-xs text-[#2C2C2C]/55 leading-relaxed cursor-pointer">
                    <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 accent-[#C9A961]" />
                    <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
                  </label>
                </>
              )}

              {error && <p className="text-red-700/80 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#2C2C2C] text-[#F8F6F3] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C9A961] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
              >
                {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-[#2C2C2C]/40 mt-8">
              <Link to="/" className="text-[#2C2C2C] border-b border-[#C9A961]">Return home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalAuth;
