import { Course, Student } from '@/models'
import connectDB from '@/lib/db'

export class CourseService {
    /**
     * Get all courses
     */
    static async getAll() {
        await connectDB()

        const courses = await Course.find()
            .sort({ name: 1 })
            .lean()

        return courses
    }

    /**
     * Get course by ID
     */
    static async getById(id: string) {
        await connectDB()

        const course = await Course.findById(id).lean()

        if (!course) {
            throw new Error('Course not found')
        }

        return course
    }

    /**
     * Create course
     */
    static async create(data: {
        name: string
        code: string
        duration: string
        fee: number
    }) {
        await connectDB()

        // Check if course code already exists
        const existing = await Course.findOne({ code: data.code })
        if (existing) {
            throw new Error('Course code already exists')
        }

        const course = await Course.create(data)
        return course
    }

    /**
     * Update course
     */
    static async update(id: string, data: any) {
        await connectDB()

        // If updating code, check uniqueness
        if (data.code) {
            const existing = await Course.findOne({
                code: data.code,
                _id: { $ne: id }
            })
            if (existing) {
                throw new Error('Course code already exists')
            }
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        )

        if (!course) {
            throw new Error('Course not found')
        }

        return course
    }

    /**
     * Delete course
     */
    static async delete(id: string) {
        await connectDB()

        // Check if course has students
        const studentCount = await Student.countDocuments({ courseId: id })
        if (studentCount > 0) {
            throw new Error(`Cannot delete course. ${studentCount} students are enrolled.`)
        }

        const course = await Course.findByIdAndDelete(id)

        if (!course) {
            throw new Error('Course not found')
        }

        return course
    }

    /**
     * Get course statistics
     */
    static async getStats(courseId?: string) {
        await connectDB()

        if (courseId) {
            const studentCount = await Student.countDocuments({ courseId })
            const course = await Course.findById(courseId)

            return {
                courseId,
                courseName: course?.name,
                totalStudents: studentCount,
                activeStudents: await Student.countDocuments({
                    courseId,
                    status: 'active'
                }),
                completedStudents: await Student.countDocuments({
                    courseId,
                    status: 'completed'
                })
            }
        }

        // Overall stats
        const totalCourses = await Course.countDocuments()
        return { totalCourses }
    }
}
