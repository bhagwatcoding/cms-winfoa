import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmitCard extends Document {
    studentId: mongoose.Types.ObjectId;
    centerId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    studentName: string;
    enrollmentId: string;
    rollNumber: string;
    courseName: string;
    examDate: Date;
    examTime: string;
    examCenter: string;
    examCenterAddress: string;
    status: 'available' | 'pending' | 'not-eligible';
    admitCardUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const AdmitCardSchema = new Schema<IAdmitCard>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        centerId: {
            type: Schema.Types.ObjectId,
            ref: 'Center',
            required: true,
            index: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,
        },
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        enrollmentId: {
            type: String,
            required: true,
            index: true,
        },
        rollNumber: {
            type: String,
            required: true,
            index: true,
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        examDate: {
            type: Date,
            required: true,
            index: true,
        },
        examTime: {
            type: String,
            required: true,
        },
        examCenter: {
            type: String,
            required: true,
            trim: true,
        },
        examCenterAddress: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['available', 'pending', 'not-eligible'],
            default: 'pending',
            index: true,
        },
        admitCardUrl: {
            type: String,
            trim: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
AdmitCardSchema.index({ studentId: 1, examDate: -1 });
AdmitCardSchema.index({ centerId: 1, status: 1, examDate: -1 });
AdmitCardSchema.index({ enrollmentId: 1, rollNumber: 1 });

// Create admit card
AdmitCardSchema.statics.createAdmitCard = async function (data: {
    studentId: string;
    centerId: string;
    courseId: string;
    studentName: string;
    enrollmentId: string;
    rollNumber: string;
    courseName: string;
    examDate: Date;
    examTime: string;
    examCenter: string;
    examCenterAddress: string;
}) {
    return await this.create({
        ...data,
        status: 'pending',
    });
};

// Make admit card available
AdmitCardSchema.methods.makeAvailable = async function (admitCardUrl?: string) {
    this.status = 'available';
    if (admitCardUrl) {
        this.admitCardUrl = admitCardUrl;
    }
    return await this.save();
};

// Get upcoming exams
AdmitCardSchema.statics.getUpcomingExams = async function (centerId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.find({
        centerId: new mongoose.Types.ObjectId(centerId),
        examDate: { $gte: today },
        status: { $in: ['available', 'pending'] },
    })
        .sort({ examDate: 1 })
        .limit(10)
        .lean();
};

const AdmitCard: Model<IAdmitCard> =
    mongoose.models.AdmitCard || mongoose.model<IAdmitCard>('AdmitCard', AdmitCardSchema);

export default AdmitCard;
