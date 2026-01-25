import { env } from './env';
import { TENANCY } from './site';

export const SESSION = {
  // Security
  SECRET: env.SESSION_SECRET,

  // Duration: 30 Days (in seconds)
  DURATION: {
    MAX_AGE: 60 * 60 * 24 * 30 * 1000,
    REMEMBER_ME: 90 * 24 * 60 * 60 * 1000, // 90 days
  },
  COOKIE: {
    NAME: env.SESSION_COOKIE_NAME,

    // Cookie Settings (Passed to cookies().set())
    OPTIONS: {
      httpOnly: true, // Prevents XSS
      secure: env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'lax', // Allows auth redirects
      // expires: new Date(),
      domain: TENANCY.COOKIE_DOMAIN, // Vital for Multi-tenancy
      path: '/',
    } as const,
  },
};

export const SECURITY = {
  BCRYPT_ROUNDS: 12, // Slow enough to be secure, fast enough for UX
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;
