"use client";

import Link from "next/link";
import { LoginForm } from "@/features/auth/components/forms/login-form";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLandingPage() {
  return (
    <div className="w-full max-w-md">
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Sign in to continue to your account
        </p>
      </motion.div>

      {/* Login Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LoginForm />
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-slate-500 mt-6"
      >
        By signing in, you agree to our{" "}
        <Link
          href="#"
          className="text-blue-600 hover:text-blue-700 font-semibold underline"
        >
          Terms of Service
        </Link>
      </motion.p>
    </div>
  );
}
