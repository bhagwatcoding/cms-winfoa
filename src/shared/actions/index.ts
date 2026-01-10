// 🚀 GLOBAL ACTIONS - Barrel Export
// All server actions organized by subdomain

// ==========================================
// AUTH ACTIONS
// ==========================================
export * from './auth/login';
export * from './auth/signup';
export * from './auth/password-reset';

// ==========================================
// MYACCOUNT ACTIONS
// ==========================================
export * from './myaccount/profile';
export * from './myaccount/wallet';

// ==========================================
// SKILLS ACTIONS (Education Portal)
// ==========================================
export * from './skills/students';
export * from './skills/courses';
export * from './skills/employees';
export * from './skills/results';
export * from './skills/certificates';
export * from './skills/admit-cards';
export * from './skills/notifications';
export * from './skills/transactions';

// ==========================================
// DEVELOPER ACTIONS (API Management)
// ==========================================
export * from './developer/api-keys';

// ==========================================
// UMP ACTIONS (User Management Portal)
// ==========================================
export * from './ump/users';
export * from './ump/user-management';

// ==========================================
// USERS ACTIONS (Global User Operations)
// ==========================================
export * from './users';

// Usage Examples:
// import { loginUser, logoutUser } from '@/actions'
// import { getStudents, createStudent } from '@/actions'
// import { getApiKeys, createApiKey } from '@/actions'
// import { activateUserAction, deactivateUserAction } from '@/actions'

