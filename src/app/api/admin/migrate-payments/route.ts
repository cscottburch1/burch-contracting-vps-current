import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';

// Run payments migration
export async function POST(request: NextRequest) {
  void request;
  const admin = await getCurrentAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  return NextResponse.json(
    { success: false, message: 'Online payments are not enabled.' },
    { status: 410 }
  );
}
