/**
 * Skills/Education Model Interfaces
 * Type definitions for student, course, certificate models
 */

import type { Document, Types } from 'mongoose';

// ==========================================
// STUDENT INTERFACE
// ==========================================

export interface IStudent extends Document {
    _id: Types.ObjectId;
    name: string;
    fatherName: string;
    motherName: string;
    dob: Date;
    gender: Gender;
    centerId: Types.ObjectId;
    courseId: Types.ObjectId;
    admissionDate: Date;
    profileImage?: string;
    status: StudentStatus;
    email?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Gender = 'male' | 'female' | 'other';
export type StudentStatus = 'active' | 'completed' | 'dropped';

// ==========================================
// COURSE INTERFACE
// ==========================================

export interface ICourse extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    duration: number; // in months
    fees: number;
    centerId: Types.ObjectId;
    isActive: boolean;
    syllabus?: string;
    prerequisites?: string;
    capacity?: number;
    category?: string;
    level?: CourseLevel;
    thumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// ==========================================
// CERTIFICATE INTERFACE
// ==========================================

export interface ICertificate extends Document {
    _id: Types.ObjectId;
    certificateNumber: string;
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    centerId: Types.ObjectId;
    issueDate: Date;
    status: CertificateStatus;
    grade?: string;
    marks?: number;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CertificateStatus = 'pending' | 'issued' | 'revoked';

// ==========================================
// RESULT INTERFACE
// ==========================================

export interface IResult extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    examDate: Date;
    marks: number;
    grade: string;
    status: ResultStatus;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ResultStatus = 'pass' | 'fail' | 'pending';

// ==========================================
// ADMIT CARD INTERFACE
// ==========================================

export interface IAdmitCard extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    centerId: Types.ObjectId;
    enrollmentId: string;
    rollNumber: string;
    examDate: Date;
    examTime?: string;
    venue?: string;
    status: AdmitCardStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type AdmitCardStatus = 'pending' | 'issued';

// ==========================================
// EMPLOYEE INTERFACE
// ==========================================

export interface IEmployee extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    centerId: Types.ObjectId;
    employeeId: string;
    designation: string;
    department?: string;
    joinDate: Date;
    salary?: number;
    status: EmployeeStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

// ==========================================
// CENTER INTERFACE
// ==========================================

export interface ICenter extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// TRANSACTION INTERFACE
// ==========================================

export interface ITransaction extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    centerId?: Types.ObjectId;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    description: string;
    reference?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

// ==========================================
// NOTIFICATION INTERFACE
// ==========================================

export interface INotification extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    centerId?: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// ==========================================
// PASSWORD RESET TOKEN INTERFACE
// ==========================================

export interface IPasswordResetToken extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
