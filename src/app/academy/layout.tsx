import { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/ui/button";

export const metadata = {
  title: {
    template: "%s - Learning Academy",
    default: "Learning Academy - Winfoa Platform",
  },
  description: "Educational platform and course management system",
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-2">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Learning Academy
                </h1>
                <p className="text-xs text-slate-500">academy.localhost:3000</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/students"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Students
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
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-slate-600">Students:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BookOpen className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">Courses:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-slate-600">Certificates:</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Educational Platform • Course Management System
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
            <p>© 2024 Winfoa Platform - Learning Academy Portal</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                href="/about"
                className="hover:text-blue-600 transition-colors"
              >
                About Academy
              </Link>
              <Link
                href="/courses"
                className="hover:text-blue-600 transition-colors"
              >
                Browse Courses
              </Link>
              <Link
                href="/support"
                className="hover:text-blue-600 transition-colors"
              >
                Academic Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
