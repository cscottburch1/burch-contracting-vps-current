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

// Pre-defined conversion events
export const analytics = {
  // Contact form submission
  trackContactForm: (formType: string = 'general') => {
    trackEvent('contact_form_submit', 'Lead Generation', formType);
  },

  // Phone number click
  trackPhoneClick: () => {
    trackEvent('phone_click', 'Lead Generation', 'Phone: (864) 724-4600');
  },

  // Email click
  trackEmailClick: () => {
    trackEvent('email_click', 'Lead Generation', 'estimates@burchcontracting.com');
  },

  // Service page view
  trackServiceView: (serviceName: string) => {
    trackEvent('service_view', 'Services', serviceName);
  },

  // Calculator usage
  trackCalculatorUse: (calculatorType: string) => {
    trackEvent('calculator_use', 'Engagement', calculatorType);
  },

  // Proposal generated
  trackProposalGenerated: (proposalType: string, value?: number) => {
    trackEvent('proposal_generated', 'Conversions', proposalType, value);
  },

  // Customer portal signup
  trackPortalSignup: () => {
    trackEvent('portal_signup', 'Conversions', 'Customer Portal');
  },

  // Lead conversion
  trackLeadConversion: (leadId: string, value?: number) => {
    trackEvent('lead_converted', 'Conversions', leadId, value);
  },

  // AI Chat interaction
  trackChatInteraction: (action: string) => {
    trackEvent('chat_interaction', 'Engagement', action);
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
