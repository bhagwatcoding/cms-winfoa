import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    name: string;
    code: string;
    duration: string; // e.g., "6 Months"
    fee: number;
}

const CourseSchema: Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    duration: { type: String, required: true },
    fee: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
