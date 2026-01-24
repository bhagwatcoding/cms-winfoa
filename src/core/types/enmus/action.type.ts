// =============================================================================
// SECTION 2: SYSTEM ACTION ENUMS - Audit & Activity Tracking
// =============================================================================
/**
 * ENTERPRISE-GRADE ACTION TYPES (MASTER COLLECTION)
 * * Numeric mapping for high-performance indexing.
 * Categorized by domain for granular audit trailing and telemetry.
 */
export enum ActionType {
  // ==========================================
  // 1. DATA OPERATIONS (CRUD) - [1-10]
  // ==========================================
  Create = 1, // CRITICAL: Resource Created
  Update = 2, // CRITICAL: Resource Updated
  SoftDelete = 3, // CRITICAL: Soft Delete
  HardDelete = 4, // CRITICAL: Permanent Deletion
  Restore = 5, // CRITICAL: Restore from Trash
  BulkCreate = 6, // CRITICAL: Bulk Creation
  BulkUpdate = 7, // CRITICAL: Bulk Update
  BulkDelete = 8, // CRITICAL: Bulk Deletion
  ExportData = 9, // CRITICAL: Data Export
  ImportData = 10, // CRITICAL: Data Import

  // ==========================================
  // 2. AUTHENTICATION & ACCESS - [11-30]
  // ==========================================
  Login = 11,
  LoginFailed = 12,
  Logout = 13,
  MfaEnable = 14,
  MfaDisable = 15, // CRITICAL: High Risk
  PasswordChange = 16,
  PasswordResetRequest = 17,
  AccountLock = 18,
  AccountUnlock = 19,
  SessionRevoke = 20,
  DeviceAuthorized = 21,
  PasskeyRegistered = 22,
  SocialLink = 23,
  SocialUnlink = 24,
  EmailVerify = 25,

  // ==========================================
  // 3. RBAC & PERMISSIONS - [31-45]
  // ==========================================
  PermissionChange = 31,
  RoleAssign = 32,
  RoleRevoke = 33,
  ApiKeyGenerate = 34,
  ApiKeyRevoke = 35,
  OwnerTransfer = 36,
  AccessRequest = 37,
  AccessApproved = 38,
  AccessDenied = 39,

  // ==========================================
  // 4. ORGANIZATION & USER MGMT - [46-60]
  // ==========================================
  UserInvite = 46,
  UserJoin = 47,
  UserSuspend = 48,
  UserActivate = 49,
  OrgCreate = 50,
  OrgUpdate = 51,
  TeamCreate = 52,
  TeamDelete = 53,
  ProfileUpdate = 54,

  // ==========================================
  // 5. SYSTEM & INFRASTRUCTURE - [61-75]
  // ==========================================
  SystemConfigUpdate = 61,
  SystemConfigReset = 62,
  MaintenanceModeEnable = 63,
  MaintenanceModeDisable = 64,
  WebhookCreate = 65,
  WebhookDelete = 66,
  DomainMapped = 67,
  SslUpdate = 68,
  FirewallRuleChange = 69,

  // ==========================================
  // 6. FILE & ASSETS - [76-85]
  // ==========================================
  FileUpload = 76,
  FileDelete = 77,
  FileDownload = 78, // CRITICAL: For Data Leak Prevention
  FileShare = 79,
  FilePreview = 80,
  FileMove = 81,
  FileCopy = 82,

  // ==========================================
  // 7. FINANCIAL & WALLET - [86-100]
  // ==========================================
  TransactionSuccess = 86,
  TransactionFailed = 87,
  RefundProcess = 88,
  WalletCredit = 89,
  WalletDebit = 90,
  SubscriptionUpgrade = 91,
  SubscriptionCancel = 92,
  BillingInfoUpdate = 93,
  PayoutRequest = 94,

  // ==========================================
  // 8. COMPLIANCE & ADMIN - [101-120]
  // ==========================================
  DataArchive = 101,
  DataPurge = 102,
  PrivacyPolicyAccept = 103,
  PersonalDataRequest = 104, // GDPR/CCPA
  ImpersonationStart = 108, // High Audit Priority
  ImpersonationStop = 109,
  IntegrationLinked = 111,
  IntegrationUnlinked = 112,
  AuditLogExport = 113,
}

/**
 * Severity level for each action type.
 * Useful for filtering, alerting, and dashboard color coding.
 */
export enum ActionSeverity {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

/**
 * Metadata attached to each action type.
 * Keeps label, severity, and description together for single source of truth.
 */
export interface ActionMeta {
  label: string;
  severity: ActionSeverity;
  description?: string;
}

/**
 * Canonical metadata map for every ActionType.
 * Single source of truth for labels, severity, and optional descriptions.
 */
export const ACTION_META: Record<ActionType, ActionMeta> = {
  [ActionType.Create]: {
    severity: ActionSeverity.Critical,
    label: "Resource Created",
    description: "A new resource was created.",
  },
  [ActionType.Update]: {
    severity: ActionSeverity.Critical,
    label: "Resource Updated",
    description: "An existing resource was modified.",
  },
  [ActionType.SoftDelete]: {
    severity: ActionSeverity.Critical,
    label: "Moved to Trash",
    description: "Resource soft deleted and moved to trash.",
  },
  [ActionType.HardDelete]: {
    severity: ActionSeverity.Critical,
    label: "Permanently Deleted",
    description: "Resource permanently deleted from the system.",
  },
  [ActionType.Restore]: {
    severity: ActionSeverity.Critical,
    label: "Restored from Trash",
    description: "Resource restored from trash to active state.",
  },
  [ActionType.BulkCreate]: {
    severity: ActionSeverity.Critical,
    label: "Bulk Creation Performed",
    description: "Multiple resources created in a single operation.",
  },
  [ActionType.BulkUpdate]: {
    severity: ActionSeverity.Critical,
    label: "Bulk Update Performed",
    description: "Multiple resources updated in a single operation.",
  },
  [ActionType.BulkDelete]: {
    severity: ActionSeverity.Critical,
    label: "Bulk Deletion Performed",
    description: "Multiple resources deleted in a single operation.",
  },
  [ActionType.ExportData]: {
    severity: ActionSeverity.High,
    label: "Data Export Initiated",
    description: "Data export job started by user.",
  },
  [ActionType.ImportData]: {
    severity: ActionSeverity.High,
    label: "Data Import Performed",
    description: "Data import job completed.",
  },
  [ActionType.PermissionChange]: {
    severity: ActionSeverity.Critical,
    label: "Permission Change",
    description: "User or role permissions updated.",
  },
  [ActionType.ApiKeyGenerate]: {
    severity: ActionSeverity.High,
    label: "API Key Generated",
    description: "New API key created for authentication.",
  },
  [ActionType.Login]: {
    severity: ActionSeverity.Medium,
    label: "Logged In Successfully",
    description: "User authentication succeeded.",
  },
  [ActionType.LoginFailed]: {
    severity: ActionSeverity.High,
    label: "Login Attempt Failed",
    description: "User authentication failed.",
  },
  [ActionType.Logout]: {
    severity: ActionSeverity.Low,
    label: "Logged Out Successfully",
    description: "User session terminated.",
  },
  [ActionType.MfaEnable]: {
    severity: ActionSeverity.Medium,
    label: "MFA Enabled",
    description: "Multi-factor authentication enabled for account.",
  },
  [ActionType.MfaDisable]: {
    severity: ActionSeverity.Critical,
    label: "MFA Disabled",
    description: "Multi-factor authentication disabled for account.",
  },
  [ActionType.PasswordChange]: {
    severity: ActionSeverity.High,
    label: "Password Changed",
    description: "User password changed.",
  },
  [ActionType.PasswordResetRequest]: {
    severity: ActionSeverity.Medium,
    label: "Password Reset Requested",
    description: "User requested password reset.",
  },
  [ActionType.AccountLock]: {
    severity: ActionSeverity.High,
    label: "Account Locked for Security",
    description: "Account temporarily locked due to security policy.",
  },
  [ActionType.AccountUnlock]: {
    severity: ActionSeverity.Medium,
    label: "Account Unlocked",
    description: "Account unlocked by admin or automated policy.",
  },
  [ActionType.SessionRevoke]: {
    severity: ActionSeverity.High,
    label: "Session Remotely Terminated",
    description: "Active session revoked by admin or user.",
  },
  [ActionType.DeviceAuthorized]: {
    severity: ActionSeverity.Medium,
    label: "New Device Authorized",
    description: "New device granted access to account.",
  },
  [ActionType.PasskeyRegistered]: {
    severity: ActionSeverity.Medium,
    label: "Passkey Added",
    description: "Passkey registered for password-less login.",
  },
  [ActionType.SocialLink]: {
    severity: ActionSeverity.Medium,
    label: "Social Account Linked",
    description: "Social provider linked to account.",
  },
  [ActionType.SocialUnlink]: {
    severity: ActionSeverity.Medium,
    label: "Social Account Unlinked",
    description: "Social provider unlinked from account.",
  },
  [ActionType.EmailVerify]: {
    severity: ActionSeverity.Low,
    label: "Email Address Verified",
    description: "User email address verified.",
  },
  [ActionType.RoleAssign]: {
    severity: ActionSeverity.High,
    label: "Role Assigned to User",
    description: "Role granted to user.",
  },
  [ActionType.RoleRevoke]: {
    severity: ActionSeverity.High,
    label: "Role Revoked from User",
    description: "Role removed from user.",
  },
  [ActionType.ApiKeyRevoke]: {
    severity: ActionSeverity.High,
    label: "API Key Revoked",
    description: "API key revoked and invalidated.",
  },
  [ActionType.OwnerTransfer]: {
    severity: ActionSeverity.Critical,
    label: "Ownership Transferred",
    description: "Resource ownership transferred to another user.",
  },
  [ActionType.AccessRequest]: {
    severity: ActionSeverity.Medium,
    label: "Access Request Submitted",
    description: "User requested access to protected resource.",
  },
  [ActionType.AccessApproved]: {
    severity: ActionSeverity.Medium,
    label: "Access Request Approved",
    description: "Access request approved by resource owner or admin.",
  },
  [ActionType.AccessDenied]: {
    severity: ActionSeverity.Medium,
    label: "Access Request Denied",
    description: "Access request denied by resource owner or admin.",
  },
  [ActionType.UserInvite]: {
    severity: ActionSeverity.Medium,
    label: "New User Invited",
    description: "Invitation sent to new user to join organization.",
  },
  [ActionType.UserJoin]: {
    severity: ActionSeverity.Medium,
    label: "User Joined via Invitation",
    description: "User accepted invitation and joined organization.",
  },
  [ActionType.UserSuspend]: {
    severity: ActionSeverity.High,
    label: "User Account Suspended",
    description: "User account suspended by admin.",
  },
  [ActionType.UserActivate]: {
    severity: ActionSeverity.Medium,
    label: "User Account Activated",
    description: "User account activated by admin.",
  },
  [ActionType.OrgCreate]: {
    severity: ActionSeverity.Medium,
    label: "Organization Created",
    description: "New organization created.",
  },
  [ActionType.OrgUpdate]: {
    severity: ActionSeverity.Medium,
    label: "Organization Settings Updated",
    description: "Organization settings modified.",
  },
  [ActionType.TeamCreate]: {
    severity: ActionSeverity.Medium,
    label: "Team Created",
    description: "New team created within organization.",
  },
  [ActionType.TeamDelete]: {
    severity: ActionSeverity.Medium,
    label: "Team Deleted",
    description: "Team deleted from organization.",
  },
  [ActionType.ProfileUpdate]: {
    severity: ActionSeverity.Low,
    label: "User Profile Updated",
    description: "User profile information updated.",
  },
  [ActionType.SystemConfigUpdate]: {
    severity: ActionSeverity.High,
    label: "System Configuration Changed",
    description: "System-wide configuration updated.",
  },
  [ActionType.SystemConfigReset]: {
    severity: ActionSeverity.High,
    label: "System Config Reset to Default",
    description: "System configuration reset to factory defaults.",
  },
  [ActionType.MaintenanceModeEnable]: {
    severity: ActionSeverity.High,
    label: "Maintenance Mode Activated",
    description: "System entered maintenance mode.",
  },
  [ActionType.MaintenanceModeDisable]: {
    severity: ActionSeverity.High,
    label: "Maintenance Mode Deactivated",
    description: "System exited maintenance mode.",
  },
  [ActionType.WebhookCreate]: {
    severity: ActionSeverity.Medium,
    label: "Incoming Webhook Created",
    description: "Webhook endpoint registered.",
  },
  [ActionType.WebhookDelete]: {
    severity: ActionSeverity.Medium,
    label: "Webhook Deleted",
    description: "Webhook endpoint removed.",
  },
  [ActionType.DomainMapped]: {
    severity: ActionSeverity.Medium,
    label: "Custom Domain Linked",
    description: "Custom domain mapped to organization.",
  },
  [ActionType.SslUpdate]: {
    severity: ActionSeverity.High,
    label: "SSL Certificate Updated",
    description: "SSL/TLS certificate renewed or replaced.",
  },
  [ActionType.FirewallRuleChange]: {
    severity: ActionSeverity.High,
    label: "Firewall Rules Modified",
    description: "Firewall rules updated.",
  },
  [ActionType.FileUpload]: {
    severity: ActionSeverity.Low,
    label: "File Uploaded to Server",
    description: "File uploaded to system storage.",
  },
  [ActionType.FileDelete]: {
    severity: ActionSeverity.Medium,
    label: "File Deleted from Server",
    description: "File removed from system storage.",
  },
  [ActionType.FileDownload]: {
    severity: ActionSeverity.High,
    label: "Sensitive File Downloaded",
    description: "File downloaded by user.",
  },
  [ActionType.FileShare]: {
    severity: ActionSeverity.High,
    label: "File Sharing Access Changed",
    description: "File sharing permissions updated.",
  },
  [ActionType.FilePreview]: {
    severity: ActionSeverity.Low,
    label: "File Previewed",
    description: "File preview accessed by user.",
  },
  [ActionType.FileMove]: {
    severity: ActionSeverity.Medium,
    label: "File Moved",
    description: "File moved within storage.",
  },
  [ActionType.FileCopy]: {
    severity: ActionSeverity.Medium,
    label: "File Copied",
    description: "File copied within storage.",
  },
  [ActionType.TransactionSuccess]: {
    severity: ActionSeverity.Critical,
    label: "Payment Completed Successfully",
    description: "Payment transaction succeeded.",
  },
  [ActionType.TransactionFailed]: {
    severity: ActionSeverity.High,
    label: "Payment Attempt Failed",
    description: "Payment transaction failed.",
  },
  [ActionType.RefundProcess]: {
    severity: ActionSeverity.High,
    label: "Refund Processed",
    description: "Refund issued to customer.",
  },
  [ActionType.WalletCredit]: {
    severity: ActionSeverity.High,
    label: "Credits Added to Wallet",
    description: "Wallet balance increased.",
  },
  [ActionType.WalletDebit]: {
    severity: ActionSeverity.High,
    label: "Amount Debited from Wallet",
    description: "Wallet balance decreased.",
  },
  [ActionType.SubscriptionUpgrade]: {
    severity: ActionSeverity.Medium,
    label: "Plan Upgraded",
    description: "Subscription plan upgraded.",
  },
  [ActionType.SubscriptionCancel]: {
    severity: ActionSeverity.Medium,
    label: "Subscription Cancelled",
    description: "Subscription plan cancelled.",
  },
  [ActionType.BillingInfoUpdate]: {
    severity: ActionSeverity.High,
    label: "Billing Information Updated",
    description: "Billing details updated by user.",
  },
  [ActionType.PayoutRequest]: {
    severity: ActionSeverity.High,
    label: "Payout Requested",
    description: "Payout requested by vendor or partner.",
  },
  [ActionType.DataArchive]: {
    severity: ActionSeverity.Medium,
    label: "Data Moved to Archive",
    description: "Data archived for long-term storage.",
  },
  [ActionType.DataPurge]: {
    severity: ActionSeverity.Critical,
    label: "Data Purged (GDPR Compliance)",
    description: "Data permanently purged per compliance request.",
  },
  [ActionType.PrivacyPolicyAccept]: {
    severity: ActionSeverity.Low,
    label: "Privacy Policy Accepted",
    description: "User accepted privacy policy.",
  },
  [ActionType.PersonalDataRequest]: {
    severity: ActionSeverity.Medium,
    label: "Personal Data Copy Requested",
    description: "User requested copy of personal data.",
  },
  [ActionType.ImpersonationStart]: {
    severity: ActionSeverity.Critical,
    label: "Admin Impersonation Started",
    description: "Admin started impersonating user.",
  },
  [ActionType.ImpersonationStop]: {
    severity: ActionSeverity.Critical,
    label: "Admin Impersonation Ended",
    description: "Admin stopped impersonating user.",
  },
  [ActionType.IntegrationLinked]: {
    severity: ActionSeverity.Medium,
    label: "Third-party App Connected",
    description: "Third-party integration connected.",
  },
  [ActionType.IntegrationUnlinked]: {
    severity: ActionSeverity.Medium,
    label: "Third-party App Disconnected",
    description: "Third-party integration disconnected.",
  },
  [ActionType.AuditLogExport]: {
    severity: ActionSeverity.High,
    label: "Audit Logs Exported",
    description: "Audit logs exported by admin.",
  },
} as const;

/**
 * Convenience helper to get label for an ActionType.
 * @example getActionLabel(ActionType.Login) // "Logged In Successfully"
 */
export const getActionLabel = (type: ActionType): string => ACTION_META[type].label;

/**
 * Convenience helper to get severity for an ActionType.
 * @example getActionSeverity(ActionType.Login) // ActionSeverity.Medium
 */
export const getActionSeverity = (type: ActionType): ActionSeverity => ACTION_META[type].severity;

/**
 * Filter ActionType[] by severity.
 * @example getActionsBySeverity(ActionSeverity.Critical) // [ActionType.Create, ActionType.Update, ...]
 */
export const getActionsBySeverity = (severity: ActionSeverity): ActionType[] =>
  (Object.keys(ACTION_META) as unknown as ActionType[]).filter(
    (t) => ACTION_META[t].severity === severity,
  );

/**
 * Type guard to check if a number is a valid ActionType.
 */
export const isValidActionType = (value: number): value is ActionType => value in ACTION_META;

/**
 * UI LABELS FOR AUDIT LOGS (Legacy)
 * Kept for backward compatibility; prefer ACTION_META directly.
 */

export const ActionTypeLabel = Object.fromEntries((Object.keys(ACTION_META) as unknown as ActionType[]).map((t) => [t, ACTION_META[t].label]));

/**
 * Action type labels for audit logs (Legacy)
 * Kept for backward compatibility; prefer ActionMeta["label"].
 */
export type ActionTypeLabel = (typeof ActionTypeLabel)[keyof typeof ActionTypeLabel];
