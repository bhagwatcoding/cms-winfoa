/**
 * Global Enums definitions
 * Using numeric enums for database optimization
 */

// ==========================================
// SESSION & AUTH ENUMS
// ==========================================

export enum LoginMethod {
    PASSWORD = 0,
    OAUTH = 1,
    MAGIC_LINK = 2,
    OTP = 3
}

export enum DeviceType {
    DESKTOP = 0,
    MOBILE = 1,
    TABLET = 2,
    UNKNOWN = 3
}

export enum RiskLevel {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    CRITICAL = 3
}

export enum SessionStatus {
    ACTIVE = 1,
    EXPIRED = 2,
    REVOKED = 3,
    INACTIVE = 4
}
