/**
 * API Key Enums
 * Numeric values for efficient DB storage
 */

export const enum ApiKeyScope {
  READ = 1,
  WRITE = 2,
  DELETE = 3,
  ADMIN = 4,
}

export const ApiKeyScopeLabel: Record<ApiKeyScope, string> = {
  [ApiKeyScope.READ]: 'Read',
  [ApiKeyScope.WRITE]: 'Write',
  [ApiKeyScope.DELETE]: 'Delete',
  [ApiKeyScope.ADMIN]: 'Admin',
};

export const enum ApiKeyEnvironment {
  TEST = 1,
  LIVE = 2,
}

export const ApiKeyEnvironmentLabel: Record<ApiKeyEnvironment, string> = {
  [ApiKeyEnvironment.TEST]: 'Test',
  [ApiKeyEnvironment.LIVE]: 'Live',
};
