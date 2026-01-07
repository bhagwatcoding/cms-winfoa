// UMP (User Management Portal) types

export interface IUser {
    _id: string
    name: string
    email: string
    phone?: string
    role: string
    status: 'active' | 'inactive' | 'suspended'
    walletBalance?: number
    lastLogin?: Date
    joinedAt: Date
    createdAt: Date
    updatedAt: Date
}

export interface IUserRegistry {
    _id: string
    userId: string
    registeredBy: string
    source: string
    metadata?: any
    createdAt: Date
}

export interface IUserStats {
    total: number
    active: number
    inactive: number
    suspended: number
    byRole: {
        admin: number
        center: number
        user: number
        developer: number
    }
}

export interface IUserFilters {
    role?: string
    status?: string
    search?: string
}
