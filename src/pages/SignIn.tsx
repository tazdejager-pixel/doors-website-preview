import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { engine } from '@/lib/engineApi';
import { Wordmark, DoorwayMark } from '@/components/doors/Wordmark';

const inputClass =
  'w-full bg-transparent border-b border-ivory/20 py-3 text-ivory placeholder-ivory/35 focus:border-gold focus:outline-none transition-colors text-sm tracking-wide';

/**
 * The single clean DOORS sign-in. After authenticating, the system asks the
 * engine whether this person is a team member and takes them to the right
 * place — the private engine for the team, the buyer portal for everyone else.
 */
const SignIn: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const route = async () => {
    const { data } = await engine<{ is_team: boolean }>('whoami');
    if (data?.is_team) navigate('/studio');
    else navigate('/portal');
  };

  // If already signed in, route immediately.
  useEffect(() => {
    if (user) route();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('Please choose a password of at least six characters.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) { setError(error); return; }
        await route();
      } else {
        const { error } = await signUp(email, password, { full_name: name, phone });
        if (error) { setError(error); return; }
        fetch('https://famous.ai/api/crm/6a2dcec9cd468ee0fa9c747f/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: name || undefined,
            phone: phone || undefined,
            sms_opt_in: smsOptIn === true,
            source: 'signin-register',
            tags: ['doors', 'buyer', 'portal'],
          }),
        }).catch(() => {});
        navigate('/portal');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none flex items-center justify-center">
        <DoorwayMark className="h-[90vh] w-auto" tone="gold" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-12">
          <Link to="/"><Wordmark tone="ivory" size="lg" /></Link>
        </div>

        <div className="text-center mb-10">
          <p className="doors-label text-gold text-[10px] mb-5">By Introduction</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-ivory font-normal mb-4">
            {mode === 'signin' ? 'Welcome back.' : 'Join the circle.'}
          </h1>
          <p className="text-stone text-sm leading-relaxed font-light">
            {mode === 'signin'
              ? 'Sign in and we will take you to the right door.'
              : 'Register as a buyer to unlock the full detail of the collection.'}
          </p>
        </div>

        <div className="flex border border-ivory/15 mb-9">
          {(['signin', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-3 doors-label text-[10px] transition-colors ${
                mode === m ? 'bg-gold text-onyx' : 'text-ivory/55 hover:text-ivory'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-6">
          {mode === 'register' && (
            <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {mode === 'register' && (
            <input className={inputClass} type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          )}
          <input className={inputClass} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {mode === 'register' && (
            <label className="flex items-start gap-3 text-xs text-stone leading-relaxed cursor-pointer">
              <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 accent-gold" />
              <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
            </label>
          )}

          {error && <p className="text-red-400/80 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ivory text-onyx py-4 doors-label text-[10px] hover:bg-gold transition-colors disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-stone mt-9 leading-relaxed">
          {mode === 'register' ? (
            <>Prefer to share your full brief?{' '}
              <Link to="/register" className="text-ivory border-b border-gold pb-0.5">Register in full</Link>
            </>
          ) : (
            <Link to="/" className="text-ivory border-b border-gold pb-0.5">Return home</Link>
          )}
        </p>
        <p className="text-center text-[10px] text-stone/60 mt-6 tracking-wide">
          Team accounts are arranged privately by DOORS.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
