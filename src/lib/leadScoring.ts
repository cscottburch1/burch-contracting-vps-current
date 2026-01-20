// Lead scoring and priority utility functions
// Calculates lead quality score and assigns priority automatically

export interface LeadScoringData {
  budgetRange?: string;
  timeframe?: string;
  serviceType?: string;
  referralSource?: string;
  description?: string;
}

export interface LeadScore {
  totalScore: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  breakdown: {
    budgetScore: number;
    timeframeScore: number;
    serviceScore: number;
    referralScore: number;
  };
}

/**
 * Calculate lead score based on multiple factors
 */
export function calculateLeadScore(data: LeadScoringData): LeadScore {
  let budgetScore = 0;
  let timeframeScore = 0;
  let serviceScore = 0;
  let referralScore = 0;

  // Budget Range Scoring (0-100 points)
  if (data.budgetRange) {
    const budget = data.budgetRange.toLowerCase();
    if (budget.includes('50,000+') || budget.includes('50k+')) {
      budgetScore = 100;
    } else if (budget.includes('20,000') || budget.includes('20k')) {
      budgetScore = 75;
    } else if (budget.includes('10,000') || budget.includes('10k')) {
      budgetScore = 50;
    } else if (budget.includes('5,000') || budget.includes('5k')) {
      budgetScore = 25;
    }
  }

  // Timeframe Scoring (0-100 points)
  if (data.timeframe) {
    const timeframe = data.timeframe.toLowerCase();
    if (timeframe.includes('asap') || timeframe.includes('immediately') || timeframe.includes('urgent')) {
      timeframeScore = 100;
    } else if (timeframe.includes('1 month') || timeframe.includes('1-3 month')) {
      timeframeScore = 75;
    } else if (timeframe.includes('3-6 month')) {
      timeframeScore = 50;
    } else if (timeframe.includes('6+ month') || timeframe.includes('planning')) {
      timeframeScore = 25;
    }
  }

  // Service Type Scoring (0-100 points)
  if (data.serviceType) {
    const service = data.serviceType.toLowerCase();
    if (service.includes('full') || service.includes('addition') || service.includes('renovation')) {
      serviceScore = 100;
    } else if (service.includes('kitchen') || service.includes('bathroom') || service.includes('basement')) {
      serviceScore = 75;
    } else if (service.includes('repair') || service.includes('maintenance')) {
      serviceScore = 50;
    } else if (service.includes('consultation')) {
      serviceScore = 25;
    }
  }

  // Referral Source Scoring (0-50 bonus points)
  if (data.referralSource) {
    const referral = data.referralSource.toLowerCase();
    if (referral.includes('client') || referral.includes('friend') || referral.includes('family')) {
      referralScore = 50;
    } else if (referral.includes('google') || referral.includes('search')) {
      referralScore = 25;
    } else if (referral.includes('social')) {
      referralScore = 15;
    }
  }

  // Description quality bonus (0-25 points)
  let descriptionBonus = 0;
  if (data.description) {
    const wordCount = data.description.trim().split(/\s+/).length;
    if (wordCount > 50) {
      descriptionBonus = 25;
    } else if (wordCount > 20) {
      descriptionBonus = 15;
    } else if (wordCount > 10) {
      descriptionBonus = 10;
    }
  }

  const totalScore = budgetScore + timeframeScore + serviceScore + referralScore + descriptionBonus;

  // Determine priority based on total score
  let priority: 'urgent' | 'high' | 'medium' | 'low';
  if (totalScore >= 250) {
    priority = 'urgent';
  } else if (totalScore >= 175) {
    priority = 'high';
  } else if (totalScore >= 100) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  return {
    totalScore,
    priority,
    breakdown: {
      budgetScore,
      timeframeScore,
      serviceScore,
      referralScore,
    },
  };
}

/**
 * Calculate how many days a lead has been in the system
 */
export function calculateLeadAge(createdAt: string | Date): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determine if a lead is aging and needs attention
 */
export function getLeadAgingStatus(createdAt: string | Date, status: string): {
  isAging: boolean;
  severity: 'critical' | 'warning' | 'normal';
  message: string;
} {
  const age = calculateLeadAge(createdAt);

  // Critical aging thresholds by status
  if (status === 'new' && age > 1) {
    return {
      isAging: true,
      severity: 'critical',
      message: `New lead uncontacted for ${age} days!`,
    };
  }

  if (status === 'contacted' && age > 3) {
    return {
      isAging: true,
      severity: 'warning',
      message: `No follow-up for ${age} days`,
    };
  }

  if (status === 'qualified' && age > 5) {
    return {
      isAging: true,
      severity: 'warning',
      message: `Qualified lead waiting ${age} days`,
    };
  }

  if (status === 'proposal' && age > 7) {
    return {
      isAging: true,
      severity: 'warning',
      message: `Proposal sent ${age} days ago`,
    };
  }

  return {
    isAging: false,
    severity: 'normal',
    message: '',
  };
}

/**
 * Get recommended next action based on lead status and age
 */
export function getRecommendedAction(lead: {
  status: string;
  createdAt: string | Date;
  lastContactDate?: string | Date | null;
}): string {
  const age = calculateLeadAge(lead.createdAt);
  const daysSinceContact = lead.lastContactDate 
    ? calculateLeadAge(lead.lastContactDate)
    : age;

  switch (lead.status) {
    case 'new':
      return age === 0 
        ? 'Contact within 1 hour for best results'
        : 'URGENT: Contact immediately!';
    
    case 'contacted':
      if (daysSinceContact >= 3) {
        return 'Send follow-up email or call';
      }
      return 'Schedule qualification meeting';
    
    case 'qualified':
      if (daysSinceContact >= 5) {
        return 'Follow up on proposal status';
      }
      return 'Prepare and send proposal';
    
    case 'proposal':
      if (daysSinceContact >= 7) {
        return 'URGENT: Follow up on proposal';
      }
      return 'Wait for customer response or follow up';
    
    case 'negotiation':
      return 'Close the deal or address concerns';
    
    default:
      return 'Review and update lead status';
  }
}

/**
 * Format phone number for click-to-call
 */
export function formatPhoneForCall(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as tel: link
  return `tel:+1${cleaned}`;
}

/**
 * Generate email subject based on lead status
 */
export function generateEmailSubject(lead: {
  name: string;
  serviceType?: string;
  status: string;
}): string {
  const firstName = lead.name.split(' ')[0];
  
  switch (lead.status) {
    case 'new':
      return `Thank you for your inquiry, ${firstName}!`;
    case 'contacted':
      return `Following up on your ${lead.serviceType || 'project'} inquiry`;
    case 'qualified':
      return `Your ${lead.serviceType || 'project'} proposal`;
    case 'proposal':
      return `Questions about your proposal?`;
    case 'negotiation':
      return `Let's finalize your ${lead.serviceType || 'project'}`;
    default:
      return `Regarding your ${lead.serviceType || 'project'} with Burch Contracting`;
  }
}
