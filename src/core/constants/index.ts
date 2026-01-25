/**
 * Constants - Central Export
 * All application constants organized and exported
 *
 * NOTE: For runtime configuration (env-based), use:
 *   import { ... } from "@/config"
 *
 * This module exports STATIC constants only:
 * - Routes
 * - Messages
 * - Database enums/labels
 * - Subdomain types (re-exported from config)
 */

// ==========================================
// STATIC APPLICATION CONSTANTS
// ==========================================

export * from './app';

// ==========================================
// ROUTES
// ==========================================

export * from './routes';

// ==========================================
// SUBDOMAINS (Re-exports from config for convenience)
// ==========================================

export * from './subdomains';

// ==========================================
// MESSAGES
// ==========================================

export * from './messages';
