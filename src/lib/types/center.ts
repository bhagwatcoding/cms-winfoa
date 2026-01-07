import { Types } from 'mongoose';

export interface ICenter {
    _id?: Types.ObjectId;
    name: string;
    code: string;
    address: string;
    contact: string;
    walletBalance: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    image?: string;
    role: 'admin' | 'staff' | 'student';
    centerId: Types.ObjectId;
    joinedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IStudent {
    _id?: Types.ObjectId;
    name: string;
    fatherName: string;
    motherName: string;
    dob: Date;
    gender: 'male' | 'female' | 'other';
    centerId: Types.ObjectId;
    courseId: Types.ObjectId;
    admissionDate: Date;
    profileImage?: string;
    status: 'active' | 'completed' | 'dropped';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICourse {
    _id?: Types.ObjectId;
    name: string;
    code: string;
    duration: string;
    fee: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DashboardStats {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
    totalRevenue: number;
    walletBalance: number;
}
