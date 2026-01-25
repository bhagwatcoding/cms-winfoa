/**
 * SECTION 1: CORE SYSTEM ENUMS
 * Enterprise-grade enumerations with compliance and audit requirements
 */

/**
 * Device type enumeration with enterprise compliance tracking
 * Supports BYOD, corporate, and managed device classifications
 */
export enum DeviceType {
  Unknown = 1,
  Desktop = 2,
  Tablet = 3,
  Mobile = 4,
  Bot = 5,
  Server = 6,
  VirtualMachine = 7,
  Tv = 8,
  Wearable = 9,
}
export enum OSType {
  Unknown = 1,
  Windows = 2,
  MacOS = 3,
  Linux = 4,
  Android = 5,
  iOS = 6,
}
export enum BrowserType {
  Unknown = 1,
  Chrome = 2,
  Firefox = 3,
  Safari = 4,
  Edge = 5,
  Opera = 6,
  IE = 7,
}
export const OSTypeLabels: Record<OSType, string> = {
  [OSType.Unknown]: 'Unknown',
  [OSType.Windows]: 'Windows',
  [OSType.MacOS]: 'MacOS',
  [OSType.Linux]: 'Linux',
  [OSType.Android]: 'Android',
  [OSType.iOS]: 'iOS',
};
export const BrowserTypeLabels: Record<BrowserType, string> = {
  [BrowserType.Unknown]: 'Unknown',
  [BrowserType.Chrome]: 'Chrome',
  [BrowserType.Firefox]: 'Firefox',
  [BrowserType.Safari]: 'Safari',
  [BrowserType.Edge]: 'Edge',
  [BrowserType.Opera]: 'Opera',
  [BrowserType.IE]: 'IE',
};

/**
 * Enterprise authentication method enumeration
 * Compliant with NIST 800-63B and OAuth 2.1 specifications
 * Supports SSO, SAML, and modern FIDO2/WebAuthn standards
 */
export enum LoginMethod {
  Password = 1,
  Google = 2,
  Github = 3,
  MagicLink = 4,
  Passkey = 5,
  MfaTotp = 6,
  MfaSms = 7,
  RecoveryCode = 8,
  Saml = 9,
  Oidc = 10,
  SmartCard = 11,
  Biometric = 12,
  WindowsHello = 13,
  AppleSecureEnclave = 14,
}

/**
 * Enterprise risk level enumeration for threat assessment
 * Mapped to NIST Cybersecurity Framework and FAIR methodology
 * Supports automated incident response workflows
 */
export enum RiskLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
  Severe = 5,
}

/**
 * Enterprise session status enumeration with compliance tracking
 * Includes regulatory requirements for data retention and audit trails
 */
export enum SessionStatus {
  Active = 1,
  Expired = 2,
  Revoked = 3,
  LoggedOut = 4,
  Locked = 5,
  Suspended = 6,
  ComplianceHold = 7,
  Archived = 8,
}

/**
 * Enterprise user role enumeration with RBAC and ABAC support
 * Compliant with SOX, HIPAA, and GDPR access control requirements
 */
export enum UserRole {
  God = 1,
  SuperAdmin = 2,
  Admin = 3,
  Moderator = 4,
  User = 5,
  Auditor = 6,
  ComplianceOfficer = 7,
  DataController = 8,
  DataProcessor = 9,
  Guest = 10,
  ServiceAccount = 11,
  ApiUser = 12,
}

/**
 * Enterprise user account status enumeration
 * Supports automated lifecycle management and compliance workflows
 */
export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Pending = 4,
  Banned = 5,
  Archived = 6,
  ComplianceReview = 7,
  Terminated = 8,
  OnLeave = 9,
  Contractor = 10,
}

/**
 * Enterprise network protocol enumeration
 * Includes security requirements for TLS 1.3 and mTLS support
 */
export enum ProtocolType {
  HTTP = 0,
  HTTPS = 1,
  HTTPS_TLS13 = 2,
  HTTPS_MTLS = 3,
  HTTPS_HSTS = 4,
}

/**
 * SECTION 3: ENTERPRISE HUMAN-READABLE LABELS
 * Localized and compliant with WCAG 2.1 accessibility standards
 */
import { getLabelFromEnum, getEnumValues } from '@/core/helpers/enum.helper';

export const DeviceTypeLabels = {
  [DeviceType.Unknown]: 'Unknown',
  [DeviceType.Desktop]: 'Desktop',
  [DeviceType.Tablet]: 'Tablet',
  [DeviceType.Mobile]: 'Mobile',
  [DeviceType.Bot]: 'Bot',
  [DeviceType.Server]: 'Server',
  [DeviceType.VirtualMachine]: 'Virtual Machine',
  [DeviceType.Tv]: 'TV',
  [DeviceType.Wearable]: 'Wearable',
} as const;

export type DeviceTypeLabel = keyof typeof DeviceTypeLabels;
export type DeviceTypeLabelValue = (typeof DeviceTypeLabels)[DeviceTypeLabel];
export const getDeviceTypeLabel = (deviceType: DeviceType): string =>
  getLabelFromEnum(DeviceTypeLabels, deviceType);
export const isValidDeviceType = (deviceType: number): deviceType is DeviceType =>
  getEnumValues(DeviceTypeLabels).includes(deviceType as DeviceType);

/**
 * Enterprise user role labels with compliance descriptors
 * Used in audit trails, SOX reporting, and access reviews
 */
export const UserRoleLabels = {
  [UserRole.God]: 'System Owner (Unrestricted)',
  [UserRole.SuperAdmin]: 'Organization Administrator',
  [UserRole.Admin]: 'Department Administrator',
  [UserRole.Moderator]: 'Content Moderator',
  [UserRole.User]: 'Standard User',
  [UserRole.Auditor]: 'Compliance Auditor (Read-Only)',
  [UserRole.ComplianceOfficer]: 'Data Protection Officer',
  [UserRole.DataController]: 'Data Controller (GDPR)',
  [UserRole.DataProcessor]: 'Data Processor (GDPR)',
  [UserRole.Guest]: 'Guest User (Limited Access)',
  [UserRole.ServiceAccount]: 'Service Account (Non-Human)',
  [UserRole.ApiUser]: 'API Integration User',
} as const;

export type UserRoleLabel = keyof typeof UserRoleLabels;
export type UserRoleLabelValue = (typeof UserRoleLabels)[UserRoleLabel];
export const getUserRoleLabel = (userRole: UserRole): string =>
  getLabelFromEnum(UserRoleLabels, userRole);
export const isValidUserRole = (userRole: number): userRole is UserRole =>
  getEnumValues(UserRoleLabels).includes(userRole as UserRole);

/**
 * Enterprise user status labels with regulatory context
 * Supports automated compliance reporting and user lifecycle management
 */
export const UserStatusLabels = {
  [UserStatus.Active]: 'Active', //- Fully Authorized
  [UserStatus.Inactive]: 'Inactive', //- Access Restricted
  [UserStatus.Suspended]: 'Suspended', //- Under Investigation
  [UserStatus.Pending]: 'Pending', //- Verification Required
  [UserStatus.Banned]: 'Banned', //- Security Violation
  [UserStatus.Archived]: 'Archived', //- Historical Record
  [UserStatus.ComplianceReview]: 'Compliance Review', //- Under Compliance Review
  [UserStatus.Terminated]: 'Terminated', //- Employment Terminated
  [UserStatus.OnLeave]: 'On Leave', //- Extended Leave of Absence
  [UserStatus.Contractor]: 'External Contractor', //- External Contractor
} as const;

export type UserStatusLabel = keyof typeof UserStatusLabels;
export type UserStatusLabelValue = (typeof UserStatusLabels)[UserStatusLabel];
export const getUserStatusLabel = (userStatus: UserStatus): string =>
  getLabelFromEnum(UserStatusLabels, userStatus);
export const isValidUserStatus = (userStatus: number): userStatus is UserStatus =>
  getEnumValues(UserStatusLabels).includes(userStatus as UserStatus);

/**
 * Enterprise session status labels with security context
 * Used in SIEM integration and security incident response
 */
export const SessionStatusLabels = {
  [SessionStatus.Active]: 'Active', //- Valid Session
  [SessionStatus.Expired]: 'Expired', //- Timeout
  [SessionStatus.Revoked]: 'Revoked', //- Security Action
  [SessionStatus.LoggedOut]: 'Logged Out', //- User Initiated
  [SessionStatus.Locked]: 'Locked', //- Failed Attempts
  [SessionStatus.Suspended]: 'Suspended', //- Admin Action
  [SessionStatus.ComplianceHold]: 'Compliance Hold', //- Audit Required
  [SessionStatus.Archived]: 'Archived', //- Compliance Retention
} as const;

export type SessionStatusLabel = keyof typeof SessionStatusLabels;
export type SessionStatusLabelValue = (typeof SessionStatusLabels)[SessionStatusLabel];
export const getSessionStatusLabel = (sessionStatus: SessionStatus): string =>
  getLabelFromEnum(SessionStatusLabels, sessionStatus);
export const isValidSessionStatus = (sessionStatus: number): sessionStatus is SessionStatus =>
  getEnumValues(SessionStatusLabels).includes(sessionStatus as SessionStatus);

/**
 * Enterprise authentication method labels with security level indicators
 * Compliant with NIST 800-63B authenticator assurance levels (AAL)
 */
export const LoginMethodLabels = {
  [LoginMethod.Password]: 'Password', //- (AAL1)
  [LoginMethod.Google]: 'Google OAuth 2.0',
  [LoginMethod.Github]: 'GitHub OAuth',
  [LoginMethod.MagicLink]: 'Magic Link', //- (AAL2)
  [LoginMethod.Passkey]: 'FIDO2 Passkey', //- (AAL3)
  [LoginMethod.MfaTotp]: 'TOTP Authenticator', //- (AAL2)",
  [LoginMethod.MfaSms]: 'SMS Verification', //- (AAL2)",
  [LoginMethod.RecoveryCode]: 'Backup Recovery Code', //- (AAL2)",
  [LoginMethod.Saml]: 'SAML 2.0 SSO',
  [LoginMethod.Oidc]: 'OpenID Connect',
  [LoginMethod.SmartCard]: 'PIV/CAC Smart Card', //- (AAL3)",
  [LoginMethod.Biometric]: 'Biometric Authentication', //- (AAL3)",
  [LoginMethod.WindowsHello]: 'Windows Hello for Business',
  [LoginMethod.AppleSecureEnclave]: 'Apple Secure Enclave',
} as const;

export type LoginMethodLabel = keyof typeof LoginMethodLabels;
export type LoginMethodLabelValue = (typeof LoginMethodLabels)[LoginMethodLabel];
export const getLoginMethodLabel = (loginMethod: LoginMethod): string =>
  getLabelFromEnum(LoginMethodLabels, loginMethod);
export const isValidLoginMethod = (loginMethod: number): loginMethod is LoginMethod =>
  getEnumValues(LoginMethodLabels).includes(loginMethod as LoginMethod);

/**
 * Enterprise risk level labels with business impact context
 * Mapped to CVSS v3.1 and FAIR risk methodology
 */
export const RiskLevelLabels = {
  [RiskLevel.Low]: 'Low', //- Minor Impact
  [RiskLevel.Medium]: 'Medium', //- Moderate Impact
  [RiskLevel.High]: 'High', //- Significant Impact
  [RiskLevel.Critical]: 'Critical', //- Severe Business Impact
  [RiskLevel.Severe]: 'Severe', //- Catastrophic Impact
} as const;

export type RiskLevelLabel = keyof typeof RiskLevelLabels;
export type RiskLevelLabelValue = (typeof RiskLevelLabels)[RiskLevelLabel];
export const getRiskLevelLabel = (riskLevel: RiskLevel): string =>
  getLabelFromEnum(RiskLevelLabels, riskLevel);
export const isValidRiskLevel = (riskLevel: number): riskLevel is RiskLevel =>
  getEnumValues(RiskLevelLabels).includes(riskLevel as RiskLevel);

export const ProtocolTypeLabels = {
  [ProtocolType.HTTP]: 'HTTP', //- HTTP
  [ProtocolType.HTTPS]: 'HTTPS', //- HTTPS
  [ProtocolType.HTTPS_TLS13]: 'HTTPS (TLS 1.3)', //- HTTPS (TLS 1.3)
  [ProtocolType.HTTPS_MTLS]: 'HTTPS (mTLS)', //- HTTPS (mTLS)
  [ProtocolType.HTTPS_HSTS]: 'HTTPS (HSTS)', //- HTTPS (HSTS)
} as const;

export type ProtocolTypeLabel = keyof typeof ProtocolTypeLabels;
export type ProtocolTypeLabelValue = (typeof ProtocolTypeLabels)[ProtocolTypeLabel];
export const getProtocolTypeLabel = (protocolType: ProtocolType): string =>
  getLabelFromEnum(ProtocolTypeLabels, protocolType);
export const isValidProtocolType = (protocolType: number): protocolType is ProtocolType =>
  getEnumValues(ProtocolTypeLabels).includes(protocolType as ProtocolType);
