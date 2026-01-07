'use client';

import { motion } from 'framer-motion';
import {
    Settings,
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Camera,
    Bell,
    Shield,
    Globe
} from 'lucide-react';

export default function MyAccountSettingsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Settings className="w-8 h-8 text-indigo-600" />
                        Account Settings
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage your account preferences
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6"
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Personal Information
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Rajesh Kumar"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        defaultValue="rajesh@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        defaultValue="+91 98765 43210"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        defaultValue="Mumbai, Maharashtra"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Settings className="w-6 h-6" />
                            Preferences
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {[
                            { icon: Bell, label: 'Email Notifications', description: 'Receive email updates', enabled: true },
                            { icon: Bell, label: 'Push Notifications', description: 'Receive push notifications', enabled: true },
                            { icon: Shield, label: 'Two-Factor Authentication', description: 'Extra security for your account', enabled: false },
                            { icon: Globe, label: 'Dark Mode', description: 'Use dark theme', enabled: true },
                        ].map((pref, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                        <pref.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{pref.label}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{pref.description}</p>
                                    </div>
                                </div>
                                <button
                                    className={`relative w-12 h-6 rounded-full transition-colors ${pref.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${pref.enabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    ></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
