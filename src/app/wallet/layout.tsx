import { ReactNode } from "react";
import Link from "next/link";
import { Wallet, ArrowLeft, CreditCard, TrendingUp, Shield, DollarSign, } from "lucide-react";
import { Button } from "@/ui/button";

export const metadata = {
  title: {
    template: "%s - Digital Wallet",
    default: "Digital Wallet - Winfoa Platform",
  },
  description: "Digital wallet and payment management system",
};

export default function WalletLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl p-2">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Digital Wallet
                </h1>
                <p className="text-xs text-slate-500">wallet.localhost:3000</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-yellow-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-slate-600 hover:text-yellow-600 transition-colors"
                >
                  Transactions
                </Link>
                <Link
                  href="/recharge"
                  className="text-sm font-medium text-slate-600 hover:text-yellow-600 transition-colors"
                >
                  Recharge
                </Link>
                <Link
                  href="/bills"
                  className="text-sm font-medium text-slate-600 hover:text-yellow-600 transition-colors"
                >
                  Pay Bills
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

      {/* Wallet Stats Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">Balance:</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-slate-600">Cards:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-slate-600">Monthly Spending:</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-slate-600">Security:</span>
                <span className="font-semibold text-emerald-600">
                  Protected
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Digital Payments • Secure Transactions • Wallet Management
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
            <p>© 2024 Winfoa Platform - Digital Wallet Portal</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/payment-methods"
                className="hover:text-yellow-600 transition-colors"
              >
                Payment Methods
              </Link>
              <Link
                href="/transaction-history"
                className="hover:text-yellow-600 transition-colors"
              >
                Transaction History
              </Link>
              <Link
                href="/security"
                className="hover:text-yellow-600 transition-colors"
              >
                Security Settings
              </Link>
              <Link
                href="/support"
                className="hover:text-yellow-600 transition-colors"
              >
                Payment Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
