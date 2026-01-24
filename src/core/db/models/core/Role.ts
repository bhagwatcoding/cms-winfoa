import { Schema, Document, Model, model, models } from "mongoose";
import { ISoftDelete } from "@/shared/types/models"; 

// 1. Interface Definition
// -------------------------
export interface IRole extends Document, ISoftDelete {
  name: string; // Readable name: "God"
  slug: string; // Code-friendly ID: "god"
  description?: string;

  // Authorization: List of allowed actions
  // e.g., ["user:read", "user:write", "course:delete"]
  permissions: string[];

  // System flags
  isSystem: boolean; // If true, this role cannot be deleted (e.g., 'god')
  priority: number; // Higher priority = more power (for sorting/hierarchy)

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // ✅ Instance Methods
  hasPermission(permission: string): boolean;
}

// 2. Schema Definition
// --------------------
const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Role slug is required"],
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
    isSystem: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    // Soft Delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  {
    timestamps: true,
  },
);

// 3. Methods & Helpers
// --------------------

// Check if role has a specific permission
RoleSchema.methods.hasPermission = function (permission: string): boolean {
  // If role is god, they might have implicit access to everything
  if (this.slug === "god") return true;

  return this.permissions.includes(permission);
};

// Pre-save hook to ensure slug exists if not provided
RoleSchema.pre("save", function () {
  if (this.isModified("name") && !this.slug) {
    // Generate slug from name: "Center Manager" -> "center-manager"
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

// Prevent deletion of System roles (Safety Check)
RoleSchema.pre("validate", function () {
  if (this.isDeleted && this.isSystem) {
    throw new Error("Cannot delete a system restricted role.");
  }
});

// 4. Next.js 16 Export
// --------------------
// Prevents "OverwriteModelError"
export default (models.Role as Model<IRole>) ||
  model<IRole>("Role", RoleSchema);
