/**
 * OAuth Providers Configuration
 * Centralized OAuth provider settings
 */

export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  enabled: boolean;
}

export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scopes: ['openid', 'email', 'profile'],
    enabled: !!process.env.GOOGLE_CLIENT_ID,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
    enabled: !!process.env.GITHUB_CLIENT_ID,
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['openid', 'email', 'profile'],
    enabled: !!process.env.MICROSOFT_CLIENT_ID,
  },
};

export function getOAuthProvider(providerId: string): OAuthProvider | undefined {
  return OAUTH_PROVIDERS[providerId];
}

export function getEnabledProviders(): OAuthProvider[] {
  return Object.values(OAUTH_PROVIDERS).filter((p) => p.enabled);
}

export function isValidProvider(providerId: string): boolean {
  return providerId in OAUTH_PROVIDERS;
}

export function getAuthorizationUrl(
  providerId: string,
  state: string,
  redirectUri: string
): string {
  const provider = OAUTH_PROVIDERS[providerId];
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: provider.scopes.join(' '),
    state,
  });

  return `${provider.authorizationUrl}?${params.toString()}`;
}
