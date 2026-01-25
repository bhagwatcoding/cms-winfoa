/**
 * Auth & Login Enums
 * Numeric values for efficient DB storage
 */

export enum LoginAttemptResult {
  SUCCESS = 1,
  FAILED_PASSWORD = 2,
  FAILED_2FA = 3,
  ACCOUNT_LOCKED = 4,
  ACCOUNT_INACTIVE = 5,
  USER_NOT_FOUND = 6,
  RATE_LIMITED = 7,
  BLOCKED_IP = 8,
  SUSPICIOUS = 9,
}

export const LoginAttemptResultLabel: Record<LoginAttemptResult, string> = {
  [LoginAttemptResult.SUCCESS]: 'Success',
  [LoginAttemptResult.FAILED_PASSWORD]: 'Failed Password',
  [LoginAttemptResult.FAILED_2FA]: 'Failed 2FA',
  [LoginAttemptResult.ACCOUNT_LOCKED]: 'Account Locked',
  [LoginAttemptResult.ACCOUNT_INACTIVE]: 'Account Inactive',
  [LoginAttemptResult.USER_NOT_FOUND]: 'User Not Found',
  [LoginAttemptResult.RATE_LIMITED]: 'Rate Limited',
  [LoginAttemptResult.BLOCKED_IP]: 'Blocked IP',
  [LoginAttemptResult.SUSPICIOUS]: 'Suspicious',
};

export enum OAuthProvider {
  GOOGLE = 1,
  GITHUB = 2,
  MICROSOFT = 3,
  APPLE = 4,
}

export const OAuthProviderLabel: Record<OAuthProvider, string> = {
  [OAuthProvider.GOOGLE]: 'Google',
  [OAuthProvider.GITHUB]: 'GitHub',
  [OAuthProvider.MICROSOFT]: 'Microsoft',
  [OAuthProvider.APPLE]: 'Apple',
};
