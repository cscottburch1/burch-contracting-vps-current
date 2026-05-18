import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';

export async function POST() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    { message: 'Migration already applied. Tables exist.' },
    { status: 410 }
  );
}
