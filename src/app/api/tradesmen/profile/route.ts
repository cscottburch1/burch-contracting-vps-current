import { NextResponse } from 'next/server';
import { getCurrentTradesman } from '@/lib/tradesmanAuth';
import { query } from '@/lib/mysql';

export async function PATCH(request: Request) {
  try {
    const tradesman = await getCurrentTradesman();
    
    if (!tradesman) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Check if user is from subcontractors table (they have editable profiles)
    const subcontractor = await query(
      'SELECT id FROM subcontractors WHERE id = ?',
      [tradesman.id]
    );
    
    if (!subcontractor || subcontractor.length === 0) {
      return NextResponse.json({ error: 'Only subcontractors can edit profiles' }, { status: 403 });
    }
    
    const updates: string[] = [];
    const values: any[] = [];
    
    // Allow updating profile fields
    if (body.website !== undefined) {
      updates.push('website = ?');
      values.push(body.website);
    }
    
    if (body.bio !== undefined) {
      updates.push('bio = ?');
      values.push(body.bio);
    }
    
    if (body.services_offered !== undefined) {
      updates.push('services_offered = ?');
      values.push(body.services_offered);
    }
    
    if (body.years_in_business !== undefined) {
      updates.push('years_in_business = ?');
      values.push(body.years_in_business);
    }
    
    if (body.profile_theme !== undefined) {
      updates.push('profile_theme = ?');
      values.push(body.profile_theme);
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    values.push(tradesman.id);
    
    await query(
      `UPDATE subcontractors SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    // Get updated profile
    const updatedProfile = await query(
      `SELECT id, company_name, contact_name, email, phone, website, logo_url, bio, 
              services_offered, specialties, years_in_business, license_number, 
              insurance_provider, profile_theme
       FROM subcontractors 
       WHERE id = ?`,
      [tradesman.id]
    );
    
    return NextResponse.json({ 
      success: true,
      profile: updatedProfile[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
