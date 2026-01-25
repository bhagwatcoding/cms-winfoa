/**
 * Audit & Activity Enums
 * Numeric values for efficient DB storage
 */

export enum ResourceType {
  System = 1,
  User = 2,
  Role = 3,
  Permission = 4,
  Session = 5,
  ApiKey = 6,
  Webhook = 7,
  Billing = 8,
  Content = 9,
}

export const ResourceTypeLabel: Record<number, string> = {
  [ResourceType.System]: 'System',
  [ResourceType.User]: 'User',
  [ResourceType.Role]: 'Role',
  [ResourceType.Permission]: 'Permission',
  [ResourceType.Session]: 'Session',
  [ResourceType.ApiKey]: 'API Key',
  [ResourceType.Webhook]: 'Webhook',
  [ResourceType.Billing]: 'Billing',
  [ResourceType.Content]: 'Content',
};

export enum AuditSeverity {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Critical = 4,
}

export const AuditSeverityLabel: Record<AuditSeverity, string> = {
  [AuditSeverity.Debug]: 'Debug',
  [AuditSeverity.Info]: 'Info',
  [AuditSeverity.Warning]: 'Warning',
  [AuditSeverity.Error]: 'Error',
  [AuditSeverity.Critical]: 'Critical',
};

export enum AuditCategory {
  Auth = 1,
  User = 2,
  Role = 3,
  Permission = 4,
  Session = 5,
  Api = 6,
  System = 7,
  Data = 8,
  Security = 9,
  Billing = 10,
}

export const AuditCategoryLabel: Record<AuditCategory, string> = {
  [AuditCategory.Auth]: 'Authentication',
  [AuditCategory.User]: 'User Management',
  [AuditCategory.Role]: 'Role Management',
  [AuditCategory.Permission]: 'Permissions',
  [AuditCategory.Session]: 'Session',
  [AuditCategory.Api]: 'API',
  [AuditCategory.System]: 'System',
  [AuditCategory.Data]: 'Data',
  [AuditCategory.Security]: 'Security',
  [AuditCategory.Billing]: 'Billing',
};
