'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authenticate } from '@/lib/actions/edu/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

function LoginForm() {
    const [state, dispatch] = useActionState(authenticate, {});
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <Card className="w-full max-w-md glass shadow-2xl border-slate-200/20">
            <CardHeader className="space-y-3 text-center pb-6">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <LogIn className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                    Sign in to access your Education Portal
                </CardDescription>
            </CardHeader>

            <CardContent>
                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 text-emerald-700 text-sm flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{message}</p>
                    </div>
                )}

                <form action={dispatch} className="space-y-5">
                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                            Email Address
                        </Label>
                        <div className="relative group">
                            <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="pl-11 h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        {state?.errors?.email && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {state.errors.email[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline underline-offset-2 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="pl-11 h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        {state?.errors?.password && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {state.errors.password[0]}
                            </p>
                        )}
                    </div>

                    {state?.message && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-red-700 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium">{state.message}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 group"
                    >
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline underline-offset-2 transition-colors">
                        Create account
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-violet-600/5 to-blue-600/5" />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full">
                <Suspense fallback={null}>
                    <LoginForm />
                </Suspense>
            </div>

            <div className="absolute bottom-6 left-0 w-full text-center text-sm text-slate-500">
                &copy; 2025 N.S.D. Education Portal. All rights reserved.
            </div>
        </div>
    );
}
