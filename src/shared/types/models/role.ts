/**
 * Core Role Interface
 */

import type { Document, Types } from 'mongoose';

export interface IRole extends Document {
    _id: Types.ObjectId;
    name: string; // Display name: "Super Admin", "Center Manager"
    slug: string; // Unique identifier: "super-admin", "center-manager"
    description?: string;
    permissions: string[]; // Array of permission strings
    isSystemRole: boolean; // true = built-in, false = custom
    isActive: boolean;
    priority: number; // Higher = more important
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
