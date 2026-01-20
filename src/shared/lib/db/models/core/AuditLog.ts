import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import { IGeoInfo, IDeviceInfo } from "@/types";

// ==========================================
// AUDIT LOG MODEL
// Immutable system-wide audit trail (GDPR/SOC2)
// ==========================================

export enum AuditSeverity {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    CRITICAL = 4,
}

export enum AuditCategory {
    AUTH = "auth",
    USER = "user",
    ROLE = "role",
    PERMISSION = "permission",
    SESSION = "session",
    API = "api",
    SYSTEM = "system",
    DATA = "data",
    SECURITY = "security",
    BILLING = "billing",
}

export interface IAuditActor {
    userId?: mongoose.Types.ObjectId;
    email?: string;
    name?: string;
    role?: string;
    ip?: string;
    isSystem?: boolean; // For automated system actions
}

export interface IAuditTarget {
    model?: string; // "User", "Role", etc.
    documentId?: string;
    field?: string; // Specific field changed
    previousValue?: unknown;
    newValue?: unknown;
    changes?: Record<string, { from: unknown; to: unknown }>;
}

export interface IAuditContext {
    requestId?: string;
    sessionId?: string;
    userAgent?: string;
    duration?: number; // Action duration in ms
    source?: string; // "web", "api", "cli", "cron"
}

export interface IAuditLog extends Document {
    // Event identification
    eventType: string; // "auth.login", "user.update"
    category: AuditCategory;
    severity: AuditSeverity;

    // Actor (who did it)
    actor: IAuditActor;

    // Target (what was affected)
    target?: IAuditTarget;

    // Context
    context?: IAuditContext;
    geoInfo?: IGeoInfo;
    deviceInfo?: Partial<IDeviceInfo>;

    // Message
    message: string;
    details?: Record<string, unknown>;

    // Immutability
    checksumHash?: string; // SHA-256 of the log for tamper detection

    // Timestamps
    timestamp: Date;
    expiresAt?: Date; // TTL for auto-cleanup (90 days default)
}

// Static methods
interface IAuditLogModel extends Model<IAuditLog> {
    log(params: {
        eventType: string;
        category: AuditCategory;
        severity?: AuditSeverity;
        actor: IAuditActor;
        target?: IAuditTarget;
        context?: IAuditContext;
        message: string;
        details?: Record<string, unknown>;
        geoInfo?: IGeoInfo;
        deviceInfo?: Partial<IDeviceInfo>;
    }): Promise<IAuditLog>;
    findByUser(userId: string, limit?: number): Promise<IAuditLog[]>;
    findByCategory(category: AuditCategory, limit?: number): Promise<IAuditLog[]>;
    findCritical(limit?: number): Promise<IAuditLog[]>;
    getSecurityEvents(days?: number): Promise<IAuditLog[]>;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        eventType: {
            type: String,
            required: [true, "Event type is required"],
            index: true,
        },
        category: {
            type: String,
            enum: Object.values(AuditCategory),
            required: [true, "Category is required"],
            index: true,
        },
        severity: {
            type: Number,
            enum: Object.values(AuditSeverity).filter((v) => typeof v === "number"),
            default: AuditSeverity.INFO,
            index: true,
        },

        // Actor
        actor: {
            userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
            email: String,
            name: String,
            role: String,
            ip: String,
            isSystem: { type: Boolean, default: false },
        },

        // Target
        target: {
            model: String,
            documentId: String,
            field: String,
            previousValue: Schema.Types.Mixed,
            newValue: Schema.Types.Mixed,
            changes: Schema.Types.Mixed,
        },

        // Context
        context: {
            requestId: String,
            sessionId: String,
            userAgent: String,
            duration: Number,
            source: { type: String, default: "web" },
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

        message: {
            type: String,
            required: [true, "Message is required"],
        },
        details: {
            type: Schema.Types.Mixed,
            default: {},
        },

        checksumHash: String,

        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            index: true,
        },
    },
    {
        timestamps: false, // We use our own timestamp field
        collection: "audit_logs",
    }
);

// ==========================================
// INDEXES
// ==========================================

// Compound indexes for common queries
AuditLogSchema.index({ "actor.userId": 1, timestamp: -1 });
AuditLogSchema.index({ category: 1, timestamp: -1 });
AuditLogSchema.index({ eventType: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });

// TTL index for auto-cleanup
AuditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ==========================================
// STATIC METHODS
// ==========================================

AuditLogSchema.statics.log = async function (params: {
    eventType: string;
    category: AuditCategory;
    severity?: AuditSeverity;
    actor: IAuditActor;
    target?: IAuditTarget;
    context?: IAuditContext;
    message: string;
    details?: Record<string, unknown>;
    geoInfo?: IGeoInfo;
    deviceInfo?: Partial<IDeviceInfo>;
}): Promise<IAuditLog> {
    const log = new this({
        ...params,
        severity: params.severity ?? AuditSeverity.INFO,
        timestamp: new Date(),
    });
    return log.save();
};

AuditLogSchema.statics.findByUser = function (
    userId: string,
    limit = 100
): Promise<IAuditLog[]> {
    return this.find({ "actor.userId": userId })
        .sort({ timestamp: -1 })
        .limit(limit);
};

AuditLogSchema.statics.findByCategory = function (
    category: AuditCategory,
    limit = 100
): Promise<IAuditLog[]> {
    return this.find({ category }).sort({ timestamp: -1 }).limit(limit);
};

AuditLogSchema.statics.findCritical = function (limit = 50): Promise<IAuditLog[]> {
    return this.find({ severity: { $gte: AuditSeverity.ERROR } })
        .sort({ timestamp: -1 })
        .limit(limit);
};

AuditLogSchema.statics.getSecurityEvents = function (
    days = 7
): Promise<IAuditLog[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({
        category: AuditCategory.SECURITY,
        timestamp: { $gte: since },
    }).sort({ timestamp: -1 });
};

// ==========================================
// PRE-SAVE HOOKS
// ==========================================

AuditLogSchema.pre("save", function () {
    // Generate checksum for tamper detection
    if (!this.checksumHash && this.eventType) {
        const crypto = require("crypto");
        const dataString = JSON.stringify({
            eventType: this.eventType,
            actor: this.actor,
            target: this.target,
            timestamp: this.timestamp,
        });
        this.checksumHash = crypto.createHash("sha256").update(dataString).digest("hex");
    }
});

// Make audit logs immutable after creation
AuditLogSchema.pre("updateOne", function () {
    throw new Error("Audit logs are immutable and cannot be updated.");
});

AuditLogSchema.pre("findOneAndUpdate", function () {
    throw new Error("Audit logs are immutable and cannot be updated.");
});

// ==========================================
// EXPORT
// ==========================================

export default (models.AuditLog as IAuditLogModel) ||
    model<IAuditLog, IAuditLogModel>("AuditLog", AuditLogSchema);
