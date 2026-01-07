'use client';

import { motion } from 'framer-motion';
import { Camera, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

interface ProfileHeaderProps {
    userInfo: {
        name: string;
        email: string;
        phone: string;
        role: string;
        center: string;
        location: string;
        joinedDate: string;
        lastActive: string;
    };
}

export function ProfileHeader({ userInfo }: ProfileHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
        >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition-colors">
                        <Camera className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Avatar */}
                <div className="px-6 pb-6">
                    <div className="relative -mt-16 mb-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-slate-900">
                            {userInfo.name.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {userInfo.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {userInfo.role}
                    </p>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Mail className="w-4 h-4" />
                            {userInfo.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Phone className="w-4 h-4" />
                            {userInfo.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="w-4 h-4" />
                            {userInfo.location}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            Joined {userInfo.joinedDate}
                        </div>
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                        <Edit className="w-5 h-5" />
                        Edit Profile
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
