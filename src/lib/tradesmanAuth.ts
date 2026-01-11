import { cookies } from 'next/headers';
import { query, queryOne } from './mysql';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface TradesmanUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export async function createTradesmanToken(userId: number): Promise<string> {
  const token = await new SignJWT({ userId, type: 'tradesman' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyTradesmanToken(token: string): Promise<{ userId: number } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: number; type: string };
    
    if (payload.type === 'tradesman') {
      return { userId: payload.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getCurrentTradesman(): Promise<TradesmanUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('tradesman_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyTradesmanToken(token);
    if (!payload) {
      return null;
    }
    
    // Check tradesman_users table first
    let user = await queryOne(
      'SELECT id, name, email, phone FROM tradesman_users WHERE id = ? AND is_active = true',
      [payload.userId]
    );
    
    // If not found, check subcontractors table
    if (!user) {
      user = await queryOne(
        'SELECT id, contact_name as name, email, phone FROM subcontractors WHERE id = ? AND status IN ("approved", "active")',
        [payload.userId]
      );
    }
    
    return user as TradesmanUser | null;
  } catch (error) {
    console.error('Error getting current tradesman:', error);
    return null;
  }
}

export async function authenticateTradesman(email: string, pin: string): Promise<TradesmanUser | null> {
  try {
    // First try tradesman_users table
    let user = await queryOne(
      'SELECT id, name, email, phone FROM tradesman_users WHERE email = ? AND pin = ? AND is_active = true',
      [email.toLowerCase(), pin]
    );
    
    // If not found, try subcontractors table
    if (!user) {
      user = await queryOne(
        'SELECT id, contact_name as name, email, phone FROM subcontractors WHERE email = ? AND pin = ? AND status IN ("approved", "active")',
        [email.toLowerCase(), pin]
      );
    }
    
    return user as TradesmanUser | null;
  } catch (error) {
    console.error('Error authenticating tradesman:', error);
    return null;
  }
}
