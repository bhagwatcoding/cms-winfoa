/**
 * Enterprise session status enumeration for comprehensive session lifecycle management
 */
export enum EnterpriseSessionStatus {
  Active = 1,
  Expired = 2,
  Revoked = 3,
  LoggedOut = 4,
  Locked = 5,
  Impersonated = 6,
  Suspended = 7,
  PendingApproval = 8,
  MfaRequired = 9,
  AdminOverride = 10,
}