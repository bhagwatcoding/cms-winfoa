'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Lock,
    Key,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Shield,
    Info
} from 'lucide-react';

export default function ChangePasswordPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRequirements = [
        { text: 'At least 8 characters long', met: newPassword.length >= 8 },
        { text: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
        { text: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
        { text: 'Contains number (0-9)', met: /[0-9]/.test(newPassword) },
        { text: 'Contains special character (!@#$%)', met: /[!@#$%^&*]/.test(newPassword) },
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            alert('Please enter your current password');
            return;
        }

        if (!allRequirementsMet) {
            alert('Please meet all password requirements');
            return;
        }

        if (!passwordsMatch) {
            alert('Passwords do not match');
            return;
        }

        alert('Password changed successfully!');
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                            <Lock className="w-8 h-8 text-purple-600" />
                            Change Password
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Update your account password for better security
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Security Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Password Security Tips
                            </h3>
                            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                <li>• Use a strong password with a mix of letters, numbers, and symbols</li>
                                <li>• Never share your password with anyone</li>
                                <li>• Change your password regularly</li>
                                <li>• Don't use the same password across multiple sites</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                            <h2 className="text-xl font-bold text-white">Update Password</h2>
                            <p className="text-purple-100 text-sm mt-1">Enter your current password and choose a new one</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && !passwordsMatch && (
                                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Passwords do not match
                                    </p>
                                )}
                                {confirmPassword && passwordsMatch && (
                                    <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <Key className="w-6 h-6" />
                                Change Password
                            </button>
                        </form>
                    </motion.div>

                    {/* Password Requirements */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-purple-600" />
                                Password Requirements
                            </h3>
                            <div className="space-y-3">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                            }`}>
                                            {req.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-sm ${req.met ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'
                                            }`}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                                Need Help?
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                                If you've forgotten your current password, you can reset it using the forgot password option.
                            </p>
                            <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
