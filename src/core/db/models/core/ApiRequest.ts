import mongoose, { Schema, Document, Model, model, models } from "mongoose";

// ==========================================
// API REQUEST MODEL
// Log individual API requests for monitoring/audit
// ==========================================

export interface IApiRequest extends Document {
    apiKeyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    method: string;
    path: string;
    statusCode: number;
    responseTime: number; // in ms
    ipAddress?: string;
    userAgent?: string;
    requestBody?: Record<string, unknown>;
    responseBody?: Record<string, unknown>;
    error?: string;
    timestamp: Date;
}

interface IApiRequestModel extends Model<IApiRequest> {
    log(params: {
        apiKeyId: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        method: string;
        path: string;
        statusCode: number;
        responseTime: number;
        ipAddress?: string;
        userAgent?: string;
        requestBody?: any;
        responseBody?: any;
        error?: string;
    }): Promise<IApiRequest>;
    getRecent(limit?: number): Promise<IApiRequest[]>;
    getStats(since?: Date): Promise<{
        total: number;
        errors: number;
        avgResponseTime: number;
    }>;
}

const ApiRequestSchema = new Schema<IApiRequest>(
    {
        apiKeyId: {
            type: Schema.Types.ObjectId,
            ref: "ApiKey",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        method: {
            type: String,
            required: true,
            uppercase: true,
        },
        path: {
            type: String,
            required: true,
        },
        statusCode: {
            type: Number,
            required: true,
            index: true,
        },
        responseTime: {
            type: Number,
            required: true,
        },
        ipAddress: String,
        userAgent: String,
        requestBody: Schema.Types.Mixed,
        responseBody: Schema.Types.Mixed,
        error: String,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: false, // We use 'timestamp' field
        collection: "api_requests",
    }
);

// ==========================================
// INDEXES
// ==========================================

// TTL Index - Auto-delete logs after 30 days
ApiRequestSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Analytics indexes
ApiRequestSchema.index({ apiKeyId: 1, timestamp: -1 });
ApiRequestSchema.index({ userId: 1, timestamp: -1 });
ApiRequestSchema.index({ method: 1, statusCode: 1 });

// ==========================================
// STATIC METHODS
// ==========================================

ApiRequestSchema.statics.log = async function (params: {
    apiKeyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    method: string;
    path: string;
    statusCode: number;
    responseTime: number;
    ipAddress?: string;
    userAgent?: string;
    requestBody?: any;
    responseBody?: any;
    error?: string;
}): Promise<IApiRequest> {
    return this.create({
        ...params,
        timestamp: new Date(),
    });
};

ApiRequestSchema.statics.getRecent = function (
    limit = 50
): Promise<IApiRequest[]> {
    return this.find().sort({ timestamp: -1 }).limit(limit);
};

ApiRequestSchema.statics.getStats = async function (
    since?: Date
): Promise<{ total: number; errors: number; avgResponseTime: number }> {
    const query: Record<string, unknown> = {};
    if (since) {
        query.timestamp = { $gte: since };
    }

    const stats = await this.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                errors: {
                    $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] },
                },
                avgResponseTime: { $avg: "$responseTime" },
            },
        },
    ]);

    return stats[0] || { total: 0, errors: 0, avgResponseTime: 0 };
};

// ==========================================
// EXPORT
// ==========================================

export default (models.ApiRequest as IApiRequestModel) ||
    model<IApiRequest, IApiRequestModel>("ApiRequest", ApiRequestSchema);
