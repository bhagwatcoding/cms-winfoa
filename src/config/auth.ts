import { env } from "./env";
import { TENANCY } from "./site";

export const SESSION = {
    // Security
    SECRET: env.SESSION_SECRET,
    COOKIE_NAME: "w_sid", // Obscure name is better than 'connect.sid'

    // Duration: 30 Days (in seconds)
    DURATION: 30 * 24 * 60 * 60,

    // Cookie Settings (Passed to cookies().set())
    COOKIE_OPTIONS: {
        httpOnly: true, // Prevents XSS
        secure: env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax", // Allows auth redirects
        domain: TENANCY.COOKIE_DOMAIN, // Vital for Multi-tenancy
        path: "/",
    } as const,
};

export const SECURITY = {
    BCRYPT_ROUNDS: 12, // Slow enough to be secure, fast enough for UX
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;