import mongoose, { Schema, Document, Model, model, models } from "mongoose";

// ==========================================
// NOTIFICATION MODEL
// In-app notifications for users
// ==========================================

export enum NotificationType {
    SYSTEM = "system", // System announcements
    SECURITY = "security", // Security alerts
    INFO = "info", // General information
    MARKETING = "marketing", // Promotional
    ACTIVITY = "activity", // User activity related
    REMINDER = "reminder", // Reminders
    ALERT = "alert", // Important alerts
}

export enum NotificationPriority {
    LOW = 1,
    NORMAL = 2,
    HIGH = 3,
    URGENT = 4,
}

export enum NotificationChannel {
    IN_APP = "in_app",
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
}

export interface INotification extends Document {
    // Target
    userId: mongoose.Types.ObjectId;

    // Content
    type: NotificationType;
    title: string;
    message: string;
    link?: string; // Action URL
    icon?: string; // Icon name or URL

    // Status
    isRead: boolean;
    readAt?: Date;
    isDismissed: boolean;
    dismissedAt?: Date;

    // Priority & Expiry
    priority: NotificationPriority;
    expiresAt?: Date;

    // Channels
    channels: NotificationChannel[];
    sentVia?: NotificationChannel[];

    // Metadata
    metadata?: Record<string, unknown>;
    category?: string; // For grouping

    // Action tracking
    actionTaken?: boolean;
    actionType?: string;
    actionAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Static methods
interface INotificationModel extends Model<INotification> {
    createNotification(params: {
        userId: mongoose.Types.ObjectId;
        type: NotificationType;
        title: string;
        message: string;
        link?: string;
        priority?: NotificationPriority;
        metadata?: Record<string, unknown>;
    }): Promise<INotification>;
    getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
    getForUser(userId: mongoose.Types.ObjectId, limit?: number): Promise<INotification[]>;
    markAllAsRead(userId: mongoose.Types.ObjectId): Promise<void>;
    deleteOld(days?: number): Promise<number>;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(NotificationType),
            default: NotificationType.INFO,
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: 200,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: 1000,
        },
        link: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: Date,
        isDismissed: {
            type: Boolean,
            default: false,
        },
        dismissedAt: Date,

        priority: {
            type: Number,
            enum: Object.values(NotificationPriority).filter((v) => typeof v === "number"),
            default: NotificationPriority.NORMAL,
            index: true,
        },
        expiresAt: {
            type: Date,
            index: true,
        },

        channels: {
            type: [String],
            enum: Object.values(NotificationChannel),
            default: [NotificationChannel.IN_APP],
        },
        sentVia: {
            type: [String],
            enum: Object.values(NotificationChannel),
            default: [],
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        category: String,

        actionTaken: {
            type: Boolean,
            default: false,
        },
        actionType: String,
        actionAt: Date,
    },
    {
        timestamps: true,
        collection: "notifications",
    }
);

// ==========================================
// INDEXES
// ==========================================

// Compound index for user's unread notifications
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// TTL index for auto-cleanup of expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ==========================================
// STATIC METHODS
// ==========================================

NotificationSchema.statics.createNotification = async function (params: {
    userId: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    priority?: NotificationPriority;
    metadata?: Record<string, unknown>;
}): Promise<INotification> {
    const notification = new this({
        ...params,
        priority: params.priority ?? NotificationPriority.NORMAL,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    return notification.save();
};

NotificationSchema.statics.getUnreadCount = function (
    userId: mongoose.Types.ObjectId
): Promise<number> {
    return this.countDocuments({ userId, isRead: false, isDismissed: false });
};

NotificationSchema.statics.getForUser = function (
    userId: mongoose.Types.ObjectId,
    limit = 50
): Promise<INotification[]> {
    return this.find({ userId, isDismissed: false })
        .sort({ createdAt: -1 })
        .limit(limit);
};

NotificationSchema.statics.markAllAsRead = async function (
    userId: mongoose.Types.ObjectId
): Promise<void> {
    await this.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

NotificationSchema.statics.deleteOld = async function (days = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await this.deleteMany({ createdAt: { $lt: cutoffDate } });
    return result.deletedCount;
};

// ==========================================
// INSTANCE METHODS
// ==========================================

NotificationSchema.methods.markAsRead = async function (): Promise<INotification> {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

NotificationSchema.methods.dismiss = async function (): Promise<INotification> {
    this.isDismissed = true;
    this.dismissedAt = new Date();
    return this.save();
};

// ==========================================
// EXPORT
// ==========================================

export default (models.Notification as INotificationModel) ||
    model<INotification, INotificationModel>("Notification", NotificationSchema);
