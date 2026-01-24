import { z } from "zod";

// ==========================================
// 1. CLIENT-SIDE SCHEMA (Safe for browser)
// ==========================================
const clientSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_ROOT_DOMAIN: z
    .string()
    .trim()
    .min(1, "Root domain is required (e.g., localhost:3000 or winfoa.com)")
    .default("localhost:3000"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000"),
});

// ==========================================
// 2. SERVER-SIDE SCHEMA (Private secrets)
// ==========================================
const serverSchema = z.object({
  MONGODB_URI: z
    .string()
    .trim()
    .url("MONGODB_URI must be a valid URL starting with mongodb:// or mongodb+srv://")
    .min(1, "Database URI is required"),

  MONGODB_NAME: z
    .string()
    .trim()
    .min(1, "Database Name is required")
    .default("winfoa"),

  SESSION_SECRET: z
    .string()
    .trim()
    .min(32, "Session secret must be at least 32 chars")
    .default("super-secret-session-key-must-be-32-chars-long"),

  SESSION_COOKIE_NAME: z.string().trim().default("w_sid"),
});

// Combine for type definition (Server has everything)
const mergedSchema = clientSchema.merge(serverSchema);
type Env = z.infer<typeof mergedSchema>;

// ==========================================
// 3. VALIDATION LOGIC
// ==========================================
function validateEnv(): Env {
  // Check if we are in the browser
  const isClient = typeof window !== "undefined";

  if (isClient) {
    // Client-side: Only validate public variables
    // We manually pick these from process.env to avoid bundler issues
    const clientEnv = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };

    const parsed = clientSchema.safeParse(clientEnv);

    if (!parsed.success) {
      console.error("❌ Invalid Client Environment Variables:", parsed.error.format());
      throw new Error("Invalid client environment variables.");
    }

    // Cast to Env (server keys will be missing/undefined, which is correct for client)
    return parsed.data as unknown as Env;
  }

  // Server-side: Validate everything
  const parsed = mergedSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid Server Environment Variables:",
      JSON.stringify(parsed.error.format(), null, 2)
    );
    throw new Error("Invalid server environment variables. Check your .env file.");
  }

  const envData = parsed.data;

  // Extra validation for Production security
  if (envData.NODE_ENV === "production") {
    const defaultSecret = "super-secret-session-key-must-be-32-chars-long";
    if (envData.SESSION_SECRET === defaultSecret) {
      throw new Error(
        "❌ PRODUCTION SECURITY WARNING: You are using the default SESSION_SECRET. Please set a unique secure value in your .env file."
      );
    }
  }

  return envData;
}

export const env = validateEnv();
