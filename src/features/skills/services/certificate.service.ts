import { Certificate, Student, Course } from '@/models'
import connectDB from '@/lib/db'

export class CertificateService {
    /**
     * Get all certificates
     */
    static async getAll(filters?: {
        studentId?: string
        courseId?: string
    }) {
        await connectDB()

        const query: any = {}
        if (filters?.studentId) query.studentId = filters.studentId
        if (filters?.courseId) query.courseId = filters.courseId

        const certificates = await Certificate.find(query)
            .populate('studentId', 'name fatherName')
            .populate('courseId', 'name code')
            .sort({ issueDate: -1 })
            .lean()

        return certificates
    }

    /**
     * Get certificate by ID
     */
    static async getById(id: string) {
        await connectDB()

        const certificate = await Certificate.findById(id)
            .populate('studentId')
            .populate('courseId')
            .lean()

        if (!certificate) {
            throw new Error('Certificate not found')
        }

        return certificate
    }

    /**
     * Get certificate by certificate number
     */
    static async getByCertificateNumber(certNo: string) {
        await connectDB()

        const certificate = await Certificate.findOne({ certificateNo: certNo })
            .populate('studentId', 'name fatherName motherName dob')
            .populate('courseId', 'name code duration')
            .lean()

        return certificate
    }

    /**
     * Create certificate
     */
    static async create(data: any) {
        await connectDB()

        // Generate certificate number if not provided
        if (!data.certificateNo) {
            data.certificateNo = await this.generateCertificateNumber()
        }

        // Validate student
        const student = await Student.findById(data.studentId)
        if (!student) {
            throw new Error('Student not found')
        }

        // Validate course
        const course = await Course.findById(data.courseId)
        if (!course) {
            throw new Error('Course not found')
        }

        const certificate = await Certificate.create(data)
        return certificate
    }

    /**
     * Update certificate
     */
    static async update(id: string, data: any) {
        await connectDB()

        const certificate = await Certificate.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('studentId').populate('courseId')

        if (!certificate) {
            throw new Error('Certificate not found')
        }

        return certificate
    }

    /**
     * Delete certificate
     */
    static async delete(id: string) {
        await connectDB()

        const certificate = await Certificate.findByIdAndDelete(id)

        if (!certificate) {
            throw new Error('Certificate not found')
        }

        return certificate
    }

    /**
     * Generate unique certificate number
     */
    static async generateCertificateNumber(): Promise<string> {
        const year = new Date().getFullYear()
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()

        return `CERT-${year}-${random}-${timestamp.toString().slice(-6)}`
    }

    /**
     * Verify certificate
     */
    static async verify(certNo: string) {
        const certificate = await this.getByCertificateNumber(certNo)

        if (!certificate) {
            return {
                valid: false,
                message: 'Certificate not found'
            }
        }

        return {
            valid: true,
            certificate,
            message: 'Certificate is valid'
        }
    }
}
