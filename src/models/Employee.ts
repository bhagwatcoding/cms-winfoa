import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    role: string;
    email: string;
    phone: string;
    status: 'active' | 'on-leave' | 'inactive';
    joinDate: Date;
    salary?: number;
    address?: string;
    emergencyContact?: string;
    createdAt: Date;
    updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        phone: { type: String, required: true, trim: true },
        status: { type: String, enum: ['active', 'on-leave', 'inactive'], default: 'active' },
        joinDate: { type: Date, default: Date.now },
        salary: { type: Number, min: 0 },
        address: { type: String, trim: true },
        emergencyContact: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
employeeSchema.index({ name: 'text', role: 'text' });
employeeSchema.index({ status: 1 });

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
