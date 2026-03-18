'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function trackEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer;

  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: eventName, ...params });
  }
}

export default function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (pathname.startsWith('/locations/')) {
      trackEvent('local_landing_page_view', {
        page_path: pathname,
        page_group: 'local-landing',
      });
    }

    if (pathname.startsWith('/calculator/')) {
      trackEvent('calculator_page_view', {
        page_path: pathname,
        page_group: 'calculator',
      });
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        trackEvent('call_click', {
          link_url: href,
          page_path: pathname || window.location.pathname,
          interaction_type: 'phone',
        });
      }

      if (href.startsWith('/contact')) {
        trackEvent('estimate_intent_click', {
          link_url: href,
          page_path: pathname || window.location.pathname,
          interaction_type: 'estimate',
        });
      }

      if (href.startsWith('/calculator/')) {
        trackEvent('calculator_open_click', {
          link_url: href,
          page_path: pathname || window.location.pathname,
          interaction_type: 'calculator',
        });
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [pathname]);

  return null;
}
