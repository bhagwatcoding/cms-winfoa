import { Student } from '@/models'
import connectDB from '@/lib/db'

export class StudentService {
    /**
     * Get all students with optional filters
     */
    static async getAll(filters?: {
        centerId?: string
        courseId?: string
        status?: string
    }) {
        await connectDB()

        const query: Record<string, unknown> = {}
        if (filters?.centerId) query.centerId = filters.centerId
        if (filters?.courseId) query.courseId = filters.courseId
        if (filters?.status) query.status = filters.status

        const students = await Student.find(query)
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean()

        return students
    }

    /**
     * Get student by ID
     */
    static async getById(id: string) {
        await connectDB()

        const student = await Student.findById(id)
            .populate('courseId')
            .populate('centerId')
            .lean()

        if (!student) {
            throw new Error('Student not found')
        }

        return student
    }

    /**
     * Create new student
     */
    static async create(data: Record<string, unknown>) {
        await connectDB()

        const student = await Student.create(data)
        return student
    }

    /**
     * Update student
     */
    static async update(id: string, data: Partial<Record<string, unknown>>) {
        await connectDB()

        const student = await Student.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('courseId')

        if (!student) {
            throw new Error('Student not found')
        }

        return student
    }

    /**
     * Delete student
     */
    static async delete(id: string) {
        await connectDB()

        const student = await Student.findByIdAndDelete(id)

        if (!student) {
            throw new Error('Student not found')
        }

        return student
    }

    /**
     * Get statistics
     */
    static async getStats(centerId?: string) {
        await connectDB()

        const query = centerId ? { centerId } : {}

        const [total, active, completed, dropped] = await Promise.all([
            Student.countDocuments(query),
            Student.countDocuments({ ...query, status: 'active' }),
            Student.countDocuments({ ...query, status: 'completed' }),
            Student.countDocuments({ ...query, status: 'dropped' })
        ])

        return { total, active, completed, dropped }
    }

    /**
     * Search students
     */
    static async search(searchTerm: string, centerId?: string) {
        await connectDB()

        const query: Record<string, unknown> = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { fatherName: { $regex: searchTerm, $options: 'i' } },
                { motherName: { $regex: searchTerm, $options: 'i' } }
            ]
        }

        if (centerId) {
            query.centerId = centerId
        }

        const students = await Student.find(query)
            .populate('courseId', 'name code')
            .limit(50)
            .lean()

        return students
    }
}
