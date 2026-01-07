import mongoose, { Schema, Document } from 'mongoose'

export interface IUserPreferences extends Document {
    userId: mongoose.Types.ObjectId
    emailNotifications: {
        marketing: boolean
        updates: boolean
        security: boolean
        newsletter: boolean
    }
    pushNotifications: {
        enabled: boolean
        browser: boolean
        mobile: boolean
    }
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends'
        showEmail: boolean
        showActivity: boolean
    }
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    createdAt: Date
    updatedAt: Date
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true
        },
        emailNotifications: {
            marketing: { type: Boolean, default: false },
            updates: { type: Boolean, default: true },
            security: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: false }
        },
        pushNotifications: {
            enabled: { type: Boolean, default: false },
            browser: { type: Boolean, default: false },
            mobile: { type: Boolean, default: false }
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: ['public', 'private', 'friends'],
                default: 'public'
            },
            showEmail: { type: Boolean, default: false },
            showActivity: { type: Boolean, default: true }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'UTC' }
    },
    { timestamps: true }
)

export default mongoose.models.UserPreferences ||
    mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema)
