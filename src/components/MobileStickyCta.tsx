'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { siteConfig } from '@/lib/seo/site';

const hiddenPrefixes = ['/admin', '/portal', '/crm', '/tradesmen', '/subcontractors'];

export default function MobileStickyCta() {
  const pathname = usePathname();

  if (!pathname || hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-3 pt-2 shadow-2xl backdrop-blur md:hidden">
      <p className="mb-2 text-center text-xs text-gray-400">Free estimates · Licensed &amp; insured · BBB A+</p>
      <div className="mx-auto flex max-w-lg gap-3 px-3">
        <Button variant="outline" size="md" href={siteConfig.phoneHref} fullWidth>
          <Icon name="Phone" size={18} />
          Call
        </Button>
        <Button variant="primary" size="md" href="/contact" fullWidth>
          <Icon name="ClipboardEdit" size={18} />
          Free Estimate
        </Button>
      </div>
    </div>
  );
}
