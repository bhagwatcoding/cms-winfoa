"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { User } from "@/models";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { z } from "zod";
import { VALIDATION } from "@/config";

// Define schema outside function for better performance/reusability
const LoginSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION.REGEX.EMAIL, { message: "Invalid email format" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
export async function loginAction(prevState: unknown, formData: FormData) {
  // 1. Initialize redirect path variable (to be used outside try/catch)
  let redirectUrl: string | null = null;

  try {
    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // 2. Validate input using Zod exclusively (cleaner than mixing Regex)
    const validationResult = LoginSchema.safeParse(rawFormData);

    if (!validationResult.success) {
      // Return the first error message found
      return { error: validationResult.error.email.message };
    }

    const { email, password } = validationResult.data;

    // 3. Connect DB
    await connectDB();

    // 4. Find user (Select password explicitly)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password +role +isActive +status +emailVerified");

    // 5. Unified credential check (Prevents enumeration/timing attacks)
    const loginFailedMsg = "Invalid email or password";

    if (!user || !user.password) {
      return { error: loginFailedMsg };
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return { error: loginFailedMsg };
    }

    // 6. Account Status Checks
    if (!user.isActive || user.status !== "active") {
      return {
        error: "Your account has been disabled. Please contact support.",
      };
    }

    if (!user.emailVerified) {
      return { error: "Please verify your email address before logging in." };
    }

    // 7. Session Management
    const { sessionToken, expires } = await createSession(user._id.toString());
    await setSessionCookie(sessionToken, expires);

    // 8. Update Stats (Non-blocking usually preferred, but await is safer here)
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // 9. Determine Redirect URL
    // Use environment variable for domain to support Prod/Dev environments
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const rootDomain = process.env.ROOT_DOMAIN || "localhost:3000";

    // Helper to construct URL
    const getUrl = (subdomain: string) =>
      `${protocol}://${subdomain}.${rootDomain}`;

    switch (user.role) {
      case "super-admin":
      case "admin":
        redirectUrl = getUrl("ump");
        break;
      case "staff":
      case "center":
      case "student":
        redirectUrl = getUrl("academy");
        break;
      case "provider":
        redirectUrl = getUrl("provider");
        break;
      case "user":
      default:
        redirectUrl = getUrl("myaccount");
        break;
    }

    console.log(`✅ User logged in: ${user.email} (${user.role})`);
  } catch (error: unknown) {
    console.error("Login action error:", error);

    if (error instanceof Error) {
      // Don't expose internal DB errors (like connection timeouts) to the UI
      return { error: "An unexpected error occurred. Please try again later." };
    }
    return { error: "Login failed." };
  }

  // 10. Redirect *outside* the try/catch block
  // This prevents the "NEXT_REDIRECT" error from being caught
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
