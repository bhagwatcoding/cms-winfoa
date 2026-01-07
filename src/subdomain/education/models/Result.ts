import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    examDate: Date;
    marks: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    status: 'pass' | 'fail' | 'pending';
    remarks?: string;
    centerId: mongoose.Types.ObjectId;
}

const ResultSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    examDate: { type: Date, required: true },
    marks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: {
        type: Number,
        default: function (this: IResult) {
            return (this.marks / this.totalMarks) * 100;
        }
    },
    grade: { type: String, required: true },
    status: { type: String, enum: ['pass', 'fail', 'pending'], required: true },
    remarks: { type: String },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
}, { timestamps: true });

// Index for faster queries
ResultSchema.index({ studentId: 1, courseId: 1, examDate: -1 });

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
