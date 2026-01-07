import connectDB from '@/lib/db';
import Result from '@/lib/models/edu/Result';
import { getSession } from '@/lib/auth';

export class ResultService {
    static async getAll(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};
        return await Result.find(query)
            .populate('studentId', 'name')
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();
    }

    static async getById(id: string) {
        await connectDB();
        return await Result.findById(id)
            .populate('studentId')
            .populate('courseId')
            .lean();
    }

    static async create(data: any) {
        await connectDB();
        const { user } = await getSession();

        if (!user || !user.centerId) {
            throw new Error('Authentication required');
        }

        const resultData = {
            ...data,
            centerId: user.centerId
        };

        return await Result.create(resultData);
    }

    static async update(id: string, data: any) {
        await connectDB();
        return await Result.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        await connectDB();
        return await Result.findByIdAndDelete(id);
    }

    static async getStats(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};

        const [total, passed, failed] = await Promise.all([
            Result.countDocuments(query),
            Result.countDocuments({ ...query, status: 'pass' }),
            Result.countDocuments({ ...query, status: 'fail' }),
        ]);

        const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

        return { total, passed, failed, passPercentage };
    }

    static async getByStudent(studentId: string) {
        await connectDB();
        return await Result.find({ studentId })
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();
    }
}
