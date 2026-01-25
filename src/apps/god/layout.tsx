import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { GodLayoutClient } from './god-layout-client';
import { getBaseUrl } from '@/lib/url-utils';
import { getCurrentUser } from '@/core/auth';
import { redirect } from 'next/navigation';
import { PermissionChecker } from '@/core/permissions/checker';

export const metadata: Metadata = {
  title: 'God Portal',
  description: 'God Portal for WINFOA',
  metadataBase: new URL(getBaseUrl('god')),
};

import { Toaster, ErrorBoundary } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';

export default async function GodLayout({ children }: PropsWithChildren) {
  // 1. Get Current User
  const user = await getCurrentUser();

  // 2. Auth Check
  if (!user) {
    redirect(`${getBaseUrl('auth')}/login?redirect=${getBaseUrl('god')}`);
  }

  // 3. Permission Check (Must be God)
  if (!PermissionChecker.userHas(user, '*:*')) {
    redirect(getBaseUrl('root')); // Redirect to main site if unauthorized
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <Toaster />
        <GodLayoutClient>{children}</GodLayoutClient>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
