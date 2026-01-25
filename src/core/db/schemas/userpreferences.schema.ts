/**
 * User Preferences Schema
 * Mongoose schema definition for user preferences
 * Uses numeric enums for efficient storage
 */

import { Schema } from 'mongoose';
import { IUserPreferencesDoc } from '@/core/db/interfaces';
import {
  ThemeMode,
  ProfileVisibility,
  ThemeModeLabel,
  ProfileVisibilityLabel,
  getEnumRange,
} from '@/core/db/enums';

export const UserPreferencesSchema = new Schema<IUserPreferencesDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // unique creates index automatically
    },
    emailNotifications: {
      marketing: { type: Boolean, default: false },
      updates: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
    },
    pushNotifications: {
      enabled: { type: Boolean, default: false },
      browser: { type: Boolean, default: false },
      mobile: { type: Boolean, default: false },
    },
    privacy: {
      // Stored as number
      profileVisibility: {
        type: Number,
        default: ProfileVisibility.PUBLIC,
        min: getEnumRange(ProfileVisibilityLabel).min,
        max: getEnumRange(ProfileVisibilityLabel).max,
      },
      showEmail: { type: Boolean, default: false },
      showActivity: { type: Boolean, default: true },
    },
    // Stored as number
    theme: {
      type: Number,
      default: ThemeMode.SYSTEM,
      min: getEnumRange(ThemeModeLabel).min,
      max: getEnumRange(ThemeModeLabel).max,
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
  },
  {
    timestamps: true,
    collection: 'user_preferences',
  }
);
