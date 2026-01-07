
import Link from 'next/link';
import connectDB from '@/lib/db';
import PasswordResetToken from '@/lib/models/edu/PasswordResetToken';
import { ResetPasswordForm } from '@/components/center/auth/reset-password-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { XCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

interface Props {
    params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: Props) {
    const { token } = await params;

    await connectDB();
    const validToken = await PasswordResetToken.findOne({
        token,
        expiresAt: { $gt: new Date() }
    });

    const isTokenValid = !!validToken;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30">
            {/* Modern Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-blue-600/5 to-cyan-600/5" />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {isTokenValid ? (
                    <ResetPasswordForm token={token} />
                ) : (
                    <Card className="w-full max-w-md glass shadow-2xl border-slate-200/20">
                        <CardHeader className="text-center space-y-4 pb-6">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center border-2 border-red-200">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-900">Invalid Link</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    This password reset link is invalid or has expired.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 pb-6">
                            <Link href="/forgot-password" className="w-full">
                                <Button variant="default" className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-600/30">
                                    Request New Link
                                </Button>
                            </Link>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full h-11">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="absolute bottom-6 left-0 w-full text-center text-sm text-slate-500">
                &copy; 2025 N.S.D. Education Portal. All rights reserved.
            </div>
        </div>
    );
}
