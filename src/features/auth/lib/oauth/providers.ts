export const oauthProviders = {
  google: {
    name: 'Google',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    color: '#4285F4',
  },
  github: {
    name: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scope: 'read:user user:email',
    color: '#24292e',
  },
} as const;

export type OAuthProvider = keyof typeof oauthProviders;

export function getOAuthUrl(provider: OAuthProvider, redirectUri: string): string {
  const config = oauthProviders[provider];

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    scope: config.scope,
    response_type: 'code',
    ...(provider === 'google' && { access_type: 'offline', prompt: 'consent' }),
  });

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
  redirectUri: string
): Promise<string> {
  const config = oauthProviders[provider];

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function getOAuthUserInfo(
  provider: OAuthProvider,
  accessToken: string
): Promise<{
  id: string;
  email: string;
  name: string;
  avatar?: string;
}> {
  const config = oauthProviders[provider];

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  const data = await response.json();

  if (provider === 'google') {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  } else if (provider === 'github') {
    // GitHub might not include email in user endpoint, fetch separately if needed
    const email = data.email || (await getGitHubUserEmail(accessToken));

    return {
      id: data.id.toString(),
      email,
      name: data.name || data.login,
      avatar: data.avatar_url,
    };
  }

  throw new Error(`Unsupported OAuth provider: ${provider}`);
}

async function getGitHubUserEmail(accessToken: string): Promise<string> {
  const response = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  const emails = await response.json();
  const primaryEmail = emails.find(
    (e: { primary: boolean; verified: boolean; email: string }) => e.primary && e.verified
  );

  return primaryEmail?.email || emails[0]?.email;
}
