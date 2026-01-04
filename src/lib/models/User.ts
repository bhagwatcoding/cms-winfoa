import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'admin' | 'staff' | 'student';
    phone?: string;
    status: 'active' | 'inactive' | 'on-leave';
    centerId: mongoose.Types.ObjectId;
    joinedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, enum: ['admin', 'staff', 'student'], default: 'admin' },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center' },
    joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
