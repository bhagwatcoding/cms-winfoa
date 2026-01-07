'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Award, TrendingUp, Shield, Zap } from 'lucide-react';

export function FeaturesGrid() {
    const features = [
        {
            icon: GraduationCap,
            title: 'Education Management',
            description: 'Complete student lifecycle management from admission to certification',
            color: 'from-blue-500 to-indigo-500'
        },
        {
            icon: Users,
            title: 'Multi-Center Support',
            description: 'Manage multiple education centers from a single platform',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Award,
            title: 'Digital Certificates',
            description: 'Issue and manage digital certificates with verification',
            color: 'from-cyan-500 to-blue-500'
        },
        {
            icon: TrendingUp,
            title: 'Analytics & Reports',
            description: 'Real-time insights and comprehensive reporting',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with 99.9% uptime',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Optimized performance for seamless experience',
            color: 'from-yellow-500 to-orange-500'
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Everything you need to manage your education center
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
