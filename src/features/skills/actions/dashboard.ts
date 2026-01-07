'use server'

import { StudentService, CourseService } from '@/features/skills/services'
import { Employee, Certificate } from '@/models'
import connectDB from '@/lib/db'

export async function getDashboardStats() {
    try {
        await connectDB()

        const [studentStats, courses, employees, certificates] = await Promise.all([
            StudentService.getStats(),
            CourseService.getAll(),
            Employee.countDocuments(),
            Certificate.countDocuments()
        ])

        return {
            students: studentStats,
            courses: { total: courses.length },
            employees: { total: employees },
            certificates: { total: certificates }
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            students: { total: 0, active: 0, completed: 0, dropped: 0 },
            courses: { total: 0 },
            employees: { total: 0 },
            certificates: { total: 0 }
        }
    }
}
