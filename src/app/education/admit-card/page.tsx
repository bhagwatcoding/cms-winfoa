'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, Search, Download, Calendar, User, Hash, BookOpen, MapPin, Clock, CheckCircle2, AlertCircle, Printer
} from 'lucide-react';

interface Student {
    id: string;
    name: string;
    enrollmentId: string;
    course: string;
    examDate: string;
    examTime: string;
    examCenter: string;
    rollNumber: string;
    photo: string;
    admitCardStatus: 'available' | 'pending' | 'not-eligible';
}

export default function AdmitCardPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [students] = useState<Student[]>([
        {
            id: '1',
            name: 'Rajesh Kumar',
            enrollmentId: 'NSDPI/BR141/221255',
            course: 'Advance Diploma in Computer Application (ADCA)',
            examDate: '2024-04-15',
            examTime: '10:00 AM - 01:00 PM',
            examCenter: 'Ramdhari Singh Dinkar Computer Training Center',
            rollNumber: '22755',
            photo: '/placeholder-student.jpg',
            admitCardStatus: 'available'
        },
        {
            id: '2',
            name: 'Priya Singh',
            enrollmentId: 'NSDPI/BR141/221256',
            course: 'Diploma in Computer Application (DCA)',
            examDate: '2024-04-16',
            examTime: '10:00 AM - 01:00 PM',
            examCenter: 'Ramdhari Singh Dinkar Computer Training Center',
            rollNumber: '22756',
            photo: '/placeholder-student.jpg',
            admitCardStatus: 'available'
        },
        {
            id: '3',
            name: 'Amit Sharma',
            enrollmentId: 'NSDPI/BR141/221257',
            course: 'Certificate in Computer Application (CCA)',
            examDate: '2024-04-17',
            examTime: '02:00 PM - 05:00 PM',
            examCenter: 'Ramdhari Singh Dinkar Computer Training Center',
            rollNumber: '22757',
            photo: '/placeholder-student.jpg',
            admitCardStatus: 'pending'
        },
    ]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.includes(searchTerm)
    );

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'available':
                return {
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    label: 'Available'
                };
            case 'pending':
                return {
                    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                    icon: <Clock className="w-4 h-4" />,
                    label: 'Pending'
                };
            default:
                return {
                    color: 'bg-red-500/10 text-red-600 border-red-500/20',
                    icon: <AlertCircle className="w-4 h-4" />,
                    label: 'Not Eligible'
                };
        }
    };

    const handleDownload = (student: Student) => {
        console.log('Downloading admit card for:', student.name);
        // Implement download logic here
    };

    const handlePrint = (student: Student) => {
        console.log('Printing admit card for:', student.name);
        // Implement print logic here
    };

    const stats = {
        total: students.length,
        available: students.filter(s => s.admitCardStatus === 'available').length,
        pending: students.filter(s => s.admitCardStatus === 'pending').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
                                <CreditCard className="w-8 h-8 text-orange-600" />
                                Admit Card Management
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Generate and download admit cards for examinations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Students</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
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
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Available</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.available}</p>
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
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, enrollment ID, or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                    </div>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredStudents.map((student, index) => {
                        const statusConfig = getStatusConfig(student.admitCardStatus);

                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                    <div className="relative flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                                                <User className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{student.name}</h3>
                                                <p className="text-orange-100 text-sm mt-1">{student.enrollmentId}</p>
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
                                        <div className="flex items-center gap-3 text-sm">
                                            <BookOpen className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400 flex-1">{student.course}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Hash className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Roll Number:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{student.rollNumber}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Exam Date:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {new Date(student.examDate).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Time:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{student.examTime}</span>
                                        </div>

                                        <div className="flex items-start gap-3 text-sm">
                                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                            <div className="flex-1">
                                                <span className="text-slate-600 dark:text-slate-400 block">Exam Center:</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{student.examCenter}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {student.admitCardStatus === 'available' && (
                                        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                            <button
                                                onClick={() => handleDownload(student)}
                                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => handlePrint(student)}
                                                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Printer className="w-4 h-4" />
                                                Print
                                            </button>
                                        </div>
                                    )}

                                    {student.admitCardStatus === 'pending' && (
                                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                                            <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Admit card will be available soon
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No students found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
