'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]"></div>
            <div className="container mx-auto px-4 py-20 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Next-Generation Education Platform
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Transform Education
                        </span>
                        <br />
                        <span className="text-slate-900 dark:text-white">
                            Management
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Comprehensive platform for education centers with student management, digital certificates,
                        wallet system, and real-time analytics.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/center">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-lg hover:border-blue-500 transition-all duration-300">
                            View Demo
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
