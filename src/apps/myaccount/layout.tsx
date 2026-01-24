import { ReactNode } from "react";
import Link from "next/link";
import { UserCog, ArrowLeft, User, Shield, Bell, Settings } from "lucide-react";
import { Button } from "@/ui/button";
import { getBaseUrl } from "@/lib/url-utils";
import { getCurrentUser } from "@/core/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    template: "%s - My Account",
    default: "My Account - Winfoa Platform",
  },
  description: "Personal account management portal",
  metadataBase: new URL(getBaseUrl("myaccount")),
};

export default async function MyAccountLayout({ children }: { children: ReactNode }) {
  // 1. Get Current User
  const user = await getCurrentUser();

  // 2. Auth Check
  if (!user) {
    redirect(`${getBaseUrl("auth")}/login?redirect=${getBaseUrl("myaccount")}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-2">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  My Account
                </h1>
                <p className="text-xs text-slate-500">
                  myaccount.localhost:3000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/security"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Security
                </Link>
                <Link
                  href="/notifications"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Notifications
                </Link>
                <Link
                  href="/preferences"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Preferences
                </Link>
              </nav>
              <Link href={getBaseUrl("root")} target="_blank">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Main
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Account Status Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-teal-600" />
                <span className="text-slate-600">Account Status:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-slate-600">Security Score:</span>
                <span className="font-semibold text-slate-900">85%</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Bell className="h-4 w-4 text-yellow-600" />
                <span className="text-slate-600">Notifications:</span>
                <span className="font-semibold text-slate-900">3</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-slate-600">Profile:</span>
                <span className="font-semibold text-slate-900">Complete</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Account Management • Privacy Settings • Profile Customization
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
            <p>© 2024 Winfoa Platform - My Account Portal</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/privacy"
                className="hover:text-teal-600 transition-colors"
              >
                Privacy Settings
              </Link>
              <Link
                href="/data"
                className="hover:text-teal-600 transition-colors"
              >
                Data Management
              </Link>
              <Link
                href="/billing"
                className="hover:text-teal-600 transition-colors"
              >
                Billing Info
              </Link>
              <Link
                href="/support"
                className="hover:text-teal-600 transition-colors"
              >
                Account Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
