import { Result, Student, Course } from '@/models'
import connectDB from '@/lib/db'

export class ResultService {
    /**
     * Get all results
     */
    static async getAll(filters?: {
        studentId?: string
        courseId?: string
        centerId?: string
    }) {
        await connectDB()

        const query: any = {}
        if (filters?.studentId) query.studentId = filters.studentId
        if (filters?.courseId) query.courseId = filters.courseId

        const results = await Result.find(query)
            .populate('studentId', 'name fatherName')
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean()

        return results
    }

    /**
     * Get result by ID
     */
    static async getById(id: string) {
        await connectDB()

        const result = await Result.findById(id)
            .populate('studentId')
            .populate('courseId')
            .lean()

        if (!result) {
            throw new Error('Result not found')
        }

        return result
    }

    /**
     * Create result
     */
    static async create(data: any) {
        await connectDB()

        // Validate student exists
        const student = await Student.findById(data.studentId)
        if (!student) {
            throw new Error('Student not found')
        }

        // Validate course exists
        const course = await Course.findById(data.courseId)
        if (!course) {
            throw new Error('Course not found')
        }

        const result = await Result.create(data)
        return result
    }

    /**
     * Update result
     */
    static async update(id: string, data: any) {
        await connectDB()

        const result = await Result.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('studentId').populate('courseId')

        if (!result) {
            throw new Error('Result not found')
        }

        return result
    }

    /**
     * Delete result
     */
    static async delete(id: string) {
        await connectDB()

        const result = await Result.findByIdAndDelete(id)

        if (!result) {
            throw new Error('Result not found')
        }

        return result
    }

    /**
     * Get statistics
     */
    static async getStats(courseId?: string) {
        await connectDB()

        const query = courseId ? { courseId } : {}

        const results = await Result.find(query).lean()

        const total = results.length
        const passed = results.filter((r: any) => r.grade !== 'F').length
        const failed = results.filter((r: any) => r.grade === 'F').length
        const avgMarks = results.length > 0
            ? results.reduce((sum: number, r: any) => sum + (r.obtainedMarks || 0), 0) / results.length
            : 0

        return {
            total,
            passed,
            failed,
            passPercentage: total > 0 ? ((passed / total) * 100).toFixed(2) : '0',
            avgMarks: avgMarks.toFixed(2)
        }
    }
}
