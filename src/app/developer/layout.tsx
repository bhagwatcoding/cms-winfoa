import { ReactNode } from "react";
import Link from "next/link";
import {
  Settings,
  ArrowLeft,
  Code,
  Key,
  Book,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/ui/button";

export const metadata = {
  title: {
    template: "%s - Developer Portal",
    default: "Developer Portal - Winfoa Platform",
  },
  description: "Developer tools and API documentation platform",
};

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-2">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Developer Portal
                </h1>
                <p className="text-xs text-slate-500">
                  developer.localhost:3000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-docs"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  API Docs
                </Link>
                <Link
                  href="/api-keys"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  API Keys
                </Link>
                <Link
                  href="/testing"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Testing Tools
                </Link>
                <Link
                  href="/sdk"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  SDK
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

      {/* Developer Stats Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Key className="h-4 w-4 text-indigo-600" />
                <span className="text-slate-600">Active API Keys:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">API Calls (Today):</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Code className="h-4 w-4 text-purple-600" />
                <span className="text-slate-600">SDK Version:</span>
                <span className="font-semibold text-slate-900">v1.0.0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-slate-600">Rate Limit:</span>
                <span className="font-semibold text-green-600">100/min</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              API Management • Developer Tools • Documentation • Testing Suite
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
            <p>© 2024 Winfoa Platform - Developer Portal</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/api-reference"
                className="hover:text-indigo-600 transition-colors"
              >
                API Reference
              </Link>
              <Link
                href="/sdk-downloads"
                className="hover:text-indigo-600 transition-colors"
              >
                SDK Downloads
              </Link>
              <Link
                href="/changelog"
                className="hover:text-indigo-600 transition-colors"
              >
                Changelog
              </Link>
              <Link
                href="/developer-support"
                className="hover:text-indigo-600 transition-colors"
              >
                Developer Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
