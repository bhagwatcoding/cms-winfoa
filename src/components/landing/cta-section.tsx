'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function CtaSection() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of education centers already using our platform
                    </p>
                    <Link href="/center">
                        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                            Start Free Trial
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
