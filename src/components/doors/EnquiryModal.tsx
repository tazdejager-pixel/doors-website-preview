import React, { useState, useEffect } from 'react';
import { captureLead } from '@/lib/leads';
import { budgetBands, areas } from '@/lib/doorsData';
import { Wordmark, BrandName } from './Wordmark';

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
  // POPIA: consent is explicit and always starts unticked. Never pre-consent someone.
  const [consent, setConsent] = useState(false);
  const [viewingRequested, setViewingRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDone(false);
      setError('');
      setConsent(false);
      setViewingRequested(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please share your name and email.');
      return;
    }
    if (!consent) {
      setError('Please confirm we may contact you about this enquiry.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: leadError } = await captureLead({
      kind,
      name,
      email,
      phone,
      message,
      budget_band: budget,
      area_interest: area,
      property_ref: propertyRef,
      source: propertyRef ? `${kind}-property-enquiry` : `${kind}-enquiry`,
      contact_consent: consent,
      viewing_requested: viewingRequested,
    });
    setSubmitting(false);
    if (leadError) {
      setError('Something went wrong sending your enquiry. Please try again in a moment.');
      return;
    }
    setDone(true);
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

        <div className="px-8 pt-10 pb-12 sm:px-12">
          <div className="mb-8">
            <Wordmark tone="onyx" size="md" />
          </div>

          {done ? (
            <div className="text-center py-10">
              <p className="text-[#C9A961] text-xs tracking-[0.25em] uppercase mb-5">Received</p>
              <h3 className="font-serif text-3xl text-[#2C2C2C] mb-4">Thank you.</h3>
              <p className="text-[#2C2C2C]/60 text-sm leading-relaxed max-w-sm mx-auto">
                Your enquiry has reached us privately. Chris, or a member of the <BrandName /> circle, will
                be in touch personally - discreetly, and in your own time.
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

                {kind === 'seller' && (
                  <label className="flex items-start gap-3 text-xs text-[#2C2C2C]/70 leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewingRequested}
                      onChange={(e) => setViewingRequested(e.target.checked)}
                      className="mt-0.5 accent-[#C9A961]"
                    />
                    <span>Request an introductory viewing.</span>
                  </label>
                )}

                <label className="flex items-start gap-3 text-xs text-[#2C2C2C]/55 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 accent-[#C9A961]"
                  />
                  <span>
                    I consent to <BrandName /> contacting me about this enquiry and holding my details for
                    that purpose, in line with POPIA and the{' '}
                    <a href={`${import.meta.env.BASE_URL}legal`} target="_blank" rel="noopener" className="border-b border-[#C9A961] text-[#2C2C2C]">
                      privacy notice
                    </a>
                    . You may ask us to remove your details at any time.
                  </span>
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
