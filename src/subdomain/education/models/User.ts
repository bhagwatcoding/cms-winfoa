import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    umpUserId?: string; // UMP-generated unique user ID (WIN-YYYY-XXXXXX)
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    image?: string;
    avatar?: string;
    role: 'super-admin' | 'admin' | 'staff' | 'student' | 'user' | 'center';
    phone?: string;
    status: 'active' | 'inactive' | 'on-leave';
    centerId?: mongoose.Types.ObjectId;
    joinedAt: Date;
    oauthProvider?: 'google' | 'github';
    oauthId?: string;
    emailVerified: boolean;
    isActive: boolean;
    lastLogin?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    umpUserId: { type: String, unique: true, sparse: true }, // UMP-generated ID
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: { type: String },
    avatar: { type: String },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'staff', 'student', 'user', 'center'],
        default: 'student'
    },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center' },
    joinedAt: { type: Date, default: Date.now },
    oauthProvider: { type: String, enum: ['google', 'github'] },
    oauthId: { type: String },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async () => {
    if (!this.isModified('password')) return null;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error: any) {
        console.log(error.message);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async (candidatePassword: string): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, this.password as string);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
