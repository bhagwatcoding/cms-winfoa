/**
 * User Preferences Interfaces
 * Type definitions for user preferences
 */

import { Document, Types } from 'mongoose';
import { ThemeMode, ProfileVisibility } from '@/core/db/enums';

// ==========================================
// INTERFACE
// ==========================================

export interface IEmailNotificationPrefs {
  marketing: boolean;
  updates: boolean;
  security: boolean;
  newsletter: boolean;
}

export interface IPushNotificationPrefs {
  enabled: boolean;
  browser: boolean;
  mobile: boolean;
}

export interface IPrivacyPrefs {
  profileVisibility: ProfileVisibility; // Stored as number
  showEmail: boolean;
  showActivity: boolean;
}

export interface IUserPreferencesDoc extends Document {
  userId: Types.ObjectId;
  emailNotifications: IEmailNotificationPrefs;
  pushNotifications: IPushNotificationPrefs;
  privacy: IPrivacyPrefs;
  theme: ThemeMode; // Stored as number
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
