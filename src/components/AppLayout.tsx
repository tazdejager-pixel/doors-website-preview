import React, { useState } from 'react';
import Navbar from './doors/Navbar';
import Hero from './doors/Hero';
import Philosophy from './doors/Philosophy';
import Collection from './doors/Collection';
import Region from './doors/Region';
import Founder from './doors/Founder';
import Sellers from './doors/Sellers';
import RegisterCTA from './doors/RegisterCTA';
import Footer from './doors/Footer';
import EnquiryModal from './doors/EnquiryModal';
import PropertyDetail from './doors/PropertyDetail';
import { DoorsProperty } from '@/lib/doorsData';

const AppLayout: React.FC = () => {
  const [modal, setModal] = useState<{ open: boolean; kind: 'buyer' | 'seller'; ref?: string; title?: string }>({
    open: false,
    kind: 'buyer',
  });
  const [detail, setDetail] = useState<DoorsProperty | null>(null);

  const openBuyer = () => setModal({ open: true, kind: 'buyer' });
  const openSeller = () => setModal({ open: true, kind: 'seller' });
  const viewProperty = (p: DoorsProperty) => setDetail(p);
  const requestProperty = (p: DoorsProperty) => {
    setDetail(null);
    setModal({ open: true, kind: 'buyer', ref: p.ref, title: p.title });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));

  return (
    <div className="bg-[#F8F6F3] font-sans text-[#2C2C2C] antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar onEnquire={openBuyer} />
      <Hero onEnquire={openBuyer} />
      <Philosophy />
      <Collection onView={viewProperty} />
      <Region />
      <Founder />
      <Sellers onSeller={openSeller} />
      <RegisterCTA onBuyer={openBuyer} onSeller={openSeller} />
      <Footer onEnquire={openBuyer} />

      <PropertyDetail property={detail} onClose={() => setDetail(null)} onRequest={requestProperty} />

      <EnquiryModal
        open={modal.open}
        onClose={close}
        kind={modal.kind}
        propertyRef={modal.ref}
        propertyTitle={modal.title}
      />
    </div>
  );
};

export default AppLayout;
