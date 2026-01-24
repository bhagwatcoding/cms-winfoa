import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/core/db";
import { User } from "@/models";
import { createSession, setSessionCookie } from "@/core/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, confirmPassword, role = "user" } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Validate role (only allow certain roles for self-registration)
    const allowedRoles = ["user", "student"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      status: "active", // Auto-activate for development
      isActive: true,
      emailVerified: process.env.NODE_ENV === "development",
      walletBalance: 0,
    });

    await user.save();

    // Log registration
    console.log(`📝 New user registered: ${user.email} (${user.role})`);

    // Create session for auto-login after registration
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;

    const session = await createSession(
      user._id.toString(),
      userAgent,
      ipAddress,
    );

    // Set session cookie
    await setSessionCookie(session.token, session.expiresAt);

    // Return success response (excluding sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        walletBalance: user.walletBalance,
      },
      message: "Registration successful! You are now logged in.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific MongoDB errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const validationErrors = Object.values((error as any).errors).map(
        (err: { message: string }) => err.message,
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
