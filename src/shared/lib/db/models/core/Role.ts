/**
 * Role Model
 * Professional role management with dynamic permissions
 */

import mongoose, { Schema, Document, Model, model, models } from 'mongoose';

// Role Interface
export interface IRole extends Document {
    _id: mongoose.Types.ObjectId;
    name: string; // e.g., "Super Admin", "Center Manager"
    slug: string; // e.g., "super-admin", "center-manager" (unique identifier)
    description?: string;
    permissions: string[]; // Array of permission strings
    isSystemRole: boolean; // true for built-in roles, false for custom
    isActive: boolean;
    priority: number; // Higher number = higher priority
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

// Role Schema
const RoleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: [true, 'Role name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Role slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: {
            type: [String],
            default: [],
        },
        isSystemRole: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        priority: {
            type: Number,
            default: 0,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
RoleSchema.index({ isSystemRole: 1, isActive: 1 });
RoleSchema.index({ priority: -1 });

// Prevent deletion of system roles
RoleSchema.pre('findOneAndDelete', async function () {
    const filter = this.getFilter();
    const doc = await this.model.findOne(filter);
    if (doc?.isSystemRole) {
        throw new Error('Cannot delete system role');
    }
});

// Model
export const Role: Model<IRole> = models.Role || model<IRole>('Role', RoleSchema);
