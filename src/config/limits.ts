export const UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ALLOWED_DOC_TYPES: ["application/pdf", "application/msword"],
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    OPTIONS: [10, 25, 50, 100],
} as const;

export const RATE_LIMIT = {
    API: {
        REQUESTS: 100,
        WINDOW_MS: 60 * 1000, // 1 minute
    },
    AUTH: {
        REQUESTS: 10,
        WINDOW_MS: 60 * 1000, // 1 minute
    }
} as const;