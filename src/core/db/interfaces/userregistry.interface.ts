/**
 * User Registry Interfaces
 * Type definitions for UMP user registry
 */

import { Document, Types } from 'mongoose';
import { UserRole, UserStatus } from '@/core/db/enums';

// ==========================================
// INTERFACE
// ==========================================

export interface IUserRegistry extends Document {
  userId: string; // Unique user ID (e.g., WIN-2024-0001)
  email: string;
  role: UserRole; // Stored as number
  status: UserStatus; // Stored as number
  createdBy: Types.ObjectId | string;
  registeredBy?: string;
  source?: string;
  registeredAt: Date;
  metadata: {
    subdomain?: string;
    source?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}
