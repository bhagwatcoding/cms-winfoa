/**
 * Database Connection - Alias Re-export
 * This file provides backward compatibility for imports from @/lib/db
 * All database functionality is centralized in @/core/db
 *
 * @deprecated Use @/core/db instead
 */

export { connectDB, disconnectDB, isConnected } from '@/core/db/connection';
export { default } from '@/core/db/connection';
