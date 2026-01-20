import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import crypto from "crypto";

// ==========================================
// API KEY MODEL
// API key management for developers
// ==========================================

export enum ApiKeyScope {
    READ = "read",
    WRITE = "write",
    DELETE = "delete",
    ADMIN = "admin",
}

export enum ApiKeyEnvironment {
    LIVE = "live",
    TEST = "test",
}

export interface IApiKey extends Document {
    userId: mongoose.Types.ObjectId;

    // Identification
    name: string;
    description?: string;

    // Key (only prefix and hash stored)
    keyPrefix: string; // "wf_live_abc..." (shown to user)
    keyHash: string; // Full key hash

    // Configuration
    environment: ApiKeyEnvironment;
    scopes: ApiKeyScope[];
    permissions: string[]; // Specific permission slugs

    // Limits
    rateLimit: number; // Requests per minute
    dailyLimit?: number; // Requests per day

    // Restrictions
    allowedIps?: string[];
    allowedDomains?: string[];
    allowedOrigins?: string[];

    // Usage tracking
    usageCount: number;
    lastUsedAt?: Date;
    lastUsedIp?: string;

    // Status
    isActive: boolean;
    expiresAt?: Date;
    revokedAt?: Date;
    revokedBy?: mongoose.Types.ObjectId;
    revokedReason?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Static methods
interface IApiKeyModel extends Model<IApiKey> {
    generate(params: {
        userId: mongoose.Types.ObjectId;
        name: string;
        environment?: ApiKeyEnvironment;
        scopes?: ApiKeyScope[];
        permissions?: string[];
        rateLimit?: number;
        allowedIps?: string[];
        allowedDomains?: string[];
        expiresAt?: Date;
    }): Promise<{ key: string; record: IApiKey }>;
    findByKey(key: string): Promise<IApiKey | null>;
    validateKey(key: string, requiredScope?: ApiKeyScope): Promise<{
        valid: boolean;
        apiKey?: IApiKey;
        reason?: string;
    }>;
    getByUser(userId: mongoose.Types.ObjectId): Promise<IApiKey[]>;
    revoke(
        keyId: mongoose.Types.ObjectId,
        revokedBy: mongoose.Types.ObjectId,
        reason?: string
    ): Promise<IApiKey | null>;
    recordUsage(keyId: mongoose.Types.ObjectId, ip?: string): Promise<void>;
}

const ApiKeySchema = new Schema<IApiKey>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        name: {
            type: String,
            required: [true, "API key name is required"],
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        keyPrefix: {
            type: String,
            required: true,
            index: true,
        },
        keyHash: {
            type: String,
            required: true,
            unique: true,
        },

        environment: {
            type: String,
            enum: Object.values(ApiKeyEnvironment),
            default: ApiKeyEnvironment.TEST,
            index: true,
        },
        scopes: {
            type: [String],
            enum: Object.values(ApiKeyScope),
            default: [ApiKeyScope.READ],
        },
        permissions: {
            type: [String],
            default: [],
        },

        rateLimit: {
            type: Number,
            default: 60, // 60 requests per minute
            min: 1,
            max: 10000,
        },
        dailyLimit: {
            type: Number,
            min: 1,
        },

        allowedIps: {
            type: [String],
            default: [],
        },
        allowedDomains: {
            type: [String],
            default: [],
        },
        allowedOrigins: {
            type: [String],
            default: [],
        },

        usageCount: {
            type: Number,
            default: 0,
        },
        lastUsedAt: Date,
        lastUsedIp: String,

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            index: true,
        },
        revokedAt: Date,
        revokedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        revokedReason: String,
    },
    {
        timestamps: true,
        collection: "api_keys",
    }
);

// ==========================================
// INDEXES
// ==========================================

// Compound index for user's active keys
ApiKeySchema.index({ userId: 1, isActive: 1 });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateApiKey(environment: ApiKeyEnvironment): string {
    const prefix = `wf_${environment}_`;
    const key = crypto.randomBytes(24).toString("base64url");
    return `${prefix}${key}`;
}

function hashKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
}

function getKeyPrefix(key: string): string {
    return key.substring(0, 20) + "...";
}

// ==========================================
// STATIC METHODS
// ==========================================

ApiKeySchema.statics.generate = async function (params: {
    userId: mongoose.Types.ObjectId;
    name: string;
    environment?: ApiKeyEnvironment;
    scopes?: ApiKeyScope[];
    permissions?: string[];
    rateLimit?: number;
    allowedIps?: string[];
    allowedDomains?: string[];
    expiresAt?: Date;
}): Promise<{ key: string; record: IApiKey }> {
    const environment = params.environment ?? ApiKeyEnvironment.TEST;
    const key = generateApiKey(environment);
    const keyHash = hashKey(key);
    const keyPrefix = getKeyPrefix(key);

    const record = await this.create({
        ...params,
        environment,
        keyPrefix,
        keyHash,
        scopes: params.scopes ?? [ApiKeyScope.READ],
        rateLimit: params.rateLimit ?? 60,
    });

    return { key, record };
};

ApiKeySchema.statics.findByKey = async function (
    key: string
): Promise<IApiKey | null> {
    const keyHash = hashKey(key);
    return this.findOne({ keyHash, isActive: true });
};

ApiKeySchema.statics.validateKey = async function (
    key: string,
    requiredScope?: ApiKeyScope
): Promise<{ valid: boolean; apiKey?: IApiKey; reason?: string }> {
    const keyHash = hashKey(key);
    const apiKey = await this.findOne({ keyHash });

    if (!apiKey) {
        return { valid: false, reason: "API key not found" };
    }

    if (!apiKey.isActive) {
        return { valid: false, reason: "API key is inactive" };
    }

    if (apiKey.revokedAt) {
        return { valid: false, reason: "API key has been revoked" };
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { valid: false, reason: "API key has expired" };
    }

    if (requiredScope && !apiKey.scopes.includes(requiredScope)) {
        return { valid: false, reason: `Missing required scope: ${requiredScope}` };
    }

    return { valid: true, apiKey };
};

ApiKeySchema.statics.getByUser = function (
    userId: mongoose.Types.ObjectId
): Promise<IApiKey[]> {
    return this.find({ userId }).sort({ createdAt: -1 });
};

ApiKeySchema.statics.revoke = async function (
    keyId: mongoose.Types.ObjectId,
    revokedBy: mongoose.Types.ObjectId,
    reason?: string
): Promise<IApiKey | null> {
    return this.findByIdAndUpdate(
        keyId,
        {
            isActive: false,
            revokedAt: new Date(),
            revokedBy,
            revokedReason: reason,
        },
        { new: true }
    );
};

ApiKeySchema.statics.recordUsage = async function (
    keyId: mongoose.Types.ObjectId,
    ip?: string
): Promise<void> {
    await this.findByIdAndUpdate(keyId, {
        $inc: { usageCount: 1 },
        lastUsedAt: new Date(),
        lastUsedIp: ip,
    });
};

// ==========================================
// INSTANCE METHODS
// ==========================================

ApiKeySchema.methods.hasScope = function (scope: ApiKeyScope): boolean {
    return this.scopes.includes(scope) || this.scopes.includes(ApiKeyScope.ADMIN);
};

ApiKeySchema.methods.hasPermission = function (permission: string): boolean {
    return (
        this.permissions.length === 0 || // No restrictions = all permissions
        this.permissions.includes(permission) ||
        this.permissions.includes("*")
    );
};

ApiKeySchema.methods.isExpired = function (): boolean {
    return !!this.expiresAt && this.expiresAt < new Date();
};

// ==========================================
// EXPORT
// ==========================================

export default (models.ApiKey as IApiKeyModel) ||
    model<IApiKey, IApiKeyModel>("ApiKey", ApiKeySchema);
