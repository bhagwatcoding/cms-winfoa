export const APP_NAME = "N.S.D. Education Portal";
export const APP_DESCRIPTION = "Modern Educational Branch Management System";
export const DEFAULT_BRANCH_CODE = "BR-141";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/education";

export const ROUTES = {
    HOME: "/",
    ADMISSION: "/admission",
    STUDENTS: "/students",
    ADMIT_CARD: "/admit-card",
    RESULTS: "/results",
    DOWNLOADS: "/downloads",
    CERTIFICATE: "/certificate",
    WALLET_RECHARGE: "/wallet/recharge",
    WALLET_TRANSACTIONS: "/wallet/transactions",
    OFFERS: "/offers",
    TERMS: "/terms",
    EMPLOYEES: "/employees",
    NOTIFICATIONS: "/notifications",
    SUPPORT: "/support",
    CHANGE_PASSWORD: "/change-password",
    COURSES: "/courses",
} as const;
