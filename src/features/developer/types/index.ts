// Developer subdomain types

export interface IApiKey {
    _id: string
    userId: string
    name: string
    key: string
    secret?: string
    permissions: string[]
    isActive: boolean
    lastUsed?: Date
    createdAt: Date
    updatedAt: Date
}

export interface IApiRequest {
    _id: string
    apiKeyId: string
    endpoint: string
    method: string
    statusCode: number
    responseTime: number
    ipAddress: string
    userAgent: string
    createdAt: Date
}

export interface IApiStats {
    totalKeys: number
    activeKeys: number
    inactiveKeys: number
    totalRequests: number
    avgResponseTime: number
}
