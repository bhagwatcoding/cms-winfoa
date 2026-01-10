import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// User Interface - Globally accessible type
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    umpUserId?: string // UMP-generated unique user ID (WIN-YYYY-XXXXXX)
    name: string
    firstName?: string
    lastName?: string
    email: string
    password?: string
    image?: string
    avatar?: string
    role: 'super-admin' | 'admin' | 'staff' | 'student' | 'user' | 'center'
    phone?: string
    status: 'active' | 'inactive' | 'on-leave'
    centerId?: mongoose.Types.ObjectId
    joinedAt: Date
    oauthProvider?: 'google' | 'github'
    oauthId?: string
    emailVerified: boolean
    isActive: boolean
    lastLogin?: Date

    customPermissions?: string[] // Additional permissions beyond role
    permissionOverrides?: string[] // Override role permissions
    walletBalance?: number;

    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

// User Schema
const UserSchema = new Schema<IUser>(
    {
        umpUserId: {
            type: String,
            unique: true,
            sparse: true
        },
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        firstName: { type: String },
        lastName: { type: String },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            select: false,
            minlength: [6, 'Password must be at least 6 characters']
        },
        image: { type: String },
        avatar: { type: String },
        role: {
            type: String,
            enum: ['super-admin', 'admin', 'staff', 'student', 'user', 'center'],
            default: 'user'
        },
        phone: {
            type: String,
            sparse: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'on-leave'],
            default: 'active'
        },
        centerId: {
            type: Schema.Types.ObjectId,
            ref: 'Center'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        oauthProvider: {
            type: String,
            enum: ['google', 'github']
        },
        oauthId: {
            type: String,
            sparse: true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        },
        // ✨ NEW: Custom Permissions (Database-driven)
        customPermissions: {
            type: [String],
            default: []
        },
        permissionOverrides: {
            type: [String],
            default: []
        },
        walletBalance: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password
                return ret
            }
        }
    }
)

// Indexes for performance (no need for email/umpUserId as they're already indexed via unique constraint)
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ centerId: 1, status: 1 }) // Compound index for center queries


// Hash password before saving
// Hash password before saving
UserSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return
    }

    // Only hash if password exists
    if (this.password) {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        if (!this.password) {
            return false
        }
        return await bcrypt.compare(candidatePassword, this.password)
    } catch {
        return false
    }
}

// Static method to find by email
UserSchema.statics.findByEmail = async function (email: string) {
    return this.findOne({ email: email.toLowerCase().trim() })
}

// Static method to find active users
UserSchema.statics.findActive = async function () {
    return this.find({ isActive: true })
}

// Export User Model - Globally accessible
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
