"use server";

import connectDB from '@/lib/db';
import Student from '@/edu/models/Student';
import Course from '@/edu/models/Course';
import Employee from '@/edu/models/Employee';
import Result from '@/edu/models/Result';
import { getSession } from '@/lib/auth';

export interface DashboardStats {
    students: {
        total: number;
        active: number;
        completed: number;
        dropped: number;
    },
    courses: {
        total: number;
    },
    employees: {
        total: number;
        active: number;
    },
    results: {
        total: number;
        passed: number;
        failed: number;
        passPercentage: number;
    },
    recent: {
        students: string[];
        results: string[];
    }
};




export async function getDashboardStats(): Promise<DashboardStats | null> {
    try {
        await connectDB();
        const { user } = await getSession();

        if (!user || !user.centerId) {
            return null;
        }

        const centerId = user.centerId;

        // Fetch all statistics in parallel for better performance
        const [
            totalStudents,
            activeStudents,
            completedStudents,
            droppedStudents,
            totalCourses,
            totalEmployees,
            activeEmployees,
            totalResults,
            passedResults,
            recentStudents,
            recentResults
        ] = await Promise.all([
            Student.countDocuments({ centerId }),
            Student.countDocuments({ centerId, status: 'active' }),
            Student.countDocuments({ centerId, status: 'completed' }),
            Student.countDocuments({ centerId, status: 'dropped' }),
            Course.countDocuments(),
            Employee.countDocuments({ centerId }),
            Employee.countDocuments({ centerId, status: 'active' }),
            Result.countDocuments({ centerId }),
            Result.countDocuments({ centerId, status: 'pass' }),
            Student.find({ centerId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('courseId', 'name code')
                .lean(),
            Result.find({ centerId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('studentId', 'name')
                .populate('courseId', 'name')
                .lean()
        ]);

        // Calculate pass percentage
        const passPercentage = totalResults > 0
            ? Math.round((passedResults / totalResults) * 100)
            : 0;

        return {
            students: {
                total: totalStudents,
                active: activeStudents,
                completed: completedStudents,
                dropped: droppedStudents
            },
            courses: {
                total: totalCourses
            },
            employees: {
                total: totalEmployees,
                active: activeEmployees
            },
            results: {
                total: totalResults,
                passed: passedResults,
                failed: totalResults - passedResults,
                passPercentage
            },
            recent: {
                students: JSON.parse(JSON.stringify(recentStudents)),
                results: JSON.parse(JSON.stringify(recentResults))
            }
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return null;
    }
}

export async function getCenterStats() {
    try {
        await connectDB();
        const { user } = await getSession();

        if (!user || !user.centerId) {
            return null;
        }

        const Center = (await import('@/edu/models/Center')).default;
        const center = await Center.findById(user.centerId).lean();

        if (!center) {
            return null;
        }

        return JSON.parse(JSON.stringify(center));
    } catch (error) {
        console.error('Failed to fetch center stats:', error);
        return null;
    }
}
