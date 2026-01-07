'use client';

import { motion } from 'framer-motion';
import {
    Settings,
    Globe,
    Bell,
    Shield,
    Database,
    Mail,
    Smartphone,
    Lock,
    Save,
    RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
    const settingsSections = [
        {
            title: 'General Settings',
            icon: Globe,
            color: 'from-blue-500 to-indigo-500',
            settings: [
                { label: 'Platform Name', value: 'Education Portal', type: 'text' },
                { label: 'Support Email', value: 'support@example.com', type: 'email' },
                { label: 'Support Phone', value: '+91 1234567890', type: 'tel' },
                { label: 'Timezone', value: 'Asia/Kolkata', type: 'select' },
            ]
        },
        {
            title: 'Notification Settings',
            icon: Bell,
            color: 'from-purple-500 to-pink-500',
            settings: [
                { label: 'Email Notifications', value: true, type: 'toggle' },
                { label: 'SMS Notifications', value: false, type: 'toggle' },
                { label: 'Push Notifications', value: true, type: 'toggle' },
                { label: 'Weekly Reports', value: true, type: 'toggle' },
            ]
        },
        {
            title: 'Security Settings',
            icon: Shield,
            color: 'from-green-500 to-emerald-500',
            settings: [
                { label: 'Two-Factor Authentication', value: true, type: 'toggle' },
                { label: 'Session Timeout (minutes)', value: '30', type: 'number' },
                { label: 'Password Expiry (days)', value: '90', type: 'number' },
                { label: 'Max Login Attempts', value: '5', type: 'number' },
            ]
        },
        {
            title: 'Database Settings',
            icon: Database,
            color: 'from-orange-500 to-red-500',
            settings: [
                { label: 'Auto Backup', value: true, type: 'toggle' },
                { label: 'Backup Frequency', value: 'Daily', type: 'select' },
                { label: 'Retention Period (days)', value: '30', type: 'number' },
                { label: 'Database Optimization', value: 'Weekly', type: 'select' },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-orange-950 dark:to-red-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Settings className="w-8 h-8 text-orange-600" />
                                System Settings
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Configure system-wide settings and preferences
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                <RefreshCw className="w-5 h-5" />
                                Reset
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105">
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-6">
                    {settingsSections.map((section, sectionIndex) => (
                        <motion.div
                            key={sectionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className={`bg-gradient-to-r ${section.color} p-6`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                                        <section.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {section.settings.map((setting, settingIndex) => (
                                    <div key={settingIndex} className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {setting.label}
                                        </label>

                                        {setting.type === 'toggle' ? (
                                            <button
                                                className={`relative w-12 h-6 rounded-full transition-colors ${setting.value ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${setting.value ? 'translate-x-7' : 'translate-x-1'
                                                        }`}
                                                ></div>
                                            </button>
                                        ) : setting.type === 'select' ? (
                                            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                <option>{setting.value}</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={setting.type}
                                                defaultValue={setting.value as string}
                                                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-48"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
