/**
 * User Preferences Model
 * Combines schema with model export
 */

import { Model, model, models } from 'mongoose';
import { UserPreferencesSchema } from '@/core/db/schemas/userpreferences.schema';
import { IUserPreferencesDoc } from '@/core/db/interfaces/userpreferences.interface';

// ==========================================
// EXPORT
// ==========================================

export type { IUserPreferencesDoc as IUserPreferences };

export default (models.UserPreferences as Model<IUserPreferencesDoc>) ||
  model<IUserPreferencesDoc>('UserPreferences', UserPreferencesSchema);
