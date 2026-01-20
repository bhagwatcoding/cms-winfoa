// ==========================================
// 1. ENUMS (Expanded)
// ==========================================

export enum DeviceType {
  UNKNOWN = 1,
  DESKTOP = 2,
  TABLET = 3,
  MOBILE = 4,
  TV = 5, // 🆕 Smart TV apps ke liye
  BOT = 6, // 🆕 Crawlers/Scrapers detect karne ke liye
  WEARABLE = 7, // 🆕 Smart Watches
}

export const DeviceTypeLabel = {
  [DeviceType.UNKNOWN]: "Unknown",
  [DeviceType.DESKTOP]: "Desktop",
  [DeviceType.TABLET]: "Tablet",
  [DeviceType.MOBILE]: "Mobile",
  [DeviceType.TV]: "Smart TV",
  [DeviceType.BOT]: "Bot/Crawler",
  [DeviceType.WEARABLE]: "Wearable",
} as const;

export enum LoginMethod {
  PASSWORD = 1,
  GOOGLE = 2,
  GITHUB = 3,
  MAGIC_LINK = 4,
  PASSKEY = 5, // 🆕 Biometric/FaceID login
  MFA_TOTP = 6, // 🆕 Google Authenticator code
  MFA_SMS = 7, // 🆕 SMS OTP
  RECOVERY_CODE = 8, // 🆕 Emergency backup code
}

export const LoginMethodLabel = {
  [LoginMethod.PASSWORD]: "Password",
  [LoginMethod.GOOGLE]: "Google",
  [LoginMethod.GITHUB]: "GitHub",
  [LoginMethod.MAGIC_LINK]: "Magic Link",
  [LoginMethod.PASSKEY]: "Passkey (Biometric)",
  [LoginMethod.MFA_TOTP]: "Authenticator App",
  [LoginMethod.MFA_SMS]: "SMS OTP",
  [LoginMethod.RECOVERY_CODE]: "Recovery Code",
} as const;

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export const RiskLevelLabel = {
  [RiskLevel.LOW]: "Low",
  [RiskLevel.MEDIUM]: "Medium",
  [RiskLevel.HIGH]: "High",
  [RiskLevel.CRITICAL]: "Critical",
} as const;

export enum SessionStatus {
  ACTIVE = 1,
  EXPIRED = 2,
  REVOKED = 3,
  LOGGED_OUT = 4,
  LOCKED = 5, // 🆕 Suspicious activity ke karan lock
  IMPERSONATED = 6, // 🆕 Agar God Admin user ban ke dekh raha hai
}

export const SessionStatusLabel = {
  [SessionStatus.ACTIVE]: "Active",
  [SessionStatus.EXPIRED]: "Expired",
  [SessionStatus.REVOKED]: "Revoked",
  [SessionStatus.LOGGED_OUT]: "Logged Out",
  [SessionStatus.LOCKED]: "Locked (Security Risk)",
  [SessionStatus.IMPERSONATED]: "Impersonated by Admin",
} as const;

export enum ActionType {
  CREATE = 1,
  UPDATE = 2,
  SOFT_DELETE = 3,
  HARD_DELETE = 4,
  RESTORE = 5,
  LOGIN = 6,
  LOGIN_FAILED = 7, // 🆕 Wrong password tracking
  LOGOUT = 8,
  EXPORT_DATA = 9, // 🆕 Data export tracking (GDPR/Security)
  PERMISSION_CHANGE = 10, // 🆕 Role change tracking
  API_KEY_GENERATE = 11, // 🆕 Developer actions
}

export const ActionTypeLabel = {
  [ActionType.CREATE]: "Create",
  [ActionType.UPDATE]: "Update",
  [ActionType.SOFT_DELETE]: "Soft Delete",
  [ActionType.HARD_DELETE]: "Hard Delete",
  [ActionType.RESTORE]: "Restore",
  [ActionType.LOGIN]: "Login",
  [ActionType.LOGIN_FAILED]: "Login Failed",
  [ActionType.LOGOUT]: "Logout",
  [ActionType.EXPORT_DATA]: "Export Data",
  [ActionType.PERMISSION_CHANGE]: "Permission Change",
  [ActionType.API_KEY_GENERATE]: "API Key Generated",
} as const;

export enum ResourceType {
  USER = 1,
  SESSION = 2,
  ROLE = 3,
  ORDER = 4, // 🆕 E-commerce/Business logic
  SUBSCRIPTION = 5, // 🆕 Billing
  FILE = 6, // 🆕 Uploads
  SYSTEM_CONFIG = 7, // 🆕 Admin settings
}

export const ResourceTypeLabel = {
  [ResourceType.USER]: "User",
  [ResourceType.SESSION]: "Session",
  [ResourceType.ROLE]: "Role",
  [ResourceType.ORDER]: "Order",
  [ResourceType.SUBSCRIPTION]: "Subscription",
  [ResourceType.FILE]: "File",
  [ResourceType.SYSTEM_CONFIG]: "System Config",
} as const;

export const LABEL = {
  DeviceType: DeviceTypeLabel,
  LoginMethod: LoginMethodLabel,
  RiskLevel: RiskLevelLabel,
  SessionStatus: SessionStatusLabel,
  ActionType: ActionTypeLabel,
  ResourceType: ResourceTypeLabel,
};

// ==========================================
// 2. INTERFACES (Enhanced)
// ==========================================

export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// 🆕 GEO-LOCATION INFO (IP se fetch kiya hua)
// Security dashboards me map dikhane ke liye
export interface IGeoInfo {
  ip?: string;
  country?: string; // e.g., "India"
  countryCode?: string; // e.g., "IN"
  city?: string; // e.g., "Mumbai"
  region?: string; // e.g., "Maharashtra"
  timezone?: string; // e.g., "Asia/Kolkata"
  coordinates?: {
    // Map pinning ke liye
    lat: number;
    long: number;
  };
  isp?: string; // e.g., "Jio", "Airtel" (Fraud detection ke liye useful)
}

// 🆕 CLIENT METADATA (Frontend se bheja hua)
// UI/UX analysis ke liye
export interface IClientMeta {
  screenResolution?: string; // e.g., "1920x1080"
  language?: string; // e.g., "en-US", "hi-IN"
  theme?: "dark" | "light"; // User preference
  referrer?: string; // Kahan se aaya user?
}

export interface IDeviceInfo {
  browser?: string; // Chrome
  browserVersion?: string; // 120.0.0 (Old versions block karne ke liye)
  os?: string; // Windows
  osVersion?: string; // 11
  device?: string; // Pixel 7 / iPhone 14
  type: DeviceType;
  isMobile: boolean;
  isBot: boolean; // 🆕 Bot detection
  deviceId?: string; // Fingerprint hash
  clientMeta?: IClientMeta; // 🆕 Added metadata
}

export interface ISecurityInfo {
  loginMethod: LoginMethod;
  riskScore: number;
  riskLevel: RiskLevel;
  isVerified: boolean;
  failedAttempts: number;

  // 🆕 Advanced Security Flags
  isVpn?: boolean; // VPN user (High Risk?)
  isTor?: boolean; // Dark web browser
  mfaEnabled?: boolean; // Kya user ne 2FA lagaya hai?
  mfaVerified?: boolean; // Kya is session me 2FA verify hua?
  lastPasswordChange?: Date;
}

// The Clean Result returned to Frontend
export interface ISessionResult {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  status: SessionStatus;

  deviceInfo?: Partial<IDeviceInfo>;
  geoInfo?: Partial<IGeoInfo>; // 🆕 Location data show karne ke liye

  lastAccessedAt?: Date;
  createdAt?: Date;
  isCurrentSession?: boolean; // 🆕 Frontend pe "This Device" highlight karne ke liye
}
