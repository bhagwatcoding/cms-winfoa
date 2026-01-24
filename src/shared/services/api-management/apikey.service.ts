import { ApiKey, ApiRequest } from '@/models'
import { connectDB } from '@/lib/db'

export class ApiKeyService {
    /**
     * Create new API key
     */
    static async createApiKey(
        userId: string,
        data: {
            name: string
            permissions?: string[]
            rateLimit?: number
            expiresAt?: Date
        }
    ) {
        await connectDB()

        // Generate key
        const { key, prefix, hashedKey } = ApiKey.generateKey()

        // Create API key
        const apiKey = await ApiKey.create({
            userId,
            name: data.name,
            key, // Will be stored temporarily for display
            keyPrefix: prefix,
            hashedKey,
            permissions: data.permissions || ['read'],
            rateLimit: data.rateLimit || 1000,
            expiresAt: data.expiresAt,
            isActive: true
        })

        // Return key with actual value (only time it's shown)
        return {
            ...apiKey.toObject(),
            key // Full key for one-time display
        }
    }

    /**
     * Get all API keys for user
     */
    static async getUserApiKeys(userId: string) {
        await connectDB()

        const keys = await ApiKey.find({ userId })
            .select('-hashedKey -key')
            .sort({ createdAt: -1 })

        return keys
    }

    /**
     * Get API key by ID
     */
    static async getApiKeyById(keyId: string, userId: string) {
        await connectDB()

        const apiKey = await ApiKey.findOne({
            _id: keyId,
            userId
        }).select('-hashedKey -key')

        if (!apiKey) {
            throw new Error('API key not found')
        }

        return apiKey
    }

    /**
     * Verify API key
     */
    static async verifyApiKey(providedKey: string) {
        await connectDB()

        const prefix = providedKey.substring(0, 12)

        const apiKey = await ApiKey.findOne({
            keyPrefix: prefix,
            isActive: true
        }).select('+hashedKey').populate('userId')

        if (!apiKey) {
            return null
        }

        // Check expiration
        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return null
        }

        // Verify key
        if (!apiKey.verifyKey(providedKey)) {
            return null
        }

        // Update last used
        await apiKey.incrementRequests()

        return apiKey
    }

    /**
     * Revoke API key
     */
    static async revokeApiKey(keyId: string, userId: string) {
        await connectDB()

        const apiKey = await ApiKey.findOneAndUpdate(
            { _id: keyId, userId },
            { isActive: false },
            { new: true }
        )

        if (!apiKey) {
            throw new Error('API key not found')
        }

        return apiKey
    }

    /**
     * Delete API key
     */
    static async deleteApiKey(keyId: string, userId: string) {
        await connectDB()

        const apiKey = await ApiKey.findOneAndDelete({
            _id: keyId,
            userId
        })

        if (!apiKey) {
            throw new Error('API key not found')
        }

        // Delete associated request logs
        await ApiRequest.deleteMany({ apiKeyId: keyId })

        return { success: true }
    }

    /**
     * Get API key usage statistics
     */
    static async getApiKeyStats(keyId: string, userId: string) {
        await connectDB()

        const apiKey = await ApiKey.findOne({ _id: keyId, userId })

        if (!apiKey) {
            throw new Error('API key not found')
        }

        // Get request statistics
        const stats = await ApiRequest.aggregate([
            { $match: { apiKeyId: apiKey._id } },
            {
                $group: {
                    _id: null,
                    totalRequests: { $sum: 1 },
                    avgResponseTime: { $avg: '$responseTime' },
                    successfulRequests: {
                        $sum: {
                            $cond: [{ $lt: ['$statusCode', 400] }, 1, 0]
                        }
                    },
                    failedRequests: {
                        $sum: {
                            $cond: [{ $gte: ['$statusCode', 400] }, 1, 0]
                        }
                    }
                }
            }
        ])

        return {
            apiKey: {
                name: apiKey.name,
                prefix: apiKey.keyPrefix,
                requestCount: apiKey.requestCount,
                lastUsedAt: apiKey.lastUsedAt,
                rateLimit: apiKey.rateLimit
            },
            stats: stats[0] || {
                totalRequests: 0,
                avgResponseTime: 0,
                successfulRequests: 0,
                failedRequests: 0
            }
        }
    }
}
