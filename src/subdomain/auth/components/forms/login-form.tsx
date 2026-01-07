'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/auth/actions/login'
import { Button, Input, Label } from '@/components/ui/'
import { OAuthButtons } from '../oauth/oauth-buttons'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground mt-2">
                    Sign in to your account to continue
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
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:underline"
                            tabIndex={-1}
                        >
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11"
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
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <OAuthButtons />

            <div className="text-center text-sm">
                Don't have an account?{' '}
                <a
                    href="/auth/signup"
                    className="text-primary font-medium hover:underline"
                >
                    Create account
                </a>
            </div>
        </div>
    )
}
