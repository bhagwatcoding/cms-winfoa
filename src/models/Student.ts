import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    fatherName: string;
    motherName: string;
    dob: Date;
    gender: 'male' | 'female' | 'other';
    courseId: mongoose.Types.ObjectId;
    profileImage?: string;
    status: 'active' | 'completed' | 'dropped';
    joinDate: Date;
    email?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true, trim: true },
        fatherName: { type: String, required: true, trim: true },
        motherName: { type: String, required: true, trim: true },
        dob: { type: Date, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'], required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        profileImage: { type: String },
        status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
        joinDate: { type: Date, default: Date.now },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
studentSchema.index({ name: 'text' });
studentSchema.index({ status: 1 });
studentSchema.index({ courseId: 1 });

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);

export default Student;
