import connectDB from '@/lib/db';
import Employee from '@/lib/models/edu/Employee';
import { getSession } from '@/lib/auth';

export class EmployeeService {
    static async getAll(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};
        return await Employee.find(query)
            .sort({ createdAt: -1 })
            .lean();
    }

    static async getById(id: string) {
        await connectDB();
        return await Employee.findById(id).lean();
    }

    static async create(data: any) {
        await connectDB();
        const { user } = await getSession();

        if (!user || !user.centerId) {
            throw new Error('Authentication required');
        }

        const employeeData = {
            ...data,
            centerId: user.centerId
        };

        return await Employee.create(employeeData);
    }

    static async update(id: string, data: any) {
        await connectDB();
        return await Employee.findByIdAndUpdate(id, data, { new: true });
    }

    static async delete(id: string) {
        await connectDB();
        return await Employee.findByIdAndDelete(id);
    }

    static async getStats(centerId?: string) {
        await connectDB();
        const query = centerId ? { centerId } : {};

        const [total, active, inactive] = await Promise.all([
            Employee.countDocuments(query),
            Employee.countDocuments({ ...query, status: 'active' }),
            Employee.countDocuments({ ...query, status: 'inactive' }),
        ]);

        return { total, active, inactive };
    }
}
