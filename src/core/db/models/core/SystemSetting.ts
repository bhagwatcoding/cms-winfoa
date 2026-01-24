import mongoose, { Schema, Document, Model, model, models } from "mongoose";

// ==========================================
// SYSTEM SETTING MODEL
// Dynamic application configuration stored in DB
// ==========================================

export enum SettingType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    JSON = "json",
    ARRAY = "array",
    DATE = "date",
}

export enum SettingCategory {
    GENERAL = "general",
    SECURITY = "security",
    AUTH = "auth",
    EMAIL = "email",
    UI = "ui",
    FEATURES = "features",
    LIMITS = "limits",
    INTEGRATIONS = "integrations",
    MAINTENANCE = "maintenance",
}

export interface ISystemSetting extends Document {
    // Identification
    key: string; // "maintenance_mode", "max_upload_size"
    value: unknown; // Any JSON-serializable value
    type: SettingType;
    category: SettingCategory;

    // Metadata
    label: string; // Human-readable label
    description?: string;
    placeholder?: string;

    // Constraints
    isPublic: boolean; // Can be fetched by frontend?
    isEditable: boolean; // Can admin change it?
    isEncrypted: boolean; // Is value encrypted?

    // Validation
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: unknown[]; // Allowed values
    };

    // Default
    defaultValue?: unknown;

    // Tracking
    lastModifiedBy?: mongoose.Types.ObjectId;
    lastModifiedAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Static methods
interface ISystemSettingModel extends Model<ISystemSetting> {
    get<T = unknown>(key: string): Promise<T | null>;
    set(key: string, value: unknown, modifiedBy?: mongoose.Types.ObjectId): Promise<ISystemSetting>;
    getByCategory(category: SettingCategory): Promise<ISystemSetting[]>;
    getPublic(): Promise<ISystemSetting[]>;
    reset(key: string): Promise<ISystemSetting | null>;
    seedDefaults(): Promise<void>;
}

const SystemSettingSchema = new Schema<ISystemSetting>(
    {
        key: {
            type: String,
            required: [true, "Setting key is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(SettingType),
            default: SettingType.STRING,
        },
        category: {
            type: String,
            enum: Object.values(SettingCategory),
            default: SettingCategory.GENERAL,
            index: true,
        },

        label: {
            type: String,
            required: [true, "Label is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        placeholder: {
            type: String,
            trim: true,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },
        isEditable: {
            type: Boolean,
            default: true,
        },
        isEncrypted: {
            type: Boolean,
            default: false,
        },

        validation: {
            min: Number,
            max: Number,
            pattern: String,
            options: [Schema.Types.Mixed],
        },

        defaultValue: Schema.Types.Mixed,

        lastModifiedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        lastModifiedAt: Date,
    },
    {
        timestamps: true,
        collection: "system_settings",
    }
);

// ==========================================
// STATIC METHODS
// ==========================================

SystemSettingSchema.statics.get = async function <T = unknown>(
    key: string
): Promise<T | null> {
    const setting = await this.findOne({ key });
    return setting ? (setting.value as T) : null;
};

SystemSettingSchema.statics.set = async function (
    key: string,
    value: unknown,
    modifiedBy?: mongoose.Types.ObjectId
): Promise<ISystemSetting> {
    const setting = await this.findOneAndUpdate(
        { key },
        {
            value,
            lastModifiedBy: modifiedBy,
            lastModifiedAt: new Date(),
        },
        { new: true }
    );

    if (!setting) {
        throw new Error(`Setting "${key}" not found`);
    }

    return setting;
};

SystemSettingSchema.statics.getByCategory = function (
    category: SettingCategory
): Promise<ISystemSetting[]> {
    return this.find({ category }).sort({ key: 1 });
};

SystemSettingSchema.statics.getPublic = function (): Promise<ISystemSetting[]> {
    return this.find({ isPublic: true }).sort({ category: 1, key: 1 });
};

SystemSettingSchema.statics.reset = async function (
    key: string
): Promise<ISystemSetting | null> {
    const setting = await this.findOne({ key });
    if (!setting || setting.defaultValue === undefined) {
        return null;
    }
    setting.value = setting.defaultValue;
    setting.lastModifiedAt = new Date();
    return setting.save();
};

SystemSettingSchema.statics.seedDefaults = async function (): Promise<void> {
    const defaults: Partial<ISystemSetting>[] = [
        // General
        {
            key: "app_name",
            value: "WinFoa",
            type: SettingType.STRING,
            category: SettingCategory.GENERAL,
            label: "Application Name",
            isPublic: true,
            isEditable: true,
            defaultValue: "WinFoa",
        },
        {
            key: "app_logo_url",
            value: "/logo.png",
            type: SettingType.STRING,
            category: SettingCategory.GENERAL,
            label: "Application Logo URL",
            isPublic: true,
            isEditable: true,
            defaultValue: "/logo.png",
        },

        // Security
        {
            key: "session_max_age",
            value: 86400,
            type: SettingType.NUMBER,
            category: SettingCategory.SECURITY,
            label: "Session Max Age (seconds)",
            description: "Maximum session duration in seconds",
            isPublic: false,
            isEditable: true,
            defaultValue: 86400,
            validation: { min: 3600, max: 2592000 },
        },
        {
            key: "max_login_attempts",
            value: 5,
            type: SettingType.NUMBER,
            category: SettingCategory.SECURITY,
            label: "Max Login Attempts",
            isPublic: false,
            isEditable: true,
            defaultValue: 5,
            validation: { min: 3, max: 20 },
        },
        {
            key: "lockout_duration",
            value: 900,
            type: SettingType.NUMBER,
            category: SettingCategory.SECURITY,
            label: "Account Lockout Duration (seconds)",
            isPublic: false,
            isEditable: true,
            defaultValue: 900,
            validation: { min: 300, max: 86400 },
        },

        // Maintenance
        {
            key: "maintenance_mode",
            value: false,
            type: SettingType.BOOLEAN,
            category: SettingCategory.MAINTENANCE,
            label: "Maintenance Mode",
            description: "Enable to put the application in maintenance mode",
            isPublic: true,
            isEditable: true,
            defaultValue: false,
        },
        {
            key: "maintenance_message",
            value: "We are currently performing scheduled maintenance. Please try again later.",
            type: SettingType.STRING,
            category: SettingCategory.MAINTENANCE,
            label: "Maintenance Message",
            isPublic: true,
            isEditable: true,
            defaultValue: "We are currently performing scheduled maintenance. Please try again later.",
        },

        // Features
        {
            key: "registration_enabled",
            value: true,
            type: SettingType.BOOLEAN,
            category: SettingCategory.FEATURES,
            label: "Registration Enabled",
            isPublic: true,
            isEditable: true,
            defaultValue: true,
        },
        {
            key: "2fa_required",
            value: false,
            type: SettingType.BOOLEAN,
            category: SettingCategory.FEATURES,
            label: "Two-Factor Authentication Required",
            isPublic: false,
            isEditable: true,
            defaultValue: false,
        },

        // Limits
        {
            key: "max_file_size_mb",
            value: 10,
            type: SettingType.NUMBER,
            category: SettingCategory.LIMITS,
            label: "Max File Upload Size (MB)",
            isPublic: true,
            isEditable: true,
            defaultValue: 10,
            validation: { min: 1, max: 100 },
        },
    ];

    for (const setting of defaults) {
        await this.findOneAndUpdate(
            { key: setting.key },
            setting,
            { upsert: true, new: true }
        );
    }
};

// ==========================================
// EXPORT
// ==========================================

export default (models.SystemSetting as ISystemSettingModel) ||
    model<ISystemSetting, ISystemSettingModel>("SystemSetting", SystemSettingSchema);
