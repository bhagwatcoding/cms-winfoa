'use client';

import { ForgotPasswordForm } from '@/features/auth/components/forms/forgot-password-form';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
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
          Forgot Password?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No worries, we&apos;ll send you reset instructions
        </p>
      </motion.div>

      {/* Forgot Password Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ForgotPasswordForm />
      </motion.div>
    </div>
  );
}
