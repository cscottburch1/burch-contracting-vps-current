import { NextResponse } from 'next/server';
import { initializeDatabaseTables, checkDatabaseHealth } from '@/lib/dbInit';

/**
 * Health check and database initialization endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    // Check database health
    const health = await checkDatabaseHealth();
    
    if (!health.connected) {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'disconnected',
        error: health.error
      }, { status: 503 });
    }

    // Initialize missing tables
    const initResults = await initializeDatabaseTables();
    const failedTables = initResults.filter(r => r.status === 'failed');
    
    if (failedTables.length > 0) {
      return NextResponse.json({
        status: 'degraded',
        database: 'connected',
        tables: health.tables,
        initialization: initResults,
        warnings: failedTables.map(t => `Failed to create ${t.table}: ${t.error}`)
      }, { status: 200 });
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      tables: health.tables.length,
      initialization: initResults
    });
    
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}
