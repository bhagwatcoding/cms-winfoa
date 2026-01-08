import mongoose, { Schema, Document } from 'mongoose'

export interface IUserRegistry extends Document {
    userId: string // Unique user ID (e.g., WIN-2024-0001)
    email: string
    role: string
    status: 'active' | 'inactive' | 'pending'
    createdBy: mongoose.Types.ObjectId | string
    registeredAt: Date
    metadata: {
        subdomain?: string
        source?: string
        [key: string]: any
    }
}

const UserRegistrySchema = new Schema<IUserRegistry>(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            required: true,
            enum: ['super-admin', 'admin', 'staff', 'student', 'user', 'center']
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'pending'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    { timestamps: true }
)

// Auto-increment counter for user IDs
const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
})

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema)

// Generate next user ID
UserRegistrySchema.statics.generateUserId = async function () {
    const year = new Date().getFullYear()
    const counter = await Counter.findByIdAndUpdate(
        'userId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )

    const paddedNum = String(counter.seq).padStart(6, '0')
    return `WIN-${year}-${paddedNum}`
}

export default mongoose.models.UserRegistry ||
    mongoose.model<IUserRegistry>('UserRegistry', UserRegistrySchema)
