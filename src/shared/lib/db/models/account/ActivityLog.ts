import mongoose, { Schema, Document } from 'mongoose'

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId
    action: string
    resource: string
    details: any
    ipAddress: string
    userAgent: string
    location?: string
    timestamp: Date
}

const ActivityLogSchema = new Schema<IActivityLog>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'password_change',
            'email_change',
            'profile_update',
            'settings_update',
            'account_delete',
            'api_key_created',
            'api_key_deleted',
            'oauth_connected',
            'oauth_disconnected',
            'two_factor_enabled',
            'two_factor_disabled'
        ]
    },
    resource: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    location: { type: String },
    timestamp: { type: Date, default: Date.now }
})

// Compound index for efficient queries
ActivityLogSchema.index({ userId: 1, timestamp: -1 })

// Auto-delete logs older than 90 days
ActivityLogSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 }
)

export default mongoose.models.ActivityLog ||
    mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
