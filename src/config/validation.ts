// ==========================================
// VALIDATION
// ==========================================
export const LENGTH = {
  MIN: {
    PASSWORD: 6,
    NAME: 2,
    PHONE: 10,
  },
  MAX: {
    PASSWORD: 100,
    NAME: 100,
    PHONE: 15,
  },
};

export const REGEX = {
  PHONE: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// ==========================================
// CACHE
// ==========================================

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

// ==========================================
// RATE LIMITING
// ==========================================

export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_REQUESTS: 100,
  API_WINDOW: 60 * 1000, // 1 minute
} as const;

export const VALIDATION = {
  REGEX: REGEX,
  LENGTH: LENGTH,
  RATE_LIMIT: RATE_LIMITS,
  CACHE_TTL: CACHE_TTL,
};
