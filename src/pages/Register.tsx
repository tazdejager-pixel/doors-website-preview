import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { budgetBands, areas, HERO_IMG } from '@/lib/doorsData';

const inputClass =
  'w-full bg-transparent border-b border-[#2C2C2C]/20 py-3 text-[#2C2C2C] placeholder-[#2C2C2C]/40 focus:border-[#C9A961] focus:outline-none transition-colors text-sm';

const Register: React.FC = () => {
  const [kind, setKind] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [area, setArea] = useState('');
  const [message, setMessage] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please share your name and email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await supabase.from('doors_enquiries').insert({
        kind,
        name,
        email,
        phone: phone || null,
        message: message || null,
        budget_band: kind === 'buyer' ? budget || null : null,
        area_interest: kind === 'buyer' ? area || null : null,
      });
      await fetch('https://famous.ai/api/crm/6a2dcec9cd468ee0fa9c747f/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          phone: phone || undefined,
          sms_opt_in: smsOptIn === true,
          source: kind === 'buyer' ? 'buyer-register-page' : 'seller-register-page',
          tags: ['doors', kind],
        }),
      });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F6F3]">
      <div className="relative hidden lg:block">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#2C2C2C]/55" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="font-serif tracking-[0.45em] text-2xl text-[#F8F6F3]">DOORS</Link>
          <div>
            <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-5">By Private Introduction</p>
            <h2 className="font-serif text-5xl text-[#F8F6F3] font-light leading-tight">
              You are introduced,<br />not advertised to.
            </h2>
            <p className="text-[#F8F6F3]/70 text-sm font-light leading-relaxed mt-6 max-w-md">
              Every detail you share is held in confidence. We reply personally — never with automated noise.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="lg:hidden p-6">
          <Link to="/" className="font-serif tracking-[0.45em] text-xl text-[#2C2C2C]">DOORS</Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-md">
            {done ? (
              <div className="text-center">
                <p className="text-[#C9A961] text-xs tracking-[0.25em] uppercase mb-5">Received</p>
                <h1 className="font-serif text-4xl text-[#2C2C2C] mb-4">Thank you.</h1>
                <p className="text-[#2C2C2C]/60 text-sm leading-relaxed mb-8">
                  Your registration has reached us privately. A member of the DOORS circle will be in touch
                  personally and in confidence.
                </p>
                <Link to="/" className="text-xs tracking-[0.2em] uppercase text-[#2C2C2C] border-b border-[#C9A961] pb-1 hover:text-[#C9A961]">
                  Return home
                </Link>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-4xl text-[#2C2C2C] mb-3">Register with DOORS</h1>
                <p className="text-[#2C2C2C]/55 text-sm leading-relaxed mb-8">
                  Tell us whether you are looking, or considering a sale. We do the rest, quietly.
                </p>

                <div className="flex border border-[#2C2C2C]/15 mb-8">
                  {(['buyer', 'seller'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setKind(k)}
                      className={`flex-1 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                        kind === k ? 'bg-[#2C2C2C] text-[#F8F6F3]' : 'text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
                      }`}
                    >
                      {k === 'buyer' ? 'For Buyers' : 'For Sellers'}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="space-y-6">
                  <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input className={inputClass} type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />

                  {kind === 'buyer' && (
                    <>
                      <select className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
                        <option value="">Budget band (optional)</option>
                        {budgetBands.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <select className={inputClass} value={area} onChange={(e) => setArea(e.target.value)}>
                        <option value="">Area of interest (optional)</option>
                        {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </>
                  )}

                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder={kind === 'buyer' ? 'What are you looking for? (optional)' : 'A few words about your home (optional)'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <label className="flex items-start gap-3 text-xs text-[#2C2C2C]/55 leading-relaxed cursor-pointer">
                    <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-0.5 accent-[#C9A961]" />
                    <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
                  </label>

                  {error && <p className="text-red-700/80 text-xs">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#2C2C2C] text-[#F8F6F3] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C9A961] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Register privately'}
                  </button>
                </form>

                <p className="text-center text-xs text-[#2C2C2C]/40 mt-8">
                  Already registered? <Link to="/portal" className="text-[#2C2C2C] border-b border-[#C9A961]">Enter the buyer portal</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
