'use client'

import { useActionState, useState } from 'react'
import { createApiKey } from '@/actions/api-management/apikey'
import { Button, Input, Label } from '@/ui'
import { Loader2, Copy, Check } from 'lucide-react'

export function CreateApiKeyForm({ onSuccess }: { onSuccess?: () => void }) {
    const [state, formAction, isPending] = useActionState(createApiKey, null)
    const [copied, setCopied] = useState(false)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            {!state?.success ? (
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">API Key Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="My API Key"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                        <Input
                            id="rateLimit"
                            name="rateLimit"
                            type="number"
                            defaultValue={1000}
                            min={1}
                            disabled={isPending}
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            {state.error}
                        </div>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create API Key'
                        )}
                    </Button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-2">
                            API Key Created Successfully!
                        </p>
                        <p className="text-xs text-green-700">
                            Save this key - you won&apos;t be able to see it again!
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Your API Key</Label>
                        <div className="flex gap-2">
                            <Input
                                value={state.data.key}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => copyToClipboard(state.data.key)}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            onSuccess?.()
                            window.location.reload()
                        }}
                        className="w-full"
                    >
                        Done
                    </Button>
                </div>
            )}
        </div>
    )
}
