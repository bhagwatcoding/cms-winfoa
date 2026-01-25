import { ReactNode } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, UserCheck, Shield, Settings } from 'lucide-react';
import { Button } from '@/ui/button';
import { Toaster, ErrorBoundary } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';
import { getBaseUrl } from '@/lib/url-utils';
import { getCurrentUser } from '@/core/auth';
import { redirect } from 'next/navigation';
import { PermissionChecker } from '@/core/permissions/checker';

export const metadata = {
  title: {
    template: '%s - User Management Platform',
    default: 'User Management Platform - Winfoa Platform',
  },
  description: 'User administration and management system',
  metadataBase: new URL(getBaseUrl('ump')),
};

export default async function UMPLayout({ children }: { children: ReactNode }) {
  // 1. Get Current User
  const user = await getCurrentUser();

  // 2. Auth Check
  if (!user) {
    redirect(`http://auth.localhost:3000/login?redirect=http://ump.localhost:3000`);
  }

  // 3. Permission Check (Must have at least 'users:view')
  if (!PermissionChecker.userHas(user, 'users:view')) {
    redirect('http://localhost:3000'); // Redirect to main site if unauthorized
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      User Management Platform
                    </h1>
                    <p className="text-xs text-slate-500">ump.localhost:3000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex items-center space-x-4">
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/users"
                      className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      Users
                    </Link>
                    <Link
                      href="/roles"
                      className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      Roles
                    </Link>
                    <Link
                      href="/permissions"
                      className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
                    >
                      Permissions
                    </Link>
                  </nav>
                  <Link href={getBaseUrl('root')} target="_blank">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Main
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Quick Stats Bar */}
          <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-slate-600">Total Users:</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-slate-600">Active:</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-600">Roles:</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Settings className="h-4 w-4 text-orange-600" />
                    <span className="text-slate-600">Permissions:</span>
                    <span className="font-semibold text-slate-900">0</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  User Administration • Role Management • Access Control
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 py-6">{children}</main>

          {/* Footer */}
          <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-slate-600">
                <p>© 2024 Winfoa Platform - User Management Platform</p>
                <div className="mt-2 flex justify-center space-x-4">
                  <Link href="/users" className="hover:text-purple-600 transition-colors">
                    Manage Users
                  </Link>
                  <Link href="/roles" className="hover:text-purple-600 transition-colors">
                    Role Management
                  </Link>
                  <Link href="/audit" className="hover:text-purple-600 transition-colors">
                    Audit Logs
                  </Link>
                  <Link href="/support" className="hover:text-purple-600 transition-colors">
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
