'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface RecentActivitiesProps {
    activities: {
        type: string;
        message: string;
        time: string;
        icon: any;
        color: string;
    }[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
        >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-white font-medium">
                                {activity.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
