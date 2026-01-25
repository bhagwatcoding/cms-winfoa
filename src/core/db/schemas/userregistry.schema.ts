/**
 * User Registry Schema
 * Mongoose schema definition for UMP user registry
 * Uses numeric enums for efficient storage
 */

import mongoose, { Schema } from 'mongoose';
import { IUserRegistry } from '@/core/db/interfaces';
import { UserStatus } from '@/core/db/enums';

export const UserRegistrySchema = new Schema<IUserRegistry>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // unique creates index automatically
    },
    email: {
      type: String,
      required: true,
      unique: true, // unique creates index automatically
      lowercase: true,
      trim: true,
    },
    // Stored as number - UserRole from core types is already numeric
    role: {
      type: Number,
      required: true,
      min: 1,
      max: 12, // UserRole enum has 12 values
    },
    // Stored as number - UserStatus from core types is already numeric
    status: {
      type: Number,
      default: UserStatus.Pending, // Note: Core types use PascalCase
      min: 1,
      max: 10, // UserStatus enum has ~10 values
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    registeredBy: {
      type: String,
    },
    source: {
      type: String,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'user_registry',
  }
);

// Auto-increment counter schema for user IDs
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

// Static method to generate next user ID
UserRegistrySchema.statics.generateUserId = async function (): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    'userId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedNum = String(counter.seq).padStart(6, '0');
  return `WIN-${year}-${paddedNum}`;
};
