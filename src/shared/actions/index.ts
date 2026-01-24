/**
 * Actions Index
 * Centralized exports for all subdomain actions
 * This provides a clean API for importing actions across the application
 * Organized by subdomain for easy access and maintenance
 */

// ====================
// AUTHENTICATION ACTIONS
// ====================
export {
    loginAction,
    signupAction,
    logoutAction
} from './auth';

// ====================
// ACCOUNT ACTIONS
// ====================
export {
    // Profile actions
    updateProfileAction,
    getProfileAction,
    // Settings actions
    updateSettingsAction,
    changePasswordAction
} from './account';

// ====================
// UMP (USER MANAGEMENT PORTAL) ACTIONS
// ====================
export {
    // User management
    activateUserAction,
    deactivateUserAction,
    getUserManagementData,
    // Role management
    assignRoleToUserAction,
    removeRoleFromUserAction
} from './ump';

// ====================
// WALLET ACTIONS
// ====================
export {
    // Balance operations
    getBalanceAction,
    updateBalanceAction,
    // Transaction operations
    createTransactionAction,
    getTransactionHistoryAction,
    // Recharge operations
    processRechargeAction,
    validateRechargeAction
} from './wallet';

// ====================
// GOD (SUPER ADMIN) ACTIONS
// ====================
export {
    // System management
    getSystemStatsAction,
    updateSystemConfigAction,
    // User management
    getAllUsersAction,
    bulkUserOperationsAction,
    // Analytics
    getAnalyticsDataAction,
    generateReportAction
} from './god';

// ====================
// ROLE ACTIONS
// ====================
export {
    createRoleAction,
    updateRoleAction,
    deleteRoleAction,
    getRolesAction,
    getRoleByIdAction
} from './roles';

// ====================
// USER ACTIONS
// ====================
export {
    getUsersAction,
    createUserAction,
    updateUserAction,
    deleteUserAction,
    updateUserPermissionsAction
} from './users';