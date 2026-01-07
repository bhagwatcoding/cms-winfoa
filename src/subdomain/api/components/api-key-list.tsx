'use client'

import { revokeApiKey, deleteApiKey } from '@/api/actions/apikey'
import { Button } from '@/components/ui'
import { Key, Trash2, Ban } from 'lucide-react'
import { useState } from 'react'

interface ApiKey {
    _id: string
    name: string
    keyPrefix: string
    requestCount: number
    rateLimit: number
    isActive: boolean
    lastUsedAt?: Date
    createdAt: Date
}

export function ApiKeyList({ keys }: { keys: ApiKey[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleRevoke = async (keyId: string) => {
        if (!confirm('Revoke this API key?')) return
        setLoading(keyId)
        await revokeApiKey(keyId)
        setLoading(null)
        window.location.reload()
    }

    const handleDelete = async (keyId: string) => {
        if (!confirm('Delete this API key permanently?')) return
        setLoading(keyId)
        await deleteApiKey(keyId)
        setLoading(null)
        window.location.reload()
    }

    if (keys.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
                <Key className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No API Keys</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Create your first API key to get started
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {keys.map((key) => (
                <div
                    key={key._id}
                    className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{key.name}</h3>
                                {!key.isActive && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                        Revoked
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono mt-1">
                                {key.keyPrefix}...
                            </p>
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Requests: {key.requestCount.toLocaleString()}</span>
                                <span>Limit: {key.rateLimit}/hour</span>
                                {key.lastUsedAt && (
                                    <span>
                                        Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {key.isActive && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevoke(key._id)}
                                    disabled={loading === key._id}
                                >
                                    <Ban className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(key._id)}
                                disabled={loading === key._id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
