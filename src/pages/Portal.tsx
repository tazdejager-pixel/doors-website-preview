import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PortalAuth from '@/components/doors/PortalAuth';
import PortalCard from '@/components/portal/PortalCard';
import ProfileTab from '@/components/portal/ProfileTab';
import HomeDetailDrawer from '@/components/portal/HomeDetailDrawer';
import { Wordmark } from '@/components/doors/Wordmark';
import { collection, publicCollection, DoorsProperty } from '@/lib/doorsData';


type Tab = 'collection' | 'saved' | 'profile';

const PortalDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const greeting = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Welcome';

  const [tab, setTab] = useState<Tab>('collection');
  const [saved, setSaved] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [intros, setIntros] = useState<string[]>([]);
  const [open, setOpen] = useState<DoorsProperty | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [s, v, i] = await Promise.all([
      supabase.from('doors_saved_homes').select('property_ref').eq('user_id', user.id),
      supabase.from('doors_viewed_homes').select('property_ref').eq('user_id', user.id).order('viewed_at', { ascending: false }),
      supabase.from('doors_private_introductions').select('property_ref').eq('user_id', user.id),
    ]);
    setSaved((s.data || []).map((r) => r.property_ref));
    setViewed(Array.from(new Set((v.data || []).map((r) => r.property_ref))));
    setIntros((i.data || []).map((r) => r.property_ref));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Homes this buyer may see: all public + any private homes introduced to them.
  const visible = collection.filter((p) => !p.private || intros.includes(p.ref));

  const toggleSave = async (ref: string) => {
    if (!user) return;
    if (saved.includes(ref)) {
      setSaved((cur) => cur.filter((r) => r !== ref));
      await supabase.from('doors_saved_homes').delete().eq('user_id', user.id).eq('property_ref', ref);
    } else {
      setSaved((cur) => [...cur, ref]);
      await supabase.from('doors_saved_homes').insert({ user_id: user.id, property_ref: ref });
    }
  };

  const openHome = async (p: DoorsProperty) => {
    setOpen(p);
    if (!user) return;
    setViewed((cur) => (cur.includes(p.ref) ? cur : [p.ref, ...cur]));
    await supabase.from('doors_viewed_homes').insert({ user_id: user.id, property_ref: p.ref });
  };

  const savedHomes = visible.filter((p) => saved.includes(p.ref));
  const viewedHomes = viewed.map((ref) => visible.find((p) => p.ref === ref)).filter(Boolean) as DoorsProperty[];
  const introHomes = visible.filter((p) => p.private);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'collection', label: 'The Collection' },
    { key: 'saved', label: 'Saved & Viewed' },
    { key: 'profile', label: 'My Brief' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#2C2C2C]">
      <header className="border-b border-[#2C2C2C]/10 sticky top-0 bg-[#F8F6F3]/95 backdrop-blur-md z-30">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link to="/"><Wordmark tone="onyx" size="sm" /></Link>

          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-[#C9A961]">Buyer Portal</span>
            <button
              onClick={signOut}
              className="text-[11px] tracking-[0.2em] uppercase border border-[#2C2C2C]/25 px-5 py-2.5 hover:bg-[#2C2C2C] hover:text-[#F8F6F3] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-[1300px] mx-auto px-6 sm:px-10 pt-14 pb-8">
        <p className="text-[#C9A961] text-[11px] tracking-[0.3em] uppercase mb-4">The Private Collection</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-light mb-4">Good day, {greeting}.</h1>
        <p className="text-[#2C2C2C]/55 text-sm leading-relaxed max-w-xl">
          You are inside the circle. Every home below reveals its full detail to you. To see one in person,
          request a private viewing and Chris will arrange it personally.
        </p>
      </section>

      <nav className="max-w-[1300px] mx-auto px-6 sm:px-10 border-b border-[#2C2C2C]/10">
        <div className="flex gap-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative pb-4 text-[11px] tracking-[0.2em] uppercase transition-colors ${tab === t.key ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70'}`}
            >
              {t.label}
              {tab === t.key && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-[#C9A961]" />}
            </button>
          ))}
        </div>
      </nav>

      <section className="max-w-[1300px] mx-auto px-6 sm:px-10 py-14 pb-28">
        {tab === 'collection' && (
          <>
            {introHomes.length > 0 && (
              <div className="mb-16">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-6">Introduced privately to you</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {introHomes.map((p) => (
                    <PortalCard key={p.ref} property={p} saved={saved.includes(p.ref)} onToggleSave={() => toggleSave(p.ref)} onOpen={() => openHome(p)} />
                  ))}
                </div>
                <div className="h-px bg-[#2C2C2C]/10 mt-16" />
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {publicCollection.map((p) => (
                <PortalCard key={p.ref} property={p} saved={saved.includes(p.ref)} onToggleSave={() => toggleSave(p.ref)} onOpen={() => openHome(p)} />
              ))}
            </div>
          </>
        )}

        {tab === 'saved' && (
          <div className="space-y-20">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-6">Homes you have saved</p>
              {savedHomes.length === 0 ? (
                <p className="text-[#2C2C2C]/45 text-sm italic">
                  Nothing saved yet. Tap the heart on any home to keep it here.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {savedHomes.map((p) => (
                    <PortalCard key={p.ref} property={p} saved onToggleSave={() => toggleSave(p.ref)} onOpen={() => openHome(p)} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961] mb-6">Recently viewed</p>
              {viewedHomes.length === 0 ? (
                <p className="text-[#2C2C2C]/45 text-sm italic">The homes you open will appear here.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {viewedHomes.map((p) => (
                    <PortalCard key={p.ref} property={p} saved={saved.includes(p.ref)} onToggleSave={() => toggleSave(p.ref)} onOpen={() => openHome(p)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'profile' && <ProfileTab />}
      </section>

      {open && (
        <HomeDetailDrawer
          property={open}
          onClose={() => setOpen(null)}
          saved={saved.includes(open.ref)}
          onToggleSave={() => toggleSave(open.ref)}
        />
      )}
    </div>
  );
};

const Portal: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
        <p className="font-serif text-2xl text-[#2C2C2C]/50 tracking-[0.3em]">DOORS</p>
      </div>
    );
  }

  return user ? <PortalDashboard /> : <PortalAuth />;
};

export default Portal;
