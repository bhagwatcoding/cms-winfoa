import { NextResponse } from 'next/server';
import { SessionCoreService } from '@/shared/services/session';

export async function POST() {
  try {
    // Get current session
    const session = await SessionCoreService.getCurrentSession();

    if (session) {
      // Invalidate the session
      await SessionCoreService.invalidateSession(session);
      console.log(
        `User logged out: ${session.userId?.email || 'Unknown'} at ${new Date().toISOString()}`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET requests (for logout links)
export async function GET() {
  try {
    // Get current session
    const session = await SessionCoreService.getCurrentSession();

    if (session) {
      // Invalidate the session
      await SessionCoreService.invalidateSession(session);
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
