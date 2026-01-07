'use client';

import { motion } from 'framer-motion';
import { Building2, Shield, Users } from 'lucide-react';

export function ProductsGrid() {
    const products = [
        {
            name: 'Center Portal',
            description: 'Complete education center management system',
            url: 'center.localhost:3000',
            icon: Building2,
            color: 'from-blue-600 to-indigo-600'
        },
        {
            name: 'God Panel',
            description: 'Super admin dashboard for system-wide control',
            url: 'god.localhost:3000',
            icon: Shield,
            color: 'from-purple-600 to-pink-600'
        },
        {
            name: 'My Account',
            description: 'Personal account and profile management',
            url: 'myaccount.localhost:3000',
            icon: Users,
            color: 'from-green-600 to-emerald-600'
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Our Products
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        Access different portals based on your role
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                                <product.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
                                {product.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
                                {product.description}
                            </p>
                            <a
                                href={`http://${product.url}`}
                                className={`block w-full px-6 py-3 bg-gradient-to-r ${product.color} text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300`}
                            >
                                Access Portal
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
