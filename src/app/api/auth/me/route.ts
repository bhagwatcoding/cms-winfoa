import { NextRequest, NextResponse } from "next/server";
import { SessionService } from "@/shared/services/session";

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await SessionService.getCurrentSession();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current session
    const session = await SessionService.getSession();

    // Return user information
    return NextResponse.json({
      success: true,
      user,
      session: session
        ? {
            expires: session.expires,
            token: session.sessionToken,
          }
        : null,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle POST requests for session validation
export async function POST(request: NextRequest) {
  try {
    const user = await SessionService.getCurrentSession();  

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session validation error:", error);
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

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
