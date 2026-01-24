import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import { IGeoInfo, IDeviceInfo } from "@/types";

// ==========================================
// LOGIN ATTEMPT MODEL
// Track login attempts for security analysis
// ==========================================

export enum LoginAttemptResult {
    SUCCESS = "success",
    FAILED_PASSWORD = "failed_password",
    FAILED_2FA = "failed_2fa",
    ACCOUNT_LOCKED = "account_locked",
    ACCOUNT_INACTIVE = "account_inactive",
    USER_NOT_FOUND = "user_not_found",
    RATE_LIMITED = "rate_limited",
    BLOCKED_IP = "blocked_ip",
    SUSPICIOUS = "suspicious",
}

export interface ILoginAttempt extends Document {
    // User identification
    email: string;
    userId?: mongoose.Types.ObjectId; // If user exists

    // Result
    success: boolean;
    result: LoginAttemptResult;
    failureReason?: string;

    // Request context
    ipAddress: string;
    geoInfo?: IGeoInfo;
    deviceInfo?: Partial<IDeviceInfo>;
    userAgent?: string;

    // Risk assessment
    riskScore?: number;
    riskFactors?: string[];
    isSuspicious?: boolean;

    // Timing
    attemptedAt: Date;
    expiresAt: Date; // Auto-cleanup

    // Session (if login was successful)
    sessionId?: mongoose.Types.ObjectId;
}

// Static methods
interface ILoginAttemptModel extends Model<ILoginAttempt> {
    record(params: {
        email: string;
        userId?: mongoose.Types.ObjectId;
        success: boolean;
        result: LoginAttemptResult;
        failureReason?: string;
        ipAddress: string;
        geoInfo?: IGeoInfo;
        deviceInfo?: Partial<IDeviceInfo>;
        userAgent?: string;
    }): Promise<ILoginAttempt>;
    getFailedAttempts(email: string, since?: Date): Promise<number>;
    getFailedAttemptsFromIp(ipAddress: string, since?: Date): Promise<number>;
    getRecentByEmail(email: string, limit?: number): Promise<ILoginAttempt[]>;
    getRecentByIp(ipAddress: string, limit?: number): Promise<ILoginAttempt[]>;
    getSuspiciousAttempts(since?: Date): Promise<ILoginAttempt[]>;
    isIpBlocked(ipAddress: string): Promise<boolean>;
}

const LoginAttemptSchema = new Schema<ILoginAttempt>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        success: {
            type: Boolean,
            required: true,
            index: true,
        },
        result: {
            type: String,
            enum: Object.values(LoginAttemptResult),
            required: [true, "Result is required"],
            index: true,
        },
        failureReason: String,

        ipAddress: {
            type: String,
            required: [true, "IP address is required"],
            index: true,
        },
        geoInfo: {
            ip: String,
            country: String,
            countryCode: String,
            city: String,
            region: String,
            timezone: String,
            coordinates: {
                lat: Number,
                long: Number,
            },
            isp: String,
        },
        deviceInfo: {
            browser: String,
            browserVersion: String,
            os: String,
            osVersion: String,
            device: String,
            isMobile: Boolean,
        },
        userAgent: String,

        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        riskFactors: {
            type: [String],
            default: [],
        },
        isSuspicious: {
            type: Boolean,
            default: false,
            index: true,
        },

        attemptedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            index: true,
        },

        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "Session",
        },
    },
    {
        timestamps: false,
        collection: "login_attempts",
    }
);

// ==========================================
// INDEXES
// ==========================================

// Compound indexes for analytics
LoginAttemptSchema.index({ email: 1, attemptedAt: -1 });
LoginAttemptSchema.index({ ipAddress: 1, attemptedAt: -1 });
LoginAttemptSchema.index({ success: 1, attemptedAt: -1 });

// TTL index for auto-cleanup
LoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ==========================================
// STATIC METHODS
// ==========================================

LoginAttemptSchema.statics.record = async function (params: {
    email: string;
    userId?: mongoose.Types.ObjectId;
    success: boolean;
    result: LoginAttemptResult;
    failureReason?: string;
    ipAddress: string;
    geoInfo?: IGeoInfo;
    deviceInfo?: Partial<IDeviceInfo>;
    userAgent?: string;
}): Promise<ILoginAttempt> {
    // Calculate risk score
    let riskScore = 0;
    const riskFactors: string[] = [];

    if (!params.success) {
        riskScore += 20;
        riskFactors.push("failed_attempt");
    }

    // Check for multiple failed attempts from this email
    const recentFailures = await (this as any).getFailedAttempts(
        params.email,
        new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
    );

    if (recentFailures >= 3) {
        riskScore += 30;
        riskFactors.push("multiple_failures");
    }

    // Check for multiple failed attempts from this IP
    const ipFailures = await (this as any).getFailedAttemptsFromIp(
        params.ipAddress,
        new Date(Date.now() - 15 * 60 * 1000)
    );

    if (ipFailures >= 5) {
        riskScore += 40;
        riskFactors.push("ip_brute_force");
    }

    const isSuspicious = riskScore >= 50;

    return this.create({
        ...params,
        riskScore,
        riskFactors,
        isSuspicious,
        attemptedAt: new Date(),
    });
};

LoginAttemptSchema.statics.getFailedAttempts = function (
    email: string,
    since?: Date
): Promise<number> {
    const query: Record<string, unknown> = {
        email,
        success: false,
    };
    if (since) {
        query.attemptedAt = { $gte: since };
    }
    return this.countDocuments(query);
};

LoginAttemptSchema.statics.getFailedAttemptsFromIp = function (
    ipAddress: string,
    since?: Date
): Promise<number> {
    const query: Record<string, unknown> = {
        ipAddress,
        success: false,
    };
    if (since) {
        query.attemptedAt = { $gte: since };
    }
    return this.countDocuments(query);
};

LoginAttemptSchema.statics.getRecentByEmail = function (
    email: string,
    limit = 20
): Promise<ILoginAttempt[]> {
    return this.find({ email }).sort({ attemptedAt: -1 }).limit(limit);
};

LoginAttemptSchema.statics.getRecentByIp = function (
    ipAddress: string,
    limit = 20
): Promise<ILoginAttempt[]> {
    return this.find({ ipAddress }).sort({ attemptedAt: -1 }).limit(limit);
};

LoginAttemptSchema.statics.getSuspiciousAttempts = function (
    since?: Date
): Promise<ILoginAttempt[]> {
    const query: Record<string, unknown> = { isSuspicious: true };
    if (since) {
        query.attemptedAt = { $gte: since };
    }
    return this.find(query).sort({ attemptedAt: -1 }).limit(100);
};

LoginAttemptSchema.statics.isIpBlocked = async function (
    ipAddress: string
): Promise<boolean> {
    const recentFailures = await (this as any).getFailedAttemptsFromIp(
        ipAddress,
        new Date(Date.now() - 15 * 60 * 1000)
    );
    return recentFailures >= 10; // Block after 10 failures in 15 minutes
};

// ==========================================
// EXPORT
// ==========================================

export default (mongoose.models.LoginAttempt as ILoginAttemptModel) ||
    model<ILoginAttempt, ILoginAttemptModel>("LoginAttempt", LoginAttemptSchema);
