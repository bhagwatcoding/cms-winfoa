'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface QuickActionsProps {
    actions: {
        title: string;
        description: string;
        icon: any;
        href: string;
        color: string;
    }[];
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
        >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-600" />
                Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <Link key={index} href={action.href}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                {action.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {action.description}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
