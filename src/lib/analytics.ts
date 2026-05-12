// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Pre-defined conversion events using GA4 recommended events
export const analytics = {
  // Contact form submission - GA4 recommended event
  trackContactForm: (formType: string = 'general') => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Lead Generation',
        event_label: formType,
        method: 'contact_form',
      });
    }
  },

  // Phone number click - Custom event with GA4 format
  trackPhoneClick: (location: string = 'header') => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'phone_click', {
        event_category: 'Lead Generation',
        event_label: 'Phone: (864) 724-4600',
        location: location,
      });
    }
  },

  // Email click - Custom event with GA4 format
  trackEmailClick: (location: string = 'header') => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'email_click', {
        event_category: 'Lead Generation',
        event_label: 'estimates@burchcontracting.com',
        location: location,
      });
    }
  },

  // Service page view - Custom event
  trackServiceView: (serviceName: string) => {
    trackEvent('service_view', 'Services', serviceName);
  },

  // Calculator start - Custom event for engagement
  trackCalculatorStart: (calculatorType: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'calculator_start', {
        event_category: 'Engagement',
        event_label: calculatorType,
      });
    }
  },

  // Calculator complete - Custom event for conversion
  trackCalculatorComplete: (calculatorType: string, estimatedValue?: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'calculator_complete', {
        event_category: 'Engagement',
        event_label: calculatorType,
        value: estimatedValue,
      });
    }
  },

  // Get Estimate button click
  trackGetEstimateClick: (location: string = 'page') => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'get_estimate_click', {
        event_category: 'Lead Generation',
        event_label: location,
      });
    }
  },

  // Directions click (for local SEO)
  trackDirectionsClick: () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'directions_click', {
        event_category: 'Local Engagement',
        event_label: 'Google Maps',
      });
    }
  },

  // Proposal generated
  trackProposalGenerated: (proposalType: string, value?: number) => {
    trackEvent('proposal_generated', 'Conversions', proposalType, value);
  },

  // Customer portal signup
  trackPortalSignup: () => {
    trackEvent('portal_signup', 'Conversions', 'Customer Portal');
  },

  // Lead conversion (use GA4 purchase event for high-value conversions)
  trackLeadConversion: (leadId: string, value?: number) => {
    if (typeof window.gtag !== 'undefined' && value) {
      window.gtag('event', 'purchase', {
        transaction_id: leadId,
        value: value,
        currency: 'USD',
        items: [{
          item_name: 'Project Contract',
          item_category: 'Construction Service',
        }],
      });
    }
  },

  // Document download
  trackDocumentDownload: (documentName: string) => {
    trackEvent('document_download', 'Engagement', documentName);
  },

  // Payment completed
  trackPayment: (amount: number, method: string) => {
    trackEvent('payment_completed', 'Revenue', method, amount);
  },
};
