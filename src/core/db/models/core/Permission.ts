import { Schema, Document, Model, model, models } from 'mongoose';

// ==========================================
// PERMISSION MODEL
// Granular permission management for RBAC
// ==========================================

export interface IPermission extends Document {
  // Core Fields
  name: string; // "Create Users"
  slug: string; // "user:create"
  description?: string;

  // Categorization
  module: string; // "user", "course", "billing"
  action: PermissionAction; // "create", "read", "update", "delete"

  // Status
  isSystem: boolean; // Cannot be deleted
  isActive: boolean;

  // Metadata
  metadata?: Record<string, unknown>;
  dependsOn?: string[]; // Permissions required before this one

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Permission actions enum
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage', // Full access
  EXPORT = 'export',
  IMPORT = 'import',
  APPROVE = 'approve',
  REJECT = 'reject',
}

// Static methods interface
interface IPermissionModel extends Model<IPermission> {
  findBySlug(slug: string): Promise<IPermission | null>;
  findByModule(module: string): Promise<IPermission[]>;
  getAll(): Promise<IPermission[]>;
  seedDefaults(): Promise<void>;
}

const PermissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Permission slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(PermissionAction),
      required: [true, 'Action is required'],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    dependsOn: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==========================================
// INDEXES
// ==========================================

// Compound index for module + action lookups
PermissionSchema.index({ module: 1, action: 1 });

// ==========================================
// STATIC METHODS
// ==========================================

PermissionSchema.statics.findBySlug = function (slug: string): Promise<IPermission | null> {
  return this.findOne({ slug, isActive: true });
};

PermissionSchema.statics.findByModule = function (module: string): Promise<IPermission[]> {
  return this.find({ module, isActive: true }).sort({ action: 1 });
};

PermissionSchema.statics.getAll = function (): Promise<IPermission[]> {
  return this.find({ isActive: true }).sort({ module: 1, action: 1 });
};

PermissionSchema.statics.seedDefaults = async function (): Promise<void> {
  const defaultPermissions = [
    // User permissions
    {
      name: 'Create Users',
      slug: 'user:create',
      module: 'user',
      action: PermissionAction.CREATE,
      isSystem: true,
    },
    {
      name: 'Read Users',
      slug: 'user:read',
      module: 'user',
      action: PermissionAction.READ,
      isSystem: true,
    },
    {
      name: 'Update Users',
      slug: 'user:update',
      module: 'user',
      action: PermissionAction.UPDATE,
      isSystem: true,
    },
    {
      name: 'Delete Users',
      slug: 'user:delete',
      module: 'user',
      action: PermissionAction.DELETE,
      isSystem: true,
    },
    {
      name: 'Manage Users',
      slug: 'user:manage',
      module: 'user',
      action: PermissionAction.MANAGE,
      isSystem: true,
    },

    // Role permissions
    {
      name: 'Create Roles',
      slug: 'role:create',
      module: 'role',
      action: PermissionAction.CREATE,
      isSystem: true,
    },
    {
      name: 'Read Roles',
      slug: 'role:read',
      module: 'role',
      action: PermissionAction.READ,
      isSystem: true,
    },
    {
      name: 'Update Roles',
      slug: 'role:update',
      module: 'role',
      action: PermissionAction.UPDATE,
      isSystem: true,
    },
    {
      name: 'Delete Roles',
      slug: 'role:delete',
      module: 'role',
      action: PermissionAction.DELETE,
      isSystem: true,
    },

    // System permissions
    {
      name: 'View Settings',
      slug: 'settings:read',
      module: 'settings',
      action: PermissionAction.READ,
      isSystem: true,
    },
    {
      name: 'Update Settings',
      slug: 'settings:update',
      module: 'settings',
      action: PermissionAction.UPDATE,
      isSystem: true,
    },
    {
      name: 'View Audit Logs',
      slug: 'audit:read',
      module: 'audit',
      action: PermissionAction.READ,
      isSystem: true,
    },
    {
      name: 'Export Audit Logs',
      slug: 'audit:export',
      module: 'audit',
      action: PermissionAction.EXPORT,
      isSystem: true,
    },

    // API permissions
    {
      name: 'Create API Keys',
      slug: 'api:create',
      module: 'api',
      action: PermissionAction.CREATE,
      isSystem: true,
    },
    {
      name: 'Read API Keys',
      slug: 'api:read',
      module: 'api',
      action: PermissionAction.READ,
      isSystem: true,
    },
    {
      name: 'Delete API Keys',
      slug: 'api:delete',
      module: 'api',
      action: PermissionAction.DELETE,
      isSystem: true,
    },
  ];

  for (const perm of defaultPermissions) {
    await this.findOneAndUpdate({ slug: perm.slug }, perm, { upsert: true, new: true });
  }
};

// ==========================================
// PRE-SAVE HOOKS
// ==========================================

PermissionSchema.pre('save', function () {
  // Auto-generate slug from module:action if not provided
  if (this.isModified('module') || this.isModified('action')) {
    if (!this.slug) {
      this.slug = `${this.module}:${this.action}`;
    }
  }
});

// Prevent deletion of system permissions
PermissionSchema.pre('deleteOne', { document: true, query: false }, function () {
  if (this.isSystem) {
    throw new Error('Cannot delete a system permission.');
  }
});

// ==========================================
// EXPORT
// ==========================================

export default (models.Permission as IPermissionModel) ||
  model<IPermission, IPermissionModel>('Permission', PermissionSchema);
