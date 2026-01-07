'use client';

import { Card, CardContent } from '@/ui';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Action {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
}

interface QuickActionsProps {
    actions: Action[];
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={action.href}>
                                <Card className="group border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
