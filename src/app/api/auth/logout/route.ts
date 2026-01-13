import { NextRequest, NextResponse } from "next/server";
import { logout, getCurrentUser } from "@/shared/lib/session";

export async function POST(request: NextRequest) {
  try {
    // Get current user (optional, for logging purposes)
    const user = await getCurrentUser();

    // Destroy the session
    await logout();

    console.log(
      `🚪 User logged out: ${user?.email || "Unknown"} at ${new Date().toISOString()}`,
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
    await logout();

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
