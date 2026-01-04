import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    examDate: Date;
    marks: number;
    totalMarks: number;
    grade: string;
    status: 'pass' | 'fail';
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        examDate: { type: Date, required: true },
        marks: { type: Number, required: true, min: 0 },
        totalMarks: { type: Number, required: true, min: 0 },
        grade: { type: String, required: true, trim: true, uppercase: true },
        status: { type: String, enum: ['pass', 'fail'], required: true },
        remarks: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Indexes
resultSchema.index({ studentId: 1, courseId: 1 });
resultSchema.index({ examDate: -1 });

// Virtual for percentage
resultSchema.virtual('percentage').get(function () {
    return ((this.marks / this.totalMarks) * 100).toFixed(2);
});

resultSchema.set('toJSON', { virtuals: true });
resultSchema.set('toObject', { virtuals: true });

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', resultSchema);

export default Result;
