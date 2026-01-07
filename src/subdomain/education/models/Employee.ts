import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    email: string;
    phone: string;
    role: string;
    designation: string;
    department: string;
    salary?: number;
    joiningDate: Date;
    profileImage?: string;
    status: 'active' | 'inactive' | 'on-leave';
    address?: string;
    centerId: mongoose.Types.ObjectId;
}

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number },
    joiningDate: { type: Date, default: Date.now },
    profileImage: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
    address: { type: String },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
