import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { engine, Overview } from '@/lib/engineApi';
import StudioAuth from '@/components/studio/StudioAuth';
import ListingsTab from '@/components/studio/ListingsTab';
import BuyersTab from '@/components/studio/BuyersTab';
import PipelineTab from '@/components/studio/PipelineTab';
import MarketingTab from '@/components/studio/MarketingTab';
import SettingsTab from '@/components/studio/SettingsTab';
import { LayoutGrid, Home, Users, GitBranch, Megaphone, Settings, Lock, Unlock, LogOut } from 'lucide-react';

type Tab = 'overview' | 'listings' | 'buyers' | 'pipeline' | 'marketing' | 'settings';

const Studio: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [ov, setOv] = useState<Overview | null>(null);
  const [notTeam, setNotTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');

  const load = useCallback(async () => {
    const { data, error } = await engine<Overview>('overview');
    if (error === 'not_team' || (data as any)?.error === 'not_team') { setNotTeam(true); setLoading(false); return; }
    if (error && !data) { setLoading(false); return; }
    setNotTeam(false);
    setOv(data!);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && user) load();
    if (!authLoading && !user) setLoading(false);
  }, [authLoading, user, load]);

  if (authLoading || (user && loading)) {
    return <div className="min-h-screen bg-[#1F1F1F] text-[#C9A961] flex items-center justify-center text-xs tracking-[0.3em] uppercase">Opening the engine…</div>;
  }
  if (!user) return <StudioAuth />;
  if (notTeam) return <StudioAuth notTeam />;
  if (!ov) return <StudioAuth notTeam />;

  const nav: { key: Tab; label: string; icon: React.ReactNode; admin?: boolean }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutGrid size={16} /> },
    { key: 'listings', label: 'Listings', icon: <Home size={16} /> },
    { key: 'buyers', label: 'Buyers', icon: <Users size={16} /> },
    { key: 'pipeline', label: 'Pipeline', icon: <GitBranch size={16} /> },
    { key: 'marketing', label: 'Marketing', icon: <Megaphone size={16} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={16} />, admin: true },
  ];
  const visibleNav = nav.filter((n) => !n.admin || ov.isAdmin);
  const gateOpen = ov.settings?.mandate_marketing_unlocked;

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-[#F8F6F3] flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[#F8F6F3]/10 hidden md:flex flex-col">
        <div className="px-6 py-6 border-b border-[#F8F6F3]/10">
          <Link to="/" className="font-serif tracking-[0.4em] text-lg">DOORS</Link>
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#C9A961] mt-1">Private Engine</p>
        </div>
        <nav className="flex-1 py-4">
          {visibleNav.map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm tracking-[0.08em] ${tab === n.key ? 'bg-[#C9A961]/10 text-[#C9A961] border-r-2 border-[#C9A961]' : 'text-[#F8F6F3]/55 hover:text-[#F8F6F3]'}`}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-[#F8F6F3]/10">
          <p className="text-xs text-[#F8F6F3]/55 truncate">{ov.me.full_name || ov.me.email}</p>
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#C9A961] mb-3">{ov.me.role}</p>
          <button onClick={() => signOut()} className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#F8F6F3]/45 hover:text-[#F8F6F3]"><LogOut size={13} /> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 overflow-x-auto border-b border-[#F8F6F3]/10 px-3 py-2">
          {visibleNav.map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)} className={`shrink-0 px-3 py-1.5 text-xs ${tab === n.key ? 'text-[#C9A961]' : 'text-[#F8F6F3]/50'}`}>{n.label}</button>
          ))}
        </div>

        {/* Gate banner */}
        <div className={`px-6 sm:px-10 py-2.5 flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase ${gateOpen ? 'bg-[#9DC183]/10 text-[#9DC183]' : 'bg-[#E07a5f]/10 text-[#E07a5f]'}`}>
          {gateOpen ? <Unlock size={13} /> : <Lock size={13} />}
          {gateOpen ? 'Launch gate open — live mandate marketing permitted' : 'Launch gate closed — building brand & database only, live mandate marketing locked'}
        </div>

        <div className="px-6 sm:px-10 py-8 max-w-[1200px]">
          {tab === 'overview' && <OverviewTab ov={ov} go={setTab} />}
          {tab === 'listings' && <ListingsTab properties={ov.properties} reload={load} />}
          {tab === 'buyers' && <BuyersTab buyers={ov.buyers} properties={ov.properties} introductions={ov.introductions} reload={load} />}
          {tab === 'pipeline' && <PipelineTab properties={ov.properties} requests={ov.requests} buyers={ov.buyers} reload={load} />}
          {tab === 'marketing' && <MarketingTab outreach={ov.outreach} properties={ov.properties} settings={ov.settings} reload={load} />}
          {tab === 'settings' && ov.isAdmin && <SettingsTab settings={ov.settings} team={ov.team} meId={ov.me.id} reload={load} />}
        </div>
      </main>
    </div>
  );
};

const OverviewTab: React.FC<{ ov: Overview; go: (t: Tab) => void }> = ({ ov, go }) => {
  const openReqs = ov.requests.filter((r) => r.status !== 'closed').length;
  const demoCount = ov.properties.filter((p) => p.is_demo).length;
  const cards = [
    { label: 'Homes in the collection', value: ov.properties.length, tab: 'listings' as Tab },
    { label: 'Qualified buyers', value: ov.buyers.length, tab: 'buyers' as Tab },
    { label: 'Open viewing requests', value: openReqs, tab: 'pipeline' as Tab },
    { label: 'Outreach campaigns', value: ov.outreach.length, tab: 'marketing' as Tab },
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl font-light mb-1">Good day, {(ov.me.full_name || ov.me.email || '').split(' ')[0]}</h1>
      <p className="text-[#F8F6F3]/45 text-sm mb-8">The whole of DOORS, behind the curtain.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <button key={c.label} onClick={() => go(c.tab)} className="bg-[#262626] border border-[#F8F6F3]/8 p-5 text-left hover:border-[#C9A961]/40 transition-colors">
            <p className="font-serif text-4xl text-[#C9A961]">{c.value}</p>
            <p className="text-xs text-[#F8F6F3]/50 mt-2 leading-snug">{c.label}</p>
          </button>
        ))}
      </div>
      {demoCount > 0 && (
        <div className="mt-6 bg-[#E07a5f]/10 border border-[#E07a5f]/30 p-4 text-sm text-[#F8F6F3]/70">
          {demoCount} demonstration {demoCount === 1 ? 'home is' : 'homes are'} loaded. Remove them from Settings before launch.
        </div>
      )}
    </div>
  );
};

export default Studio;
