import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/db";
import { User } from "@/models";
import { requireAuth } from "@/core/auth";

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const currentUser = await requireAuth();

    await connectDB();

    // Get user with wallet balance
    const user = await User.findById(currentUser.id).select('walletBalance name email');

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: user.walletBalance || 0,
      currency: "USD",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      lastUpdated: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Get wallet balance error:", error);

    if (error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
