'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction } from '@/auth/actions/login'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Alert, AlertDescription } from '@/ui/alert'
import { Loader2, Mail, Lock, Shield } from 'lucide-react'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <form action={formAction}>
                        <CardContent className="space-y-4">
                            {state?.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        required
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="pl-10"
                                        required
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
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

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                    </Link>
                </p>
            </div>
        </div>
    )
}
