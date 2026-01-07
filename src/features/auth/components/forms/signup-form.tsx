'use client'

import { useActionState } from 'react'
import { signupAction } from '@/auth/actions/signup'
import { Button, Input, Label, Checkbox } from '@/ui'
import { Loader2 } from 'lucide-react'

export function SignupForm() {
    const [state, formAction, isPending] = useActionState(signupAction, null)

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create Account
                </h1>
                <p className="text-muted-foreground mt-2">
                    Get started with your free account today
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            required
                            disabled={isPending}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            required
                            disabled={isPending}
                            className="h-11"
                        />
                    </div>
                </div>

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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11"
                        minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters with letters and numbers
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
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

                <div className="flex items-start space-x-2">
                    <Checkbox id="terms" name="terms" required disabled={isPending} className="mt-1" />
                    <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:underline font-medium">
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-primary hover:underline font-medium">
                            Privacy Policy
                        </a>
                    </label>
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
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                Already have an account?{' '}
                <a
                    href="/auth/login"
                    className="text-primary font-medium hover:underline"
                >
                    Sign in
                </a>
            </div>
        </div>
    )
}
