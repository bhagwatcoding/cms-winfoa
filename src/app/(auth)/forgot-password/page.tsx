'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/actions/edu/password-reset';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [state, dispatch] = useActionState(requestPasswordReset, {});

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-purple-600/5" />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md glass shadow-2xl border-slate-200/20 relative z-10">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600">
                        Enter your email and we'll send you a reset link
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {state.success ? (
                        <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in duration-300">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center border-2 border-emerald-200">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-xl text-slate-900">Check your email</h3>
                                <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                                    {state.message}
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className={buttonVariants({
                                    variant: "outline",
                                    className: "mt-4 shadow-sm hover:shadow-md transition-shadow"
                                })}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form action={dispatch} className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                    Email Address
                                </Label>
                                <div className="relative group">
                                    <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="pl-11 h-11 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>
                                {state?.errors?.email && (
                                    <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {state.errors.email[0]}
                                    </p>
                                )}
                            </div>

                            {state?.message && !state.success && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-red-700 text-sm flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-medium">{state.message}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300 group"
                            >
                                <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                </CardContent>

                {!state.success && (
                    <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
                        <Link
                            href="/login"
                            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </CardFooter>
                )}
            </Card>

            <div className="absolute bottom-6 left-0 w-full text-center text-sm text-slate-500">
                &copy; 2025 N.S.D. Education Portal. All rights reserved.
            </div>
        </div>
    );
}
