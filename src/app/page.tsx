import Link from "next/link";
import { Button } from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import {
  GraduationCap,
  Shield,
  UserCog,
  Wallet,
  ArrowRight,
  Globe,
  Zap,
  Lock,
} from "lucide-react";
import HomePage from "@/features/god/user-deleted";
const subdomains = [
  {
    name: "Authentication Portal",
    subdomain: "auth",
    url: "http://auth.localhost:3000",
    icon: Shield,
    description: "Simple session-based authentication system",
    features: [
      "Login/Register",
      "Password Reset",
      "Session Management",
      "User Profiles",
    ],
    color: "bg-red-500",
  },
  {
    name: "Learning Academy",
    subdomain: "academy",
    url: "http://academy.localhost:3000",
    icon: GraduationCap,
    description: "Educational platform and course management",
    features: [
      "Course Management",
      "Student Portal",
      "Certificates",
      "Results",
    ],
    color: "bg-blue-500",
  },
  {
    name: "My Account",
    subdomain: "myaccount",
    url: "http://myaccount.localhost:3000",
    icon: UserCog,
    description: "Personal account management portal",
    features: [
      "Profile Settings",
      "Privacy Controls",
      "Preferences",
      "Account Security",
    ],
    color: "bg-teal-500",
  },
  {
    name: "Digital Wallet",
    subdomain: "wallet",
    url: "http://wallet.localhost:3000",
    icon: Wallet,
    description: "Transaction management and history",
    features: [
      "Transaction History",
      "Balance Overview",
      "Payment Records",
      "Reports",
    ],
    color: "bg-yellow-500",
  },
];

export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Winfoa Platform
                </h1>
                <p className="text-sm text-slate-500">
                  Multi-Domain Architecture
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>
      <HomePage />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Full-Stack Web Development
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Multi-Subdomain Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            A streamlined education management system featuring specialized
            subdomains for authentication, learning academy, account management,
            and transaction tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span className="px-3 py-1 bg-white rounded-full border">
              Next.js 16
            </span>
            <span className="px-3 py-1 bg-white rounded-full border">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-white rounded-full border">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 bg-white rounded-full border">
              MongoDB
            </span>
            <span className="px-3 py-1 bg-white rounded-full border">
              Subdomain Routing
            </span>
          </div>
        </div>

        {/* Subdomain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {subdomains.map((subdomain) => {
            const IconComponent = subdomain.icon;
            return (
              <Card
                key={subdomain.subdomain}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`${subdomain.color} rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link href={subdomain.url} target="_blank">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {subdomain.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {subdomain.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Subdomain:</span>
                      <code className="px-2 py-1 bg-slate-100 rounded text-blue-600 font-mono">
                        {subdomain.subdomain}.localhost:3000
                      </code>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Features:
                      </span>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {subdomain.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={subdomain.url} target="_blank">
                      <Button
                        className="w-full mt-4 group-hover:shadow-md transition-shadow"
                        size="sm"
                      >
                        Open {subdomain.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Architecture Overview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border-0 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Platform Architecture
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Multi-Domain Routing
              </h4>
              <p className="text-sm text-slate-600">
                Advanced middleware handling subdomain routing with Next.js 16
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                High Performance
              </h4>
              <p className="text-sm text-slate-600">
                Optimized with SSR, caching, and modern React patterns
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Enterprise Security
              </h4>
              <p className="text-sm text-slate-600">
                Built-in authentication, authorization, and data protection
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold text-white">
                Winfoa Platform
              </span>
            </div>
            <p className="text-sm">
              © 2024 Winfoa Web Development Company. Full-stack multi-subdomain
              architecture.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/api" className="hover:text-white transition-colors">
                API Reference
              </Link>
              <Link
                href="/support"
                className="hover:text-white transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
