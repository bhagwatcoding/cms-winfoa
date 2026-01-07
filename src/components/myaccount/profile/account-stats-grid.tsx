'use client';

import { motion } from 'framer-motion';

interface AccountStatsGridProps {
    stats: {
        label: string;
        value: string;
        color: string;
    }[];
}

export function AccountStatsGrid({ stats }: AccountStatsGridProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                >
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
