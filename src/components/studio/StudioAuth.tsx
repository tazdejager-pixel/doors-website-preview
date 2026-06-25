import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StudioAuth: React.FC<{ notTeam?: boolean }> = ({ notTeam }) => {
  const { signIn, signOut, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setErr(error);
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#F8F6F3] flex flex-col">
      <header className="border-b border-[#F8F6F3]/10">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
          <Link to="/" className="font-serif tracking-[0.45em] text-xl">DOORS</Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961]">Private Engine</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-4 text-center">For the DOORS Team</p>

          {notTeam ? (
            <div className="text-center">
              <h1 className="font-serif text-3xl font-light mb-4">Not on the team</h1>
              <p className="text-[#F8F6F3]/55 text-sm leading-relaxed mb-8">
                This account ({user?.email}) is not part of the DOORS private engine. Team access is
                arranged internally by the founder.
              </p>
              <button
                onClick={() => signOut()}
                className="text-xs tracking-[0.18em] uppercase text-[#C9A961] hover:text-[#F8F6F3]"
              >
                Sign out
              </button>
              <div className="mt-4">
                <Link to="/" className="text-xs tracking-[0.18em] uppercase text-[#F8F6F3]/40 hover:text-[#F8F6F3]">
                  Return home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl font-light mb-8 text-center">Sign in</h1>
              <form onSubmit={submit} className="space-y-4">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent border border-[#F8F6F3]/20 px-4 py-3 text-sm focus:border-[#C9A961] outline-none"
                />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border border-[#F8F6F3]/20 px-4 py-3 text-sm focus:border-[#C9A961] outline-none"
                />
                {err && <p className="text-[#E07a5f] text-xs">{err}</p>}
                <button
                  disabled={busy}
                  className="w-full bg-[#C9A961] text-[#1F1F1F] py-3 text-xs tracking-[0.22em] uppercase font-medium hover:bg-[#d8b977] disabled:opacity-50"
                >
                  {busy ? 'Signing in…' : 'Enter the engine'}
                </button>
              </form>
              <p className="text-[#F8F6F3]/40 text-[11px] leading-relaxed mt-6 text-center">
                Team accounts are created internally. There is no public sign-up to the engine.
              </p>
              <div className="mt-6 text-center">
                <Link to="/" className="text-xs tracking-[0.18em] uppercase text-[#F8F6F3]/40 hover:text-[#F8F6F3]">
                  Return home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioAuth;
