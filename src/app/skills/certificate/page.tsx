'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    Search,
    Download,
    Calendar,
    User,
    Hash,
    BookOpen,
    CheckCircle2,
    Clock,
    Star,
    Trophy,
    Medal
} from 'lucide-react';

interface Certificate {
    id: string;
    studentName: string;
    enrollmentId: string;
    course: string;
    completionDate: string;
    grade: string;
    certificateNumber: string;
    issueDate: string;
    status: 'issued' | 'pending' | 'ready';
}

export default function CertificatePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [certificates] = useState<Certificate[]>([
        {
            id: '1',
            studentName: 'Rajesh Kumar',
            enrollmentId: 'NSDPI/BR141/221255',
            course: 'Advance Diploma in Computer Application (ADCA)',
            completionDate: '2024-03-15',
            grade: 'A+',
            certificateNumber: 'CERT/2024/001255',
            issueDate: '2024-03-20',
            status: 'issued'
        },
        {
            id: '2',
            studentName: 'Priya Singh',
            enrollmentId: 'NSDPI/BR141/221256',
            course: 'Diploma in Computer Application (DCA)',
            completionDate: '2024-03-16',
            grade: 'A',
            certificateNumber: 'CERT/2024/001256',
            issueDate: '2024-03-21',
            status: 'ready'
        },
        {
            id: '3',
            studentName: 'Amit Sharma',
            enrollmentId: 'NSDPI/BR141/221257',
            course: 'Certificate in Computer Application (CCA)',
            completionDate: '2024-03-17',
            grade: 'B+',
            certificateNumber: '',
            issueDate: '',
            status: 'pending'
        },
    ]);

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch =
            cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            cert.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'issued':
                return {
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    label: 'Issued'
                };
            case 'ready':
                return {
                    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                    icon: <Star className="w-4 h-4" />,
                    label: 'Ready'
                };
            default:
                return {
                    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                    icon: <Clock className="w-4 h-4" />,
                    label: 'Pending'
                };
        }
    };

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'text-emerald-600';
        if (grade.startsWith('B')) return 'text-blue-600';
        if (grade.startsWith('C')) return 'text-amber-600';
        return 'text-slate-600';
    };

    const stats = {
        total: certificates.length,
        issued: certificates.filter(c => c.status === 'issued').length,
        ready: certificates.filter(c => c.status === 'ready').length,
        pending: certificates.filter(c => c.status === 'pending').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Award className="w-8 h-8 text-cyan-600" />
                                Branch Certificates
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage and issue course completion certificates
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Certificates</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Issued</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.issued}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Ready</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.ready}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                                <Star className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, enrollment ID, or certificate number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'all'
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('issued')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'issued'
                                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Issued
                            </button>
                            <button
                                onClick={() => setFilterStatus('ready')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'ready'
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Ready
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'pending'
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCertificates.map((cert, index) => {
                        const statusConfig = getStatusConfig(cert.status);

                        return (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                    <div className="relative flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                                                <Trophy className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{cert.studentName}</h3>
                                                <p className="text-cyan-100 text-sm mt-1">{cert.enrollmentId}</p>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${statusConfig.color}`}>
                                            {statusConfig.icon}
                                            <span className="text-xs font-semibold">{statusConfig.label}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-sm">
                                            <BookOpen className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <span className="text-slate-600 dark:text-slate-400 flex-1">{cert.course}</span>
                                        </div>

                                        {cert.certificateNumber && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Hash className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-600 dark:text-slate-400">Certificate No:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{cert.certificateNumber}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Completed:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {new Date(cert.completionDate).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>

                                        {cert.issueDate && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-600 dark:text-slate-400">Issued:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {new Date(cert.issueDate).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 text-sm">
                                            <Medal className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Grade:</span>
                                            <span className={`font-bold text-lg ${getGradeColor(cert.grade)}`}>{cert.grade}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {(cert.status === 'issued' || cert.status === 'ready') && (
                                        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                            <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                        </div>
                                    )}

                                    {cert.status === 'pending' && (
                                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                                            <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Certificate is being processed
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredCertificates.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No certificates found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
