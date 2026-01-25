import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/button';
import type { Metadata } from 'next';
import { Wallet, ArrowLeft, Home, Plus, Send, Banknote, Receipt, Clock } from 'lucide-react';
import { getBaseUrl } from '@/lib/url-utils';
import { getCurrentUser } from '@/core/auth';
import { redirect } from 'next/navigation';
import { Toaster, ErrorBoundary } from '@/shared/components/ui';
import { ThemeProvider } from '@/shared/components/providers/theme-provider';

export const metadata: Metadata = {
  // 1. Override the base specifically for the wallet section
  metadataBase: new URL(getBaseUrl('wallet')),
  title: {
    template: '%s - Digital Wallet',
    default: 'Digital Wallet - Winfoa Platform',
  },
  description: 'Digital wallet and payment management system',
};

const navItems = [
  { href: '', label: 'Dashboard', icon: Home },
  { href: 'recharge', label: 'Add', icon: Plus },
  { href: 'transfer', label: 'Send', icon: Send },
  { href: 'withdraw', label: 'Withdraw', icon: Banknote },
  { href: 'bills', label: 'Bills', icon: Receipt },
  { href: 'history', label: 'History', icon: Clock },
];

export default async function WalletLayout({ children }: { children: ReactNode }) {
  // 1. Get Current User
  const user = await getCurrentUser();

  // 2. Auth Check
  if (!user) {
    redirect(`http://auth.localhost:3000/login?redirect=http://wallet.localhost:3000`);
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ErrorBoundary>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 blur-lg opacity-50" />
                    <div className="relative rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 p-2.5">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Wallet
                    </h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Secure Digital Payments
                    </p>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Back Button */}
                <Link href={getBaseUrl('root')}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Exit Wallet</span>
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 pb-20 md:pb-6">{children}</main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 md:hidden">
            <div className="flex items-center justify-around py-2">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
