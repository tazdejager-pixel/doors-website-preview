import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { budgetBands, areas } from '@/lib/doorsData';

interface Props {
  open: boolean;
  onClose: () => void;
  kind: 'buyer' | 'seller';
  propertyRef?: string;
  propertyTitle?: string;
}

const inputClass =
  'w-full bg-transparent border-b border-[#2C2C2C]/20 py-3 text-[#2C2C2C] placeholder-[#2C2C2C]/40 focus:border-[#C9A961] focus:outline-none transition-colors text-sm';

const EnquiryModal: React.FC<Props> = ({ open, onClose, kind, propertyRef, propertyTitle }) => {
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

  useEffect(() => {
    if (open) {
      setDone(false);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
        budget_band: budget || null,
        area_interest: area || null,
        property_ref: propertyRef || null,
      });

      await fetch('https://famous.ai/api/crm/6a2dcec9cd468ee0fa9c747f/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          phone: phone || undefined,
          sms_opt_in: smsOptIn === true,
          source: kind === 'buyer' ? 'buyer-register' : 'seller-register',
          tags: ['doors', kind === 'buyer' ? 'buyer' : 'seller'],
        }),
      });
      setDone(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#2C2C2C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#F8F6F3] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors"
          aria-label="Close"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="px-8 py-12 sm:px-12">
          {done ? (
            <div className="text-center py-10">
              <p className="text-[#C9A961] text-xs tracking-[0.25em] uppercase mb-5">Received</p>
              <h3 className="font-serif text-3xl text-[#2C2C2C] mb-4">Thank you.</h3>
              <p className="text-[#2C2C2C]/60 text-sm leading-relaxed max-w-sm mx-auto">
                Your enquiry has reached us privately. Chris, or a member of the DOORS circle, will be in
                touch personally - discreetly, and in your own time.
              </p>
              <button
                onClick={onClose}
                className="mt-8 text-xs tracking-[0.2em] uppercase text-[#2C2C2C] border-b border-[#C9A961] pb-1 hover:text-[#C9A961] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#C9A961] text-xs tracking-[0.25em] uppercase mb-3">
                {kind === 'buyer' ? 'Register as a buyer' : 'Speak about selling'}
              </p>
              <h3 className="font-serif text-3xl text-[#2C2C2C] mb-2 leading-tight">
                {propertyTitle ? 'Request an introduction' : kind === 'buyer' ? 'A private enquiry' : 'A confidential conversation'}
              </h3>
              <p className="text-[#2C2C2C]/55 text-sm leading-relaxed mb-8">
                {propertyTitle
                  ? `Regarding ${propertyTitle}. Nothing is shared without your consent.`
                  : kind === 'buyer'
                  ? 'Tell us a little. We hold every detail in confidence and reply personally.'
                  : 'Selling an exceptional home asks for judgement, not advertising. Let us talk quietly first.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className={inputClass} type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />

                {kind === 'buyer' && (
                  <>
                    <select className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
                      <option value="">Budget band (optional)</option>
                      {budgetBands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <select className={inputClass} value={area} onChange={(e) => setArea(e.target.value)}>
                      <option value="">Area of interest (optional)</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
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
                  <input
                    type="checkbox"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-0.5 accent-[#C9A961]"
                  />
                  <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
                </label>

                {error && <p className="text-red-700/80 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2C2C2C] text-[#F8F6F3] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#C9A961] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send privately'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
