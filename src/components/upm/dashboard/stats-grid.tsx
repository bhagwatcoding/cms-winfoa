'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatsGridProps {
    stats: {
        title: string;
        value: string;
        change: string;
        trend: string;
        icon: any;
        color: string;
    }[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {stat.change}
                        </span>
                    </div>
                    <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </motion.div>
            ))}
        </div>
    );
}
