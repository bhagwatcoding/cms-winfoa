'use client'

import { useActionState } from 'react'
import { changePassword } from '@/features/account/actions'
import { Button, Input, Label } from '@/ui'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState<unknown, FormData>(changePassword, null)
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const togglePassword = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                </p>
            </div>

            <form action={formAction} className="space-y-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            required
                            disabled={isPending}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword('current')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.current ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            required
                            disabled={isPending}
                            minLength={8}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword('new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.new ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters long
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            required
                            disabled={isPending}
                            minLength={8}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => togglePassword('confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPasswords.confirm ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        {state.message || 'Password changed successfully!'}
                    </div>
                )}

                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing Password...
                        </>
                    ) : (
                        'Change Password'
                    )}
                </Button>
            </form>
        </div>
    )
}
