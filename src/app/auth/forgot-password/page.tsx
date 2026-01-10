'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/ui/use-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                variant: 'destructive',
                title: 'Invalid Email',
                description: 'Please enter a valid email address',
            });
            setLoading(false);
            return;
        }

        try {
            // Call API to send reset email
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                toast({
                    title: 'Email Sent!',
                    description: 'Check your inbox for password reset instructions',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.error || 'Failed to send reset email. Please try again.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-orange-950 dark:to-red-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl mb-4 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        No worries, we&apos;ll send you reset instructions
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border-2 border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl"
                >
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    Enter the email address associated with your account
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                Check Your Email
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                                We&apos;ve sent password reset instructions to<br />
                                <strong className="text-slate-900 dark:text-white">{email}</strong>
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Didn&apos;t receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setEmail('');
                                    }}
                                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold underline transition-colors"
                                >
                                    try again
                                </button>
                            </p>
                            <Link href="/login">
                                <button className="w-full px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                                    Back to Login
                                </button>
                            </Link>
                        </motion.div>
                    )}

                    {/* Back to Login */}
                    {!submitted && (
                        <div className="mt-6 text-center">
                            <Link href="/login">
                                <button className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-semibold">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </button>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    Remember your password?{' '}
                    <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
