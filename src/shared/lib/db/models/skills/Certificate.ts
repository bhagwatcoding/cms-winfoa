import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
    studentId: mongoose.Types.ObjectId;
    centerId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    grade: string;
    completionDate: Date;
    issueDate: Date;
    status: 'issued' | 'ready' | 'pending';
    certificateUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICertificateModel extends Model<ICertificate> {
    generateCertificateNumber(): string;
    createCertificate(data: {
        studentId: string;
        centerId: string;
        courseId: string;
        studentName: string;
        courseName: string;
        grade: string;
        completionDate: Date;
    }): Promise<ICertificate>;
}

const CertificateSchema = new Schema<ICertificate, ICertificateModel>(
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
        certificateNumber: {
            type: String,
            required: true,
            unique: true
        },
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        grade: {
            type: String,
            required: true,
            trim: true,
        },
        completionDate: {
            type: Date,
            required: true,
        },
        issueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['issued', 'ready', 'pending'],
            default: 'pending',
            index: true,
        },
        certificateUrl: {
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
CertificateSchema.index({ studentId: 1, status: 1 });
CertificateSchema.index({ centerId: 1, status: 1, createdAt: -1 });
CertificateSchema.index({ certificateNumber: 1 }, { unique: true });

// Generate certificate number
CertificateSchema.statics.generateCertificateNumber = function () {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT/${year}/${random}`;
};

// Create certificate
CertificateSchema.statics.createCertificate = async function (this: ICertificateModel, data: {
    studentId: string;
    centerId: string;
    courseId: string;
    studentName: string;
    courseName: string;
    grade: string;
    completionDate: Date;
}) {
    const certificateNumber = this.generateCertificateNumber();

    return await this.create({
        ...data,
        certificateNumber,
        status: 'pending',
    });
};

// Issue certificate
CertificateSchema.methods.issue = async function () {
    this.status = 'issued';
    this.issueDate = new Date();
    return await this.save();
};

const Certificate: ICertificateModel =
    (mongoose.models.Certificate as ICertificateModel) || mongoose.model<ICertificate, ICertificateModel>('Certificate', CertificateSchema);

export default Certificate;
