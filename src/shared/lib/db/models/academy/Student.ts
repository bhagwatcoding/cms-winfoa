import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    fatherName: string;
    motherName: string;
    dob: Date;
    gender: 'male' | 'female' | 'other';
    centerId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    admissionDate: Date;
    profileImage?: string;
    status: 'active' | 'completed' | 'dropped';
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    admissionDate: { type: Date, default: Date.now },
    profileImage: { type: String },
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
}, { timestamps: true });

// Indexes for performance
StudentSchema.index({ centerId: 1, status: 1 });
StudentSchema.index({ courseId: 1, admissionDate: -1 });
StudentSchema.index({ status: 1, admissionDate: -1 });


export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
