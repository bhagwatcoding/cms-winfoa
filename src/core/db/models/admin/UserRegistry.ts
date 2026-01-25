/**
 * User Registry Model
 * Combines schema with model export for UMP user registry
 */

import { Model, model, models } from 'mongoose';
import { UserRegistrySchema } from '@/core/db/schemas';
import { IUserRegistry } from '@/core/db/interfaces';

// ==========================================
// STATIC METHODS INTERFACE
// ==========================================

interface IUserRegistryModel extends Model<IUserRegistry> {
  generateUserId(): Promise<string>;
}

// ==========================================
// EXPORT
// ==========================================

export type { IUserRegistry };

export default (models.UserRegistry as IUserRegistryModel) ||
  model<IUserRegistry, IUserRegistryModel>('UserRegistry', UserRegistrySchema);
