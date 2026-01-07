import mongoose, { Schema, Document } from 'mongoose'

export interface IApiRequest extends Document {
    apiKeyId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    method: string
    path: string
    statusCode: number
    responseTime: number
    ipAddress: string
    userAgent: string
    requestBody?: any
    responseBody?: any
    error?: string
    timestamp: Date
}

const ApiRequestSchema = new Schema<IApiRequest>({
    apiKeyId: {
        type: Schema.Types.ObjectId,
        ref: 'ApiKey',
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    path: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    requestBody: {
        type: Schema.Types.Mixed
    },
    responseBody: {
        type: Schema.Types.Mixed
    },
    error: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
})

// Compound indexes for analytics
ApiRequestSchema.index({ apiKeyId: 1, timestamp: -1 })
ApiRequestSchema.index({ userId: 1, timestamp: -1 })
ApiRequestSchema.index({ path: 1, timestamp: -1 })

// Auto-delete logs older than 30 days
ApiRequestSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60 }
)

export default mongoose.models.ApiRequest ||
    mongoose.model<IApiRequest>('ApiRequest', ApiRequestSchema)
