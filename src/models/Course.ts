import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
    name: string;
    code: string;
    duration: string;
    fee: number;
    description?: string;
    syllabus?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        code: { type: String, required: true, trim: true, unique: true, uppercase: true },
        duration: { type: String, required: true },
        fee: { type: Number, required: true, min: 0 },
        description: { type: String, trim: true },
        syllabus: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Virtual for student count
courseSchema.virtual('studentCount', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'courseId',
    count: true,
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export default Course;
