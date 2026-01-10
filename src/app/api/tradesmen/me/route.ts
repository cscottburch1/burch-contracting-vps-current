import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';

export async function GET() {
  try {
    const user = await getCurrentTradesman();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching tradesman:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
