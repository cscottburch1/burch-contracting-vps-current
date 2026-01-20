// Enhanced spam detection utilities

/**
 * Check if email looks suspicious (common spam patterns)
 */
export function isEmailSuspicious(email: string): boolean {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  
  // Common spam email patterns
  const suspiciousPatterns = [
    /test.*test/,
    /spam/,
    /fake/,
    /temp/,
    /disposable/,
    /\d{10,}/, // Too many consecutive numbers
    /^[a-z]{20,}@/, // Very long random string before @
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(emailLower));
}

/**
 * Check if phone number looks valid
 */
export function isPhoneSuspicious(phone: string): boolean {
  if (!phone) return false;
  
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Too short or too long
  if (digits.length < 10 || digits.length > 15) return true;
  
  // All same digits (e.g., 1111111111)
  if (/^(\d)\1+$/.test(digits)) return true;
  
  // Sequential digits (e.g., 1234567890)
  if (digits === '1234567890' || digits === '0123456789') return true;
  
  return false;
}

/**
 * Check if text contains too many URLs (spam indicator)
 */
export function containsTooManyUrls(text: string): boolean {
  if (!text) return false;
  
  const urlPattern = /(https?:\/\/|www\.)/gi;
  const matches = text.match(urlPattern);
  
  return matches ? matches.length > 3 : false;
}

/**
 * Check for excessive special characters (spam indicator)
 */
export function hasExcessiveSpecialChars(text: string): boolean {
  if (!text) return false;
  
  const specialChars = text.match(/[^a-zA-Z0-9\s]/g);
  const ratio = specialChars ? specialChars.length / text.length : 0;
  
  return ratio > 0.3; // More than 30% special characters
}

/**
 * Comprehensive spam check
 */
export function detectSpam(data: {
  email?: string;
  phone?: string;
  company_name?: string;
  contact_name?: string;
}): { isSpam: boolean; reason?: string } {
  // Email checks
  if (data.email && isEmailSuspicious(data.email)) {
    return { isSpam: true, reason: 'Suspicious email pattern' };
  }
  
  // Phone checks
  if (data.phone && isPhoneSuspicious(data.phone)) {
    return { isSpam: true, reason: 'Invalid phone number format' };
  }
  
  // Company name checks
  if (data.company_name) {
    if (containsTooManyUrls(data.company_name)) {
      return { isSpam: true, reason: 'Too many URLs in company name' };
    }
    if (hasExcessiveSpecialChars(data.company_name)) {
      return { isSpam: true, reason: 'Excessive special characters' };
    }
  }
  
  // Contact name checks
  if (data.contact_name) {
    if (containsTooManyUrls(data.contact_name)) {
      return { isSpam: true, reason: 'Too many URLs in contact name' };
    }
    if (hasExcessiveSpecialChars(data.contact_name)) {
      return { isSpam: true, reason: 'Excessive special characters' };
    }
  }
  
  return { isSpam: false };
}
