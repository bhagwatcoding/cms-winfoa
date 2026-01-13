'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Download,
    User,
    Calendar,
    MapPin,
    GraduationCap,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Award,
    Building2,
    Hash,
    CreditCard,
    Clock,
    Users,
    FileText,
} from 'lucide-react';

interface Student {
    address: string;
    admissionDate: string;
    admissionFee: string;
    admissionStatus: string;
    admitCard: boolean;
    appId: string;
    branchCode: string;
    centerAddress: string;
    centerDistrict: string;
    centerName: string;
    centerPinCode: string;
    centerState: string;
    courseCode: string;
    courseDuration: string;
    courseName: string;
    courseTypeCode: string;
    courseYear: string;
    createdBy: string;
    createdOn: string;
    district: string;
    dob: string;
    email: string;
    enrollmentId: string;
    enrollmentNumber: string;
    examName: string;
    examRollNumber: string;
    fathersName: string;
    gender: string;
    marksObtained: string;
    marksPercentage: string;
    mobile: string;
    nationality: string;
    onlineClassAccess: boolean;
    organizationName: string;
    photoPath: string;
    pinCode: string;
    prevExamSession: string;
    qualification: string;
    referenceNumber: string;
    rollNumber: string;
    royaltyFee: string;
    session: string;
    signaturePath: string;
    state: string;
    studentName: string;
    studentStatus: string;
}

export default function RegistrationListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [stats, setStats] = useState({
        total: 0,
        passed: 0,
        pending: 0,
        failed: 0
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://nsdpi.co/api/students-list');
            const data = await response.json();
            setStudents(data);

            // Calculate stats
            const total = data.length;
            const passed = data.filter((s: Student) => s.studentStatus === 'PASSED').length;
            const pending = data.filter((s: Student) => s.studentStatus === 'PENDING').length;
            const failed = data.filter((s: Student) => s.studentStatus === 'FAILED').length;

            setStats({ total, passed, pending, failed });
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.mobile.includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            student.studentStatus.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PASSED':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'PENDING':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'FAILED':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PASSED':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'FAILED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Header Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                Student Registration List
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage and view all registered students
                            </p>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                            <Download className="w-5 h-5" />
                            Export Data
                        </button>
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
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Students</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Passed</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.passed}</p>
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
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Failed</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{stats.failed}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, enrollment ID, mobile, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'all'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('passed')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'passed'
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/50'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Passed
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
                            <button
                                onClick={() => setFilterStatus('failed')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === 'failed'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Failed
                            </button>
                        </div>
                    </div>
                </div>

                {/* Students Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.enrollmentId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                            >
                                {/* Card Header with Gradient */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                    <div className="relative flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                                                <User className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{student.studentName}</h3>
                                                <p className="text-blue-100 text-sm mt-1">{student.enrollmentId}</p>
                                            </div>
                                        </div>

                                        <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${getStatusColor(student.studentStatus)}`}>
                                            {getStatusIcon(student.studentStatus)}
                                            <span className="text-xs font-semibold">{student.studentStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Personal Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Father:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{student.fathersName}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">DOB:</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {new Date(student.dob).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400 truncate">{student.email}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-900 dark:text-white">{student.mobile}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {student.district}, {student.state} - {student.pinCode}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <div className="flex items-start gap-3">
                                            <GraduationCap className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    {student.courseName}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                    {student.courseCode} • {student.courseDuration} Months • Session {student.session}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <div className="flex items-start gap-3">
                                            <Building2 className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    {student.centerName}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                    {student.centerDistrict}, {student.centerState}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Hash className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">Roll No.</span>
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white">{student.rollNumber}</p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">Adm. Fee</span>
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white">₹{student.admissionFee}</p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">Admission</span>
                                            </div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {new Date(student.admissionDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Award className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400">Qualification</span>
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white">{student.qualification}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4">
                                        <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            View Details
                                        </button>
                                        {student.admitCard && (
                                            <button className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Admit Card
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredStudents.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No students found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
