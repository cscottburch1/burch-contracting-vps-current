import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is from subcontractors table
    const subcontractor = await query(
      'SELECT id FROM subcontractors WHERE id = ?',
      [tradesman.id]
    );
    
    if (!subcontractor || subcontractor.length === 0) {
      return NextResponse.json({ error: 'Only subcontractors can upload logos' }, { status: 403 });
    }
    
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `subcontractor-${tradesman.id}-${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    
    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    const logoUrl = `/uploads/logos/${filename}`;
    
    // Update database
    await query(
      'UPDATE subcontractors SET logo_url = ? WHERE id = ?',
      [logoUrl, tradesman.id]
    );
    
    return NextResponse.json({ 
      success: true,
      logo_url: logoUrl
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
  }
}
