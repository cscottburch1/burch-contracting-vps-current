import { NextResponse } from 'next/server';
import { initializeDatabaseTables, checkDatabaseHealth } from '@/lib/dbInit';
import { getMissingEnv, listRequiredEnv } from '@/lib/envCheck';

/**
 * Health check endpoint (read-only by default)
 * GET /api/health
 */
export async function GET(request: Request) {
  try {
    const requiredEnv = listRequiredEnv();
    const missingCriticalEnv = getMissingEnv(requiredEnv.critical);

    if (missingCriticalEnv.length > 0) {
      return NextResponse.json({
        status: 'misconfigured',
        missingEnv: missingCriticalEnv,
      }, { status: 503 });
    }

    // Check database health
    const health = await checkDatabaseHealth();
    
    if (!health.connected) {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'disconnected',
        error: health.error
      }, { status: 503 });
    }

    const url = new URL(request.url);
    const runInit = url.searchParams.get('init') === '1' && process.env.ALLOW_HEALTH_INIT === 'true';

    if (!runInit) {
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        tables: health.tables.length,
        missingEmailEnv: getMissingEnv(requiredEnv.email),
      });
    }

    // Optional maintenance mode: initialize missing tables only when explicitly requested.
    const initResults = await initializeDatabaseTables();
    const failedTables = initResults.filter((r) => r.status === 'failed');

    if (failedTables.length > 0) {
      return NextResponse.json(
        {
          status: 'degraded',
          database: 'connected',
          tables: health.tables.length,
          initialization: initResults,
          warnings: failedTables.map((t) => `Failed to create ${t.table}: ${t.error}`),
        },
        { status: 200 }
      );
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
