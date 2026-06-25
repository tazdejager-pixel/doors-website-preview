import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { budgetBands, areas, timelines, priorityOptions } from '@/lib/doorsData';
import { Check } from 'lucide-react';

const fieldCls =
  'w-full bg-transparent border border-[#2C2C2C]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A961]';
const labelCls = 'block text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/45 mb-2';

const ProfileTab: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [budget, setBudget] = useState(profile?.budget_band || '');
  const [area, setArea] = useState(profile?.area_interest || '');
  const [timeline, setTimeline] = useState(profile?.timeline || '');
  const [bedrooms, setBedrooms] = useState<string>(profile?.bedrooms_min ? String(profile.bedrooms_min) : '');
  const [priorities, setPriorities] = useState<string[]>(profile?.priorities || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePriority = (p: string) =>
    setPriorities((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await updateProfile({
      full_name: fullName || null,
      phone: phone || null,
      budget_band: budget || null,
      area_interest: area || null,
      timeline: timeline || null,
      bedrooms_min: bedrooms ? parseInt(bedrooms, 10) : null,
      priorities: priorities.length ? priorities : null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-12">
        <h2 className="font-serif text-3xl font-light">Your profile</h2>
        <p className="text-[#2C2C2C]/55 text-sm mt-2 max-w-xl leading-relaxed">
          How we reach you privately, and the brief we hold for you. The more you tell us, the better we can
          match you to homes — including those that never reach the collection.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input value={user?.email || ''} disabled className={`${fieldCls} opacity-60`} />
        </div>
        <div>
          <label className={labelCls}>Phone (private)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className={fieldCls} />
        </div>
        <div>
          <label className={labelCls}>Timeline</label>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={fieldCls}>
            <option value="">Select…</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-2xl font-light mb-1">What you are looking for</h3>
        <p className="text-[#2C2C2C]/45 text-xs mb-7">Your private brief — only ever seen by you and DOORS.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Price band</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className={fieldCls}>
              <option value="">Open</option>
              {budgetBands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Preferred area</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={fieldCls}>
              <option value="">Across the corridor</option>
              {areas.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Min. bedrooms</label>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={fieldCls}>
              <option value="">Any</option>
              {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <label className={labelCls}>What matters most</label>
          <div className="flex flex-wrap gap-2.5">
            {priorityOptions.map((p) => {
              const on = priorities.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`flex items-center gap-1.5 text-xs tracking-[0.05em] px-3.5 py-2 border transition-colors ${on ? 'bg-[#2C2C2C] text-[#F8F6F3] border-[#2C2C2C]' : 'border-[#2C2C2C]/20 text-[#2C2C2C]/70 hover:border-[#2C2C2C]'}`}
                >
                  {on && <Check size={13} className="text-[#C9A961]" />}
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-5">
        <button
          onClick={save}
          disabled={saving}
          className="text-[11px] tracking-[0.2em] uppercase bg-[#C9A961] text-[#2C2C2C] px-9 py-3.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save my brief'}
        </button>
        {saved && <span className="text-[#C9A961] text-xs tracking-[0.15em] uppercase">Saved</span>}
      </div>
    </div>
  );
};

export default ProfileTab;
