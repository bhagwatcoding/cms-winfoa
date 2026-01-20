import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import crypto from "crypto";

// ==========================================
// WEBHOOK SUBSCRIPTION MODEL
// Webhook subscription management
// ==========================================

export enum WebhookEvent {
    // User events
    USER_CREATED = "user.created",
    USER_UPDATED = "user.updated",
    USER_DELETED = "user.deleted",

    // Auth events
    AUTH_LOGIN = "auth.login",
    AUTH_LOGOUT = "auth.logout",
    AUTH_PASSWORD_RESET = "auth.password_reset",

    // Session events
    SESSION_CREATED = "session.created",
    SESSION_REVOKED = "session.revoked",

    // Payment events
    PAYMENT_COMPLETED = "payment.completed",
    PAYMENT_FAILED = "payment.failed",
    PAYMENT_REFUNDED = "payment.refunded",

    // System events
    SYSTEM_MAINTENANCE = "system.maintenance",
}

export enum WebhookStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    DISABLED = "disabled",
}

export interface IWebhookDelivery {
    eventId: string;
    event: WebhookEvent;
    payload: Record<string, unknown>;
    response?: {
        statusCode: number;
        body?: string;
        headers?: Record<string, string>;
    };
    success: boolean;
    duration: number; // ms
    attemptNumber: number;
    deliveredAt: Date;
    error?: string;
}

export interface IWebhookSubscription extends Document {
    userId: mongoose.Types.ObjectId;

    // Configuration
    url: string;
    events: WebhookEvent[];
    secret: string; // For signature verification

    // Status
    status: WebhookStatus;
    isActive: boolean;

    // Delivery settings
    retryCount: number; // Max retries
    retryDelay: number; // ms between retries
    timeout: number; // Request timeout in ms

    // Headers
    customHeaders?: Record<string, string>;

    // Statistics
    deliveryCount: number;
    successCount: number;
    failureCount: number;
    lastTriggeredAt?: Date;
    lastSuccessAt?: Date;
    lastFailureAt?: Date;
    lastFailureReason?: string;

    // Consecutive failures
    consecutiveFailures: number;
    autoDisabledAt?: Date; // Auto-disabled after too many failures

    // Recent deliveries (last 10)
    recentDeliveries: IWebhookDelivery[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Static methods
interface IWebhookSubscriptionModel extends Model<IWebhookSubscription> {
    create(params: {
        userId: mongoose.Types.ObjectId;
        url: string;
        events: WebhookEvent[];
        retryCount?: number;
        customHeaders?: Record<string, string>;
    }): Promise<IWebhookSubscription>;
    findByEvent(event: WebhookEvent): Promise<IWebhookSubscription[]>;
    getByUser(userId: mongoose.Types.ObjectId): Promise<IWebhookSubscription[]>;
    recordDelivery(
        webhookId: mongoose.Types.ObjectId,
        delivery: IWebhookDelivery
    ): Promise<void>;
    generateSignature(payload: unknown, secret: string): string;
}

const WebhookDeliverySchema = new Schema<IWebhookDelivery>(
    {
        eventId: { type: String, required: true },
        event: {
            type: String,
            enum: Object.values(WebhookEvent),
            required: true,
        },
        payload: Schema.Types.Mixed,
        response: {
            statusCode: Number,
            body: String,
            headers: Schema.Types.Mixed,
        },
        success: { type: Boolean, required: true },
        duration: { type: Number, required: true },
        attemptNumber: { type: Number, required: true },
        deliveredAt: { type: Date, required: true },
        error: String,
    },
    { _id: false }
);

const WebhookSubscriptionSchema = new Schema<IWebhookSubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        url: {
            type: String,
            required: [true, "Webhook URL is required"],
            trim: true,
            validate: {
                validator: function (v: string) {
                    try {
                        new URL(v);
                        return v.startsWith("https://"); // Require HTTPS
                    } catch {
                        return false;
                    }
                },
                message: "Invalid webhook URL. Must be a valid HTTPS URL.",
            },
        },
        events: {
            type: [String],
            enum: Object.values(WebhookEvent),
            required: [true, "At least one event is required"],
            validate: {
                validator: function (v: string[]) {
                    return v.length > 0;
                },
                message: "At least one event must be selected.",
            },
        },
        secret: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(WebhookStatus),
            default: WebhookStatus.ACTIVE,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        retryCount: {
            type: Number,
            default: 3,
            min: 0,
            max: 10,
        },
        retryDelay: {
            type: Number,
            default: 5000, // 5 seconds
            min: 1000,
            max: 300000, // 5 minutes
        },
        timeout: {
            type: Number,
            default: 30000, // 30 seconds
            min: 5000,
            max: 60000, // 1 minute
        },

        customHeaders: {
            type: Schema.Types.Mixed,
            default: {},
        },

        deliveryCount: {
            type: Number,
            default: 0,
        },
        successCount: {
            type: Number,
            default: 0,
        },
        failureCount: {
            type: Number,
            default: 0,
        },
        lastTriggeredAt: Date,
        lastSuccessAt: Date,
        lastFailureAt: Date,
        lastFailureReason: String,

        consecutiveFailures: {
            type: Number,
            default: 0,
        },
        autoDisabledAt: Date,

        recentDeliveries: {
            type: [WebhookDeliverySchema],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: "webhook_subscriptions",
    }
);

// ==========================================
// INDEXES
// ==========================================

// Compound index for finding active webhooks by event
WebhookSubscriptionSchema.index({ events: 1, isActive: 1, status: 1 });

// ==========================================
// STATIC METHODS
// ==========================================

WebhookSubscriptionSchema.statics.findByEvent = function (
    event: WebhookEvent
): Promise<IWebhookSubscription[]> {
    return this.find({
        events: event,
        isActive: true,
        status: WebhookStatus.ACTIVE,
    });
};

WebhookSubscriptionSchema.statics.getByUser = function (
    userId: mongoose.Types.ObjectId
): Promise<IWebhookSubscription[]> {
    return this.find({ userId }).sort({ createdAt: -1 });
};

WebhookSubscriptionSchema.statics.recordDelivery = async function (
    webhookId: mongoose.Types.ObjectId,
    delivery: IWebhookDelivery
): Promise<void> {
    const updateQuery: Record<string, unknown> = {
        $inc: { deliveryCount: 1 },
        lastTriggeredAt: delivery.deliveredAt,
        $push: {
            recentDeliveries: {
                $each: [delivery],
                $slice: -10, // Keep only last 10 deliveries
            },
        },
    };

    if (delivery.success) {
        updateQuery.$inc = {
            ...updateQuery.$inc as object,
            successCount: 1,
        };
        updateQuery.consecutiveFailures = 0;
        updateQuery.lastSuccessAt = delivery.deliveredAt;
    } else {
        updateQuery.$inc = {
            ...updateQuery.$inc as object,
            failureCount: 1,
            consecutiveFailures: 1,
        };
        updateQuery.lastFailureAt = delivery.deliveredAt;
        updateQuery.lastFailureReason = delivery.error;
    }

    const webhook = await this.findByIdAndUpdate(webhookId, updateQuery, {
        new: true,
    });

    // Auto-disable after 5 consecutive failures
    if (webhook && webhook.consecutiveFailures >= 5) {
        await this.findByIdAndUpdate(webhookId, {
            status: WebhookStatus.DISABLED,
            isActive: false,
            autoDisabledAt: new Date(),
        });
    }
};

WebhookSubscriptionSchema.statics.generateSignature = function (
    payload: unknown,
    secret: string
): string {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest("hex")}`;
};

// ==========================================
// PRE-SAVE HOOKS
// ==========================================

WebhookSubscriptionSchema.pre("save", function () {
    // Generate secret on creation
    if (this.isNew && !this.secret) {
        this.secret = crypto.randomBytes(32).toString("hex");
    }
});

// ==========================================
// INSTANCE METHODS
// ==========================================

WebhookSubscriptionSchema.methods.pause = async function (): Promise<
    IWebhookSubscription
> {
    this.status = WebhookStatus.PAUSED;
    this.isActive = false;
    return this.save();
};

WebhookSubscriptionSchema.methods.resume = async function (): Promise<
    IWebhookSubscription
> {
    this.status = WebhookStatus.ACTIVE;
    this.isActive = true;
    this.consecutiveFailures = 0;
    this.autoDisabledAt = undefined;
    return this.save();
};

WebhookSubscriptionSchema.methods.regenerateSecret =
    async function (): Promise<string> {
        this.secret = crypto.randomBytes(32).toString("hex");
        await this.save();
        return this.secret;
    };

// ==========================================
// EXPORT
// ==========================================

export default (models.WebhookSubscription as IWebhookSubscriptionModel) ||
    model<IWebhookSubscription, IWebhookSubscriptionModel>(
        "WebhookSubscription",
        WebhookSubscriptionSchema
    );
