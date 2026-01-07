'use client'

import { useActionState } from 'react'
import { Button, Input, Label } from '@/ui'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function forgotPasswordAction(prevState: any, formData: FormData) {
    'use server'

    try {
        const email = formData.get('email') as string

        if (!email) {
            return { error: 'Please provide your email address' }
        }

        // TODO: Implement password reset email sending
        // For now, just simulate success
        console.log(`[DEV] Password reset requested for: ${email}`)

        return {
            success: true,
            message: 'If an account exists with this email, you will receive password reset instructions.'
        }
    } catch (error: any) {
        return { error: error.message || 'Something went wrong. Please try again.' }
    }
}

export function ForgotPasswordForm() {
    const [state, formAction, isPending] = useActionState(forgotPasswordAction, null)

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Reset Password
                </h1>
                <p className="text-muted-foreground mt-2">
                    Enter your email and we'll send you reset instructions
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        disabled={isPending}
                        className="h-11"
                        autoFocus
                    />
                    <p className="text-xs text-muted-foreground">
                        We'll send password reset instructions to this email
                    </p>
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{state.error}</span>
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <div className="font-medium">Check your email!</div>
                            <div className="mt-1">{state.message}</div>
                        </div>
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
                            Sending instructions...
                        </>
                    ) : (
                        'Send Reset Instructions'
                    )}
                </Button>
            </form>

            <div className="text-center">
                <Link
                    href="/auth/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}
