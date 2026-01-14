import { z } from "zod";

const envSchema = z.object({
    // ==========================================
    // SERVER-SIDE VARIABLES (Not visible to browser)
    // ==========================================
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    MONGODB_URI: z.string().url().min(1, "Database URI is required"),
    SESSION_SECRET: z.string().min(32, "Session secret must be at least 32 chars"),

    // ==========================================
    // CLIENT-SIDE VARIABLES (Visible to browser via NEXT_PUBLIC_)
    // ==========================================
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1, "Root domain is required (e.g., localhost:3000 or winfoa.com)"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Safe Parse prevents the app from running with bad config
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables. Check your .env file.");
}

export const env = _env.data;