'use client';

import { motion } from 'framer-motion';
import { Shield, Bell, Globe, Smartphone, Edit } from 'lucide-react';

export function SettingsList() {
    const settings = [
        { icon: Shield, label: 'Security & Privacy', description: 'Manage password and security settings' },
        { icon: Bell, label: 'Notifications', description: 'Configure notification preferences' },
        { icon: Globe, label: 'Language & Region', description: 'Set your language and timezone' },
        { icon: Smartphone, label: 'Connected Devices', description: 'Manage your logged-in devices' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white">Account Settings</h2>
            </div>

            <div className="p-6 space-y-4">
                {settings.map((setting, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <setting.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{setting.label}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</p>
                        </div>
                        <Edit className="w-5 h-5 text-slate-400" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
