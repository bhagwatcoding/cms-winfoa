import { Toaster, ErrorBoundary } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';
import { HeaderStore } from '@/core/helpers';

export const metadata = {
  title: {
    template: '%s - Education Management System',
    default: 'Winfoa - Education Management System',
  },
  description: 'Comprehensive cms management platform with multi-subdomain architecture',
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await HeaderStore.metadata();
  console.log(result);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <Toaster />
        {children}
      </ErrorBoundary>
    </ThemeProvider>
  );
}
