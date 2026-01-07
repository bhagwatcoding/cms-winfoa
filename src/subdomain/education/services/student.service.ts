import connectDB from '@/lib/db';
import Student from '@/lib/models/edu/Student';
import { getSession } from '@/lib/auth';

export class StudentService {
    static async getAll(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};
        return await Student.find(query)
            .populate('courseId', 'name code')
            .populate('centerId', 'name code')
            .sort({ createdAt: -1 })
            .lean();
    }

    static async getById(id: string) {
        await connectDB();
        return await Student.findById(id)
            .populate('courseId')
            .populate('centerId')
            .lean();
    }

    static async create(data: any) {
        await connectDB();
        const { user } = await getSession();

        if (!user || !user.centerId) {
            throw new Error('Authentication required');
        }

        const studentData = {
            ...data,
            centerId: user.centerId
        };

        return await Student.create(studentData);
    }

    static async update(id: string, data: any) {
        await connectDB();
        return await Student.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        await connectDB();
        return await Student.findByIdAndDelete(id);
    }

    static async getStats(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};

        const [total, active, completed, dropped] = await Promise.all([
            Student.countDocuments(query),
            Student.countDocuments({ ...query, status: 'active' }),
            Student.countDocuments({ ...query, status: 'completed' }),
            Student.countDocuments({ ...query, status: 'dropped' }),
        ]);

        return { total, active, completed, dropped };
    }

    static async search(searchTerm: string, centerId?: string) {
        await connectDB();
        const query: any = centerId ? { centerId } : {};

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { fatherName: { $regex: searchTerm, $options: 'i' } },
                { motherName: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        return await Student.find(query)
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();
    }
}
