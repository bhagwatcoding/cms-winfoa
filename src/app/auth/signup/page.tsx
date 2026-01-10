'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Phone, Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/ui';
import { signupAction } from '@/auth/actions/signup';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {};
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const phone = formData.get('phone') as string;

        if (!name || name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);

        if (!validateForm(formData)) {
            setLoading(false);
            return;
        }

        try {
            const result = await signupAction(null, formData);

            if (result?.error) {
                toast({
                    variant: 'destructive',
                    title: 'Signup Failed',
                    description: result.error,
                });
                setLoading(false);
            } else {
                toast({
                    title: 'Account Created!',
                    description: 'Welcome! Redirecting to your dashboard...',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: 'An unexpected error occurred. Please try again.',
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl mb-4 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Join thousands of learners and start your journey today
                    </p>
                </motion.div>

                {/* Signup Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="name"
                                        type="text"
                                        disabled={loading}
                                        placeholder="Enter your full name"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 ${errors.name ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50`}
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        disabled={loading}
                                        placeholder="your.email@example.com"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 ${errors.email ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50`}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        disabled={loading}
                                        placeholder="+91 1234567890"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 ${errors.phone ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Account Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                                    <select
                                        name="role"
                                        disabled={loading}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none disabled:opacity-50 cursor-pointer"
                                        defaultValue="student"
                                    >
                                        <option value="student">Student</option>
                                        <option value="center">Center Admin</option>
                                        <option value="staff">Employee</option>
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        disabled={loading}
                                        placeholder="Create a strong password"
                                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 ${errors.password ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        disabled={loading}
                                        placeholder="Confirm your password"
                                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                required
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                I agree to the{' '}
                                <Link href="#" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="#" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link href="/login">
                        <button className="w-full px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                            Sign In Instead
                        </button>
                    </Link>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
