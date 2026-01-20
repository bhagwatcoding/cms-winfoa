import { env } from "./env";

export const DB = {
    URI: env.MONGODB_URI,
    NAME: env.MONGODB_NAME || "winfoa", // Main Database Name

    // Connection Options (Mongoose)
    OPTIONS: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
    },

    // Collection Names (Single Source of Truth)
    // These align with actual Mongoose models in src/shared/lib/db/models
    COLLECTIONS: {
        USERS: "users",
        SESSIONS: "sessions",
        ROLES: "roles",
        // wallet
        TRANSACTIONS: "transactions",
        // academy
        COURSES: "courses",
        STUDENTS: "students",
        CERTIFICATES: "certificates",
        RESULTS: "results",
        // admin
        AUDIT_LOGS: "audit_logs",
    },

    // Session Model Field Mapping
    // Important: Session model uses these field names:
    SESSION_FIELDS: {
        TOKEN: "token",           // NOT sessionToken
        EXPIRES_AT: "expiresAt",  // NOT expires
        USER_ID: "userId",
        IS_ACTIVE: "isActive",
        LAST_ACCESSED: "lastAccessedAt",
    }
} as const;