import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    centerId?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    link?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        centerId: {
            type: Schema.Types.ObjectId,
            ref: 'Center',
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'error'],
            default: 'info',
            index: true,
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        link: {
            type: String,
            trim: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ centerId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, read: 1 });

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function (userId: string) {
    return await this.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        read: false,
    });
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function (userId: string) {
    return await this.updateMany(
        { userId: new mongoose.Types.ObjectId(userId), read: false },
        { $set: { read: true } }
    );
};

// Static method to create notification
NotificationSchema.statics.createNotification = async function (data: {
    userId: string;
    centerId?: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    link?: string;
    metadata?: Record<string, any>;
}) {
    return await this.create(data);
};

// Static method to get user notifications with pagination
NotificationSchema.statics.getUserNotifications = async function (
    userId: string,
    options: {
        page?: number;
        limit?: number;
        type?: string;
        read?: boolean;
    } = {}
) {
    const { page = 1, limit = 20, type, read } = options;
    const skip = (page - 1) * limit;

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) query.type = type;
    if (read !== undefined) query.read = read;

    const [notifications, total] = await Promise.all([
        this.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query),
    ]);

    return {
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total,
    };
};

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
