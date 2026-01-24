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
  Shield,
  Code,
  Users,
  UserCog,
  Crown,
  Globe,
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";

const subdomains = [
  {
    name: "Authentication Portal",
    subdomain: "auth",
    url: "http://auth.localhost:3000",
    icon: Shield,
    description: "User authentication and authorization system",
    features: [
      "Login/Signup",
      "Password Reset",
      "Session Management",
      "OAuth Integration",
    ],
    color: "bg-red-500",
  },
  {
    name: "API Gateway",
    subdomain: "api",
    url: "http://api.localhost:3000",
    icon: Code,
    description: "REST API endpoints and services",
    features: [
      "API Documentation",
      "Rate Limiting",
      "Authentication",
      "Monitoring",
    ],
    color: "bg-green-500",
  },
  {
    name: "User Management Platform",
    subdomain: "ump",
    url: "http://ump.localhost:3000",
    icon: Users,
    description: "User administration and management system",
    features: ["User Profiles", "Role Management", "Permissions", "Analytics"],
    color: "bg-purple-500",
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
      "Notifications",
      "Account Security",
    ],
    color: "bg-teal-500",
  },
  {
    name: "God Mode",
    subdomain: "god",
    url: "http://god.localhost:3000",
    icon: Crown,
    description: "Super Admin Control Panel",
    features: [
      "System Analytics",
      "Global Configuration",
      "User Oversight",
      "System Health",
    ],
    color: "bg-yellow-600",
  },
  {
    name: "Wallet",
    subdomain: "wallet",
    url: "http://wallet.localhost:3000",
    icon: Zap,
    description: "Digital wallet and payments",
    features: [
      "Balance",
      "Transactions",
      "Recharge",
      "Bill Payments",
    ],
    color: "bg-orange-500",
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
            A comprehensive web application architecture featuring specialized
            subdomains for authentication, learning management, user
            administration, and system control.
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
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl ${subdomain.color} bg-opacity-10`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${subdomain.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                    </div>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {subdomain.subdomain}.localhost
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {subdomain.name}
                  </CardTitle>
                  <CardDescription>{subdomain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {subdomain.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={subdomain.url} target="_blank">
                    <Button className="w-full group-hover:bg-slate-900 transition-colors">
                      Visit Subdomain
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-200 pt-8 text-center text-slate-500">
          <p>
            System Status: <span className="text-green-600 font-medium">Operational</span> • 
            Version 1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
