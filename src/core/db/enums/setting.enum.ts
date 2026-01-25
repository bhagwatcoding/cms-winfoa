/**
 * System Setting Enums
 * Numeric values for efficient DB storage
 */

export const enum SettingType {
  STRING = 1,
  NUMBER = 2,
  BOOLEAN = 3,
  JSON = 4,
  ARRAY = 5,
  DATE = 6,
}

export const SettingTypeLabel: Record<SettingType, string> = {
  [SettingType.STRING]: 'String',
  [SettingType.NUMBER]: 'Number',
  [SettingType.BOOLEAN]: 'Boolean',
  [SettingType.JSON]: 'JSON',
  [SettingType.ARRAY]: 'Array',
  [SettingType.DATE]: 'Date',
};

export const enum SettingCategory {
  GENERAL = 1,
  SECURITY = 2,
  EMAIL = 3,
  NOTIFICATION = 4,
  API = 5,
  APPEARANCE = 6,
  INTEGRATIONS = 7,
  BILLING = 8,
}

export const SettingCategoryLabel: Record<SettingCategory, string> = {
  [SettingCategory.GENERAL]: 'General',
  [SettingCategory.SECURITY]: 'Security',
  [SettingCategory.EMAIL]: 'Email',
  [SettingCategory.NOTIFICATION]: 'Notification',
  [SettingCategory.API]: 'API',
  [SettingCategory.APPEARANCE]: 'Appearance',
  [SettingCategory.INTEGRATIONS]: 'Integrations',
  [SettingCategory.BILLING]: 'Billing',
};

export const enum RateLimitType {
  IP = 1,
  USER = 2,
  API_KEY = 3,
  GLOBAL = 4,
  ENDPOINT = 5,
}

export const RateLimitTypeLabel: Record<RateLimitType, string> = {
  [RateLimitType.IP]: 'IP Address',
  [RateLimitType.USER]: 'User',
  [RateLimitType.API_KEY]: 'API Key',
  [RateLimitType.GLOBAL]: 'Global',
  [RateLimitType.ENDPOINT]: 'Endpoint',
};
