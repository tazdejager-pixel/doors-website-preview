import React, { useState } from 'react';
import { EngineSettings, EngineTeam, engine } from '@/lib/engineApi';
import { Lock, Unlock, ShieldCheck, UserPlus, Trash2, FlaskConical } from 'lucide-react';

const SettingsTab: React.FC<{
  settings: EngineSettings;
  team: EngineTeam[];
  meId: string;
  reload: () => void;
}> = ({ settings, team, meId, reload }) => {
  const [ffc, setFfc] = useState(settings?.ffc_reference || '');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'agent'>('agent');
  const [teamErr, setTeamErr] = useState('');
  const [msg, setMsg] = useState('');

  const unlocked = settings?.mandate_marketing_unlocked;

  const toggleGate = async () => {
    setBusy(true);
    await engine('toggle_marketing', { unlocked: !unlocked, ffc_reference: ffc || null });
    setBusy(false); reload();
  };

  const addTeam = async () => {
    setTeamErr('');
    const { error } = await engine('add_team', { email, full_name: name, role });
    if (error) { setTeamErr(error); return; }
    setEmail(''); setName(''); reload();
  };
  const removeTeam = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await engine('remove_team', { id }); reload();
  };

  const seedDemo = async () => { setMsg(''); await engine('seed_demo', {}); setMsg('Demo homes added.'); reload(); };
  const removeDemo = async () => { setMsg(''); await engine('remove_demo', {}); setMsg('Demo homes removed.'); reload(); };

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="font-serif text-2xl mb-1">Brokerage Settings</h2>
        <p className="text-[#F8F6F3]/45 text-sm">Controlled by the founder.</p>
      </div>

      {/* Launch gate */}
      <div className={`border p-6 ${unlocked ? 'border-[#9DC183]/40 bg-[#9DC183]/5' : 'border-[#E07a5f]/40 bg-[#E07a5f]/5'}`}>
        <div className="flex items-center gap-3 mb-3">
          {unlocked ? <Unlock size={18} className="text-[#9DC183]" /> : <Lock size={18} className="text-[#E07a5f]" />}
          <h3 className="font-serif text-xl">The Launch Gate</h3>
        </div>
        <p className="text-sm text-[#F8F6F3]/65 leading-relaxed mb-4">
          DOORS distinguishes building the brand and buyer database (always allowed) from actively marketing live
          mandates and transacting (locked until the Fidelity Fund Certificate is held). The gate defaults to closed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#F8F6F3]/45 mb-1.5">FFC reference (optional)</label>
            <input value={ffc} onChange={(e) => setFfc(e.target.value)} className="w-full bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]" placeholder="e.g. FFC 2026/…" />
          </div>
          <button onClick={toggleGate} disabled={busy} className={`px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium disabled:opacity-50 ${unlocked ? 'bg-[#E07a5f] text-white' : 'bg-[#9DC183] text-[#1F1F1F]'}`}>
            {unlocked ? 'Close the gate' : 'Open - certificate held'}
          </button>
        </div>
        <p className={`text-xs mt-3 tracking-[0.1em] uppercase ${unlocked ? 'text-[#9DC183]' : 'text-[#E07a5f]'}`}>
          Status: {unlocked ? 'Open · live mandate marketing permitted' : 'Closed · live mandate marketing locked'}
        </p>
      </div>

      {/* Team */}
      <div className="border border-[#F8F6F3]/10 p-6">
        <div className="flex items-center gap-3 mb-4"><ShieldCheck size={18} className="text-[#C9A961]" /><h3 className="font-serif text-xl">Team</h3></div>
        <div className="space-y-2 mb-5">
          {team.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 border-b border-[#F8F6F3]/8 pb-2 last:border-0">
              <div>
                <p className="text-sm">{t.full_name || t.email} {t.id === meId && <span className="text-[#F8F6F3]/35">(you)</span>}</p>
                <p className="text-xs text-[#F8F6F3]/40">{t.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 ${t.role === 'admin' ? 'bg-[#C9A961]/20 text-[#C9A961]' : 'bg-[#F8F6F3]/10 text-[#F8F6F3]/50'}`}>{t.role}</span>
                {t.id !== meId && <button onClick={() => removeTeam(t.id)} className="text-[#E07a5f]/70 hover:text-[#E07a5f]"><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-4 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (registered)" className="bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]" />
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="bg-[#1F1F1F] border border-[#F8F6F3]/15 px-3 py-2 text-sm text-[#F8F6F3]">
            <option value="agent">Agent / advisor</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={addTeam} className="flex items-center justify-center gap-2 bg-[#C9A961] text-[#1F1F1F] px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#d8b977]"><UserPlus size={14} /> Add</button>
        </div>
        {teamErr && <p className="text-[#E07a5f] text-xs mt-2">{teamErr}</p>}
        <p className="text-[10px] text-[#F8F6F3]/40 mt-2">The person must have registered an account first; there is no public sign-up to the engine.</p>
      </div>

      {/* Demo data */}
      <div className="border border-[#F8F6F3]/10 p-6">
        <div className="flex items-center gap-3 mb-3"><FlaskConical size={18} className="text-[#C9A961]" /><h3 className="font-serif text-xl">Demonstration data</h3></div>
        <p className="text-sm text-[#F8F6F3]/65 leading-relaxed mb-4">
          Clearly-flagged DEMO homes for the first walkthrough. They are placeholders - never real homes sold - and
          should be removed before launch.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={seedDemo} className="bg-[#C9A961] text-[#1F1F1F] px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#d8b977]">Add demo homes</button>
          <button onClick={removeDemo} className="px-5 py-2.5 text-xs tracking-[0.18em] uppercase text-[#E07a5f] border border-[#E07a5f]/40 hover:bg-[#E07a5f]/10">Remove all demo data</button>
        </div>
        {msg && <p className="text-[#9DC183] text-xs mt-3">{msg}</p>}
      </div>
    </div>
  );
};

export default SettingsTab;
