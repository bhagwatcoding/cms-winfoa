'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface SystemHealthProps {
    services: {
        name: string;
        status: string;
        uptime: string;
        color: string;
    }[];
}

export function SystemHealth({ services }: SystemHealthProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
        >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-600" />
                System Health
            </h2>
            <div className="space-y-4">
                {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{service.status}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{service.uptime}</p>
                            <p className="text-xs text-slate-500">Uptime</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
