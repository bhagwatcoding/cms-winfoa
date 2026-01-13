"use server";

import { redirect } from "next/navigation";
import connectDB from "@/shared/lib/db";
import { User } from "@/shared/lib/db/models";
import { createSession, setSessionCookie } from "@/shared/lib/auth/session";

export async function registerAction(prevState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = (formData.get("role") as string) || "user";

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return { error: "All fields are required" };
    }

    if (name.trim().length < 2) {
      return { error: "Name must be at least 2 characters long" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Please provide a valid email address" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // Validate role (only allow certain roles for self-registration)
    const allowedRoles = ["user", "student"];
    if (!allowedRoles.includes(role)) {
      return { error: "Invalid role specified" };
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    // Get default subdomain access based on role
    const subdomainAccess = getDefaultSubdomainAccess(role);

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      status: process.env.NODE_ENV === "development" ? "active" : "pending",
      isActive: true,
      emailVerified: process.env.NODE_ENV === "development",
      emailVerifiedAt: process.env.NODE_ENV === "development" ? new Date() : undefined,
      subdomainAccess,
      walletBalance: 0,
      loginCount: 0,
      profile: {
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
      },
    });

    // Generate email verification token (for production)
    if (process.env.NODE_ENV !== "development") {
      user.generateEmailVerificationToken();
    }

    await user.save();

    console.log(
      `📝 New user registered: ${user.email} (${user.role}) - Status: ${user.status}`,
    );

    // For development, auto-login after registration
    if (process.env.NODE_ENV === "development") {
      // Create session
      const { sessionToken, expires } = await createSession(user._id.toString());

      // Set session cookie
      setSessionCookie(sessionToken, expires);

      // Determine redirect URL based on role
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const domain = process.env.NODE_ENV === "production" ? "winfoa.com" : "localhost:3000";

      let redirectUrl = `${protocol}://myaccount.${domain}`;

      switch (user.role) {
        case "student":
          redirectUrl = `${protocol}://academy.${domain}`;
          break;
        case "user":
          redirectUrl = `${protocol}://myaccount.${domain}`;
          break;
        default:
          redirectUrl = `${protocol}://myaccount.${domain}`;
      }

      console.log(
        `✅ User auto-logged in after registration: ${user.email} - Redirecting to: ${redirectUrl}`,
      );

      // Redirect after successful registration
      redirect(redirectUrl);
    }

    // For production, return success message (no auto-login)
    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
    };

  } catch (error: unknown) {
    console.error("Registration action error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Handle MongoDB duplicate key errors
      if (error.message.includes("E11000") || error.message.includes("duplicate key")) {
        return { error: "An account with this email already exists" };
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values((error as any).errors).map(
          (err: any) => err.message,
        );
        return { error: `Validation error: ${validationErrors.join(", ")}` };
      }

      // Handle redirect errors (these are expected)
      if (error.message === "NEXT_REDIRECT") {
        throw error; // Re-throw redirect errors
      }

      return { error: "Registration failed. Please try again." };
    }

    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Helper function to get default subdomain access based on role
function getDefaultSubdomainAccess(role: string): string[] {
  const accessMap: Record<string, string[]> = {
    "super-admin": [
      "auth",
      "academy",
      "api",
      "ump",
      "provider",
      "myaccount",
      "wallet",
      "developer",
    ],
    "admin": ["auth", "academy", "api", "ump", "myaccount", "wallet"],
    "staff": ["auth", "academy", "myaccount", "wallet"],
    "center": ["auth", "academy", "myaccount"],
    "provider": ["auth", "provider", "myaccount", "wallet"],
    "student": ["auth", "academy", "myaccount"],
    "user": ["auth", "myaccount"],
  };

  return accessMap[role] || ["auth", "myaccount"];
}
