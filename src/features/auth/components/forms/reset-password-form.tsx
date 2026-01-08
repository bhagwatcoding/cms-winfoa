'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Input, Label } from '@/ui'
import { Loader2, CheckCircle2 } from 'lucide-react'

async function resetPasswordAction(prevState: any, formData: FormData) {
    'use server'

    try {
        const token = formData.get('token') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!token) {
            return { error: 'Invalid or missing reset token' }
        }

        if (!password || !confirmPassword) {
            return { error: 'Please provide both password fields' }
        }

        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }

        if (password.length < 8) {
            return { error: 'Password must be at least 8 characters long' }
        }

        // TODO: Implement actual password reset logic
        // For now, just simulate success
        console.log(`[DEV] Password reset successful for token: ${token}`)

        return {
            success: true,
            message: 'Your password has been reset successfully!'
        }
    } catch (error: any) {
        return { error: error.message || 'Failed to reset password. Please try again.' }
    }
}

export function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [state, formAction, isPending] = useActionState(resetPasswordAction, null)

    if (!token) {
        return (
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h1>
                    <p className="text-muted-foreground mt-2">
                        This password reset link is invalid or has expired.
                    </p>
                    <a
                        href="/forgot-password"
                        className="inline-block mt-4 text-primary hover:underline"
                    >
                        Request a new reset link
                    </a>
                </div>
            </div>
        )
    }

    if (state?.success) {
        return (
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h1>
                    <p className="text-muted-foreground mt-2">
                        Your password has been changed. You can now log in with your new password.
                    </p>
                    <a
                        href="/login"
                        className="inline-block mt-6"
                    >
                        <Button size="lg">
                            Continue to Login
                        </Button>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create New Password
                </h1>
                <p className="text-muted-foreground mt-2">
                    Enter your new password below
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11"
                        minLength={8}
                        autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters long
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11"
                        minLength={8}
                    />
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{state.error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 text-base"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting password...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                <a
                    href="/login"
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    Back to login
                </a>
            </div>
        </div>
    )
}
