export enum DeviceType {
  UNKNOWN = 1,
  DESKTOP = 2,
  TABLET = 3,
  MOBILE = 4,
}

export enum LoginMethod {
  PASSWORD = 1,
  GOOGLE = 2,
  GITHUB = 3,
  MAGIC_LINK = 4,
}

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export enum SessionStatus {
  ACTIVE = 1,
  EXPIRED = 2,
  REVOKED = 3,
  LOGGED_OUT = 4,
}

export const LABEL = {
  DeviceType: {
    [DeviceType.UNKNOWN]: "Unknown",
    [DeviceType.DESKTOP]: "Desktop",
    [DeviceType.TABLET]: "Tablet",
    [DeviceType.MOBILE]: "Mobile",
  } as const,
  LoginMethod: {
    [LoginMethod.PASSWORD]: "Password",
    [LoginMethod.GOOGLE]: "Google",
    [LoginMethod.GITHUB]: "GitHub",
    [LoginMethod.MAGIC_LINK]: "Magic Link",
  } as const,
  RiskLevel: {
    [RiskLevel.LOW]: "Low",
    [RiskLevel.MEDIUM]: "Medium",
    [RiskLevel.HIGH]: "High",
    [RiskLevel.CRITICAL]: "Critical",
  } as const,
  SessionStatus: {
    [SessionStatus.ACTIVE]: "Active",
    [SessionStatus.EXPIRED]: "Expired",
    [SessionStatus.REVOKED]: "Revoked",
    [SessionStatus.LOGGED_OUT]: "Logged Out",
  } as const,
};

// --- Interfaces ---
export interface IDeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  type: DeviceType;
  isMobile: boolean;
  deviceId?: string;
}

export interface ISecurityInfo {
  loginMethod: LoginMethod;
  riskScore: number;
  riskLevel: RiskLevel;
  isVerified: boolean;
  failedAttempts: number; // ✅ Ye schema me bhi hona chahiye
}

// The Clean Result returned to Frontend/Actions
export interface ISessionResult {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  deviceInfo?: Partial<IDeviceInfo>;
  lastAccessedAt?: Date;
}
