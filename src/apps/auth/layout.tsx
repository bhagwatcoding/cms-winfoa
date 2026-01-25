import { ReactNode } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/button';
import { Toaster, ErrorBoundary } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';
import { getBaseUrl } from '@/lib/url-utils';

export const metadata = {
  title: {
    template: '%s - Auth Portal',
    default: 'Authentication - Winfoa Platform',
  },
  description: 'Secure authentication portal for Winfoa platform users',
  metadataBase: new URL(getBaseUrl('auth')),
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <Toaster />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Authentication Portal
                    </h1>
                    <p className="text-xs text-slate-500">auth.localhost:3000</p>
                  </div>
                </div>
                <Link href={getBaseUrl('root')} target="_blank">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Main
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center p-4">{children}</main>

          {/* Footer */}
          <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-slate-600">
                <p>© 2024 Winfoa Platform - Authentication Portal</p>
                <div className="mt-2 flex justify-center space-x-4">
                  <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/support" className="hover:text-blue-600 transition-colors">
                    Support
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
