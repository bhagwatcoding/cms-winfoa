import { ReactNode } from "react";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/ui/button";

export const metadata = {
  title: {
    template: "%s - Provider Portal",
    default: "Provider Portal - Winfoa Platform",
  },
  description: "Service provider management and portal",
};

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Provider Portal
                </h1>
                <p className="text-xs text-slate-500">
                  provider.localhost:3000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/clients"
                  className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Clients
                </Link>
                <Link
                  href="/analytics"
                  className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Analytics
                </Link>
              </nav>
              <Link href="http://localhost:3000" target="_blank">
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
                <Package className="h-4 w-4 text-orange-600" />
                <span className="text-slate-600">Active Services:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-slate-600">Clients:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">Monthly Revenue:</span>
                <span className="font-semibold text-slate-900">$0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-slate-600">Status:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Service Management • Client Relations • Business Analytics
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
            <p>© 2024 Winfoa Platform - Provider Portal</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/services"
                className="hover:text-orange-600 transition-colors"
              >
                Service Catalog
              </Link>
              <Link
                href="/billing"
                className="hover:text-orange-600 transition-colors"
              >
                Billing & Payments
              </Link>
              <Link
                href="/contracts"
                className="hover:text-orange-600 transition-colors"
              >
                Contracts
              </Link>
              <Link
                href="/support"
                className="hover:text-orange-600 transition-colors"
              >
                Provider Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
