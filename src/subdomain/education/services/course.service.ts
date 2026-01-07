import connectDB from '@/lib/db';
import Course from '@/lib/models/edu/Course';

export class CourseService {
    static async getAll() {
        await connectDB();
        return await Course.find().sort({ name: 1 }).lean();
    }

    static async getById(id: string) {
        await connectDB();
        return await Course.findById(id).lean();
    }

    static async create(data: any) {
        await connectDB();

        // Check for duplicate course code
        const existing = await Course.findOne({ code: data.code });
        if (existing) {
            throw new Error('Course code already exists');
        }

        return await Course.create(data);
    }

    static async update(id: string, data: any) {
        await connectDB();

        // Check for duplicate code if updating
        if (data.code) {
            const existing = await Course.findOne({
                code: data.code,
                _id: { $ne: id }
            });
            if (existing) {
                throw new Error('Course code already exists');
            }
        }

        return await Course.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        await connectDB();
        return await Course.findByIdAndDelete(id);
    }

    static async getStats() {
        await connectDB();
        const total = await Course.countDocuments();
        return { total };
    }
}
