import { NextRequest, NextResponse } from "next/server";
import { SessionService } from "@/shared/services/session";

export async function POST(request: NextRequest) {
  try {
    // Get current user (optional, for logging purposes)
    const user = await SessionService.getCurrentSession();

    // Get current session
    const session = await SessionService.getSession(request);
    
    // Destroy the session if it exists
    if (session?.sessionToken) await SessionService.destroySession(session.sessionToken);
    
    // Delete session cookie
    await SessionService.deleteSessionCookie();

    console.log(
      `User logged out: ${user?.email || "Unknown"} at ${new Date().toISOString()}`,
    );

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle GET requests (for logout links)
export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await SessionService.getSession(request);
    
    // Destroy the session if it exists
    if (session?.sessionToken) {
      await SessionService.destroySession(session.sessionToken);
    }
    
    // Delete session cookie
    await SessionService.deleteSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
