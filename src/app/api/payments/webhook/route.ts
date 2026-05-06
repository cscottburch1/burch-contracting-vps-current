import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { success: false, message: 'Online payments are not enabled.' },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Online payments are not enabled.' },
    { status: 410 }
  );
}
