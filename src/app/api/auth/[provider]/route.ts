import { NextRequest, NextResponse } from 'next/server';
import { getOAuthUrl, type OAuthProvider } from '@/auth/lib/oauth/providers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider: providerParam } = await params;
    const provider = providerParam as OAuthProvider;

    // Validate provider
    if (provider !== 'google' && provider !== 'github') {
      return NextResponse.json({ error: 'Invalid OAuth provider' }, { status: 400 });
    }

    // Get the callback URL
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`;

    // Generate OAuth URL
    const authUrl = getOAuthUrl(provider, redirectUri);

    // Redirect to OAuth provider
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth flow' }, { status: 500 });
  }
}

// Handle POST requests (same as GET)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  return GET(request, { params });
}
