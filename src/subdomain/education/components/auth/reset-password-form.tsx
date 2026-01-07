'use client';

import { useActionState } from 'react';
import { resetPassword } from '@/lib/actions/edu/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle, Shield, ArrowRight } from 'lucide-react';

export function ResetPasswordForm({ token }: { token: string }) {
    const [state, dispatch] = useActionState(resetPassword, {});

    return (
        <Card className="w-full max-w-md glass shadow-2xl border-slate-200/20">
            <CardHeader className="space-y-3 text-center pb-6">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Reset Password
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                    Enter your new password below
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form action={dispatch} className="space-y-5">
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-2.5">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                            New Password
                        </Label>
                        <div className="relative group">
                            <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="pl-11 h-11 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        {state?.errors?.password && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {state.errors.password[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                            Confirm Password
                        </Label>
                        <div className="relative group">
                            <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="pl-11 h-11 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        {state?.errors?.confirmPassword && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {state.errors.confirmPassword[0]}
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
                        className="w-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:shadow-cyan-600/40 transition-all duration-300 group"
                    >
                        Reset Password
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
