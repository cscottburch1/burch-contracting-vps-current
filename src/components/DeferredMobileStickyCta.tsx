'use client';

import dynamic from 'next/dynamic';

const MobileStickyCta = dynamic(() => import('@/components/MobileStickyCta'), {
  ssr: false,
  loading: () => null,
});

export default function DeferredMobileStickyCta() {
  return <MobileStickyCta />;
}
