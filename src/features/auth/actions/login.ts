"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { User } from "@/models";
import { createSession, setSessionCookie } from "@/lib/auth/session";

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    if (!email || !password) {
      return { error: "Please provide email and password" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Invalid email format" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    // Connect to database
    await connectDB();

    // Find user with password field
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Check password
    if (!user.password) {
      return { error: "Account setup incomplete. Please reset your password." };
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    // Check if account is active
    if (!user.isActive || user.status !== "active") {
      return {
        error: "Your account has been disabled. Please contact support.",
      };
    }

    // Check if email is verified (optional check)
    if (!user.emailVerified) {
      return { error: "Please verify your email address before logging in." };
    }

    // Create session
    const { sessionToken, expires } = await createSession(user._id.toString());

    // Set session cookie
    setSessionCookie(sessionToken, expires);

    // Update user login info
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Determine redirect URL based on role
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const domain = "localhost:3000";

    let redirectUrl = `${protocol}://myaccount.${domain}`;

    // Role-based redirects
    switch (user.role) {
      case "super-admin":
        redirectUrl = `${protocol}://ump.${domain}`;
        break;
      case "admin":
        redirectUrl = `${protocol}://ump.${domain}`;
        break;
      case "staff":
        redirectUrl = `${protocol}://academy.${domain}`;
        break;
      case "center":
        redirectUrl = `${protocol}://academy.${domain}`;
        break;
      case "provider":
        redirectUrl = `${protocol}://provider.${domain}`;
        break;
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
      `✅ User logged in: ${user.email} (${user.role}) - Redirecting to: ${redirectUrl}`,
    );

    // Redirect after successful login
    redirect(redirectUrl);
  } catch (error: unknown) {
    console.error("Login action error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Don't expose database errors to user
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("validation")
      ) {
        return { error: "Login failed. Please check your credentials." };
      }

      // Handle redirect errors (these are expected)
      if (error.message === "NEXT_REDIRECT") {
        throw error; // Re-throw redirect errors
      }

      return { error: "Login failed. Please try again." };
    }

    return { error: "An unexpected error occurred. Please try again." };
  }
}
