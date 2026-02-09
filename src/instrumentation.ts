import { initializeDatabaseTables } from '@/lib/dbInit';

let initialized = false;

/**
 * Initialize database on first request
 * This middleware ensures tables exist before processing requests
 */
export async function register() {
  if (initialized) return;
  
  try {
    console.log('🔄 Initializing database tables...');
    const results = await initializeDatabaseTables();
    
    const created = results.filter(r => r.status === 'created');
    const failed = results.filter(r => r.status === 'failed');
    
    if (created.length > 0) {
      console.log(`✅ Created ${created.length} missing tables:`, created.map(r => r.table).join(', '));
    }
    
    if (failed.length > 0) {
      console.warn(`⚠️  Failed to create ${failed.length} tables:`, failed.map(r => r.table).join(', '));
    }
    
    initialized = true;
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't block app startup, continue with degraded functionality
  }
}
