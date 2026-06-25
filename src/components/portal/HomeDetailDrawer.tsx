import React, { useState } from 'react';
import { DoorsProperty } from '@/lib/doorsData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { X, Heart, MapPin, Check } from 'lucide-react';

interface Props {
  property: DoorsProperty;
  onClose: () => void;
  saved: boolean;
  onToggleSave: () => void;
}

const HomeDetailDrawer: React.FC<Props> = ({ property, onClose, saved, onToggleSave }) => {
  const { user } = useAuth();
  const p = property;
  const [active, setActive] = useState(0);
  const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];
  const [requestType, setRequestType] = useState<'viewing' | 'introduction'>('viewing');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submitRequest = async () => {
    if (!user) return;
    setSending(true);
    await supabase.from('doors_viewing_requests').insert({
      user_id: user.id,
      property_ref: p.ref,
      request_type: requestType,
      message: message || null,
    });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#2C2C2C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl h-full bg-[#F8F6F3] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-0 float-right m-5 z-10 w-10 h-10 flex items-center justify-center bg-[#2C2C2C] text-[#F8F6F3] rounded-full"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Gallery */}
        <div className="clear-both">
          <div className="relative aspect-[16/10] bg-[#2C2C2C]/5">
            <img src={gallery[active]} alt={p.title} className="w-full h-full object-cover" />
            {p.private && (
              <span className="absolute top-5 left-5 text-[10px] tracking-[0.25em] uppercase bg-[#2C2C2C] text-[#C9A961] px-3 py-1.5">
                Private — introduced to you
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 w-24 h-16 overflow-hidden ${i === active ? 'ring-2 ring-[#C9A961]' : 'opacity-60'}`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-7 sm:px-10 pb-16">
          <div className="flex items-start justify-between gap-4 pt-6">
            <div>
              <p className="text-[#C9A961] text-[10px] tracking-[0.25em] uppercase">{p.area} · {p.ref}</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light mt-2">{p.title}</h2>
            </div>
            <button
              onClick={onToggleSave}
              className={`flex-shrink-0 w-11 h-11 flex items-center justify-center border transition-colors ${saved ? 'bg-[#C9A961] border-[#C9A961] text-[#F8F6F3]' : 'border-[#2C2C2C]/25 text-[#2C2C2C] hover:border-[#C9A961]'}`}
              aria-label={saved ? 'Remove from saved' : 'Save home'}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {p.address && (
            <p className="flex items-center gap-2 text-[#2C2C2C]/60 text-sm mt-4">
              <MapPin size={14} className="text-[#C9A961]" /> {p.address}
            </p>
          )}

          {/* Unlocked figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2C2C2C]/10 mt-7 border border-[#2C2C2C]/10">
            <div className="bg-[#F8F6F3] p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/40">Guide</p>
              <p className="font-serif text-lg mt-1">{p.exactPrice || p.priceBand}</p>
            </div>
            <div className="bg-[#F8F6F3] p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/40">Bedrooms</p>
              <p className="font-serif text-lg mt-1">{p.bedrooms}</p>
            </div>
            <div className="bg-[#F8F6F3] p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/40">Bathrooms</p>
              <p className="font-serif text-lg mt-1">{p.bathrooms ?? '—'}</p>
            </div>
            <div className="bg-[#F8F6F3] p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/40">Under roof</p>
              <p className="font-serif text-lg mt-1">{p.sizeSqm} m²</p>
            </div>
          </div>

          <p className="text-[#2C2C2C]/70 font-light leading-relaxed mt-7">{p.summary}</p>

          {p.video && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-3">The full film</p>
              <video src={p.video} controls poster={p.image} className="w-full aspect-video bg-black" />
            </div>
          )}

          {p.specifics && p.specifics.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-4">The finer detail</p>
              <ul className="space-y-2.5">
                {p.specifics.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-[#2C2C2C]/70 text-sm font-light">
                    <Check size={15} className="text-[#C9A961] mt-0.5 flex-shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Request */}
          <div className="mt-10 border-t border-[#2C2C2C]/10 pt-8">
            {sent ? (
              <div className="text-center py-6">
                <p className="font-serif text-2xl font-light">Thank you.</p>
                <p className="text-[#2C2C2C]/55 text-sm mt-2 max-w-sm mx-auto">
                  Chris will be in touch personally to arrange this. Every viewing is handled discreetly.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-4">Express interest</p>
                <div className="flex gap-2 mb-4">
                  {(['viewing', 'introduction'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRequestType(t)}
                      className={`text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 border transition-colors ${requestType === t ? 'bg-[#2C2C2C] text-[#F8F6F3] border-[#2C2C2C]' : 'border-[#2C2C2C]/25 hover:border-[#2C2C2C]'}`}
                    >
                      {t === 'viewing' ? 'Request a private viewing' : 'Request an introduction'}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Anything you would like Chris to know (optional)"
                  rows={3}
                  className="w-full bg-transparent border border-[#2C2C2C]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A961] resize-none"
                />
                <button
                  onClick={submitRequest}
                  disabled={sending}
                  className="mt-4 w-full sm:w-auto text-[11px] tracking-[0.2em] uppercase bg-[#C9A961] text-[#2C2C2C] px-8 py-3.5 hover:bg-[#b8985280] transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending…' : 'Send to Chris'}
                </button>
                <p className="text-[#2C2C2C]/40 text-xs mt-3 italic">
                  Every viewing and introduction is arranged personally — never automated.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDetailDrawer;
