'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import Link from 'next/link';

interface TokenValidationResult {
    success: boolean;
    message: string;
    user?: {
        name: string;
        email: string;
        role: string;
    };
    redirectUrl?: string;
}

export default function TokenPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [result, setResult] = useState<TokenValidationResult | null>(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Session validation failed');
                }

                const data = await response.json();

                if (data.success && data.user) {
                    const redirectUrl = searchParams.get('redirect') || getRedirectUrl(data.user.role);
                    setResult({
                        success: true,
                        message: 'Session validated successfully',
                        user: data.user,
                        redirectUrl,
                    });
                    setStatus('success');
                } else {
                    throw new Error('Invalid session');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                setResult({
                    success: false,
                    message: error instanceof Error ? error.message : 'Token validation failed',
                });
                setStatus('error');
            }
        };

        validateToken();
    }, [searchParams]);

    useEffect(() => {
        if (status === 'success' && result?.redirectUrl) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push(result.redirectUrl!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, result, router]);

    function getRedirectUrl(role: string): string {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
        const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';

        switch (role) {
            case 'super-admin':
                return `${protocol}://ump.${rootDomain}`;
            case 'provider':
                return `${protocol}://provider.${rootDomain}`;
            case 'staff':
                return `${protocol}://skills.${rootDomain}`;
            default:
                return `${protocol}://myaccount.${rootDomain}`;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-lg">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Session Validation
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Verifying your authentication status
                    </p>
                </motion.div>

                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                        <CardHeader className="space-y-1 pb-4 text-center">
                            {status === 'loading' && (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Validating Session</CardTitle>
                                    <CardDescription>
                                        Please wait while we verify your authentication...
                                    </CardDescription>
                                </>
                            )}

                            {status === 'success' && result && (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <CheckCircle className="w-16 h-16 text-green-500" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-green-600">
                                        Session Valid
                                    </CardTitle>
                                    <CardDescription>
                                        Welcome back, {result.user?.name}!
                                    </CardDescription>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <XCircle className="w-16 h-16 text-red-500" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-red-600">
                                        Session Invalid
                                    </CardTitle>
                                    <CardDescription>
                                        {result?.message || 'Your session has expired or is invalid'}
                                    </CardDescription>
                                </>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {status === 'success' && result?.user && (
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Email</span>
                                        <span className="font-medium">{result.user.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Role</span>
                                        <span className="font-medium capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                                            {result.user.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Redirect in</span>
                                        <span className="font-medium text-blue-600">{countdown}s</span>
                                    </div>
                                </div>
                            )}

                            {status === 'loading' && (
                                <div className="flex items-center justify-center py-4">
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-blue-600 h-2 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2, ease: 'easeInOut' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-3">
                            {status === 'success' && result?.redirectUrl && (
                                <Button
                                    onClick={() => router.push(result.redirectUrl!)}
                                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold"
                                >
                                    Continue Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            )}

                            {status === 'error' && (
                                <>
                                    <Link href="/login" className="w-full">
                                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold">
                                            Sign In
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/signup" className="w-full">
                                        <Button variant="outline" className="w-full h-12 border-2 font-bold">
                                            Create Account
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-sm text-slate-500 mt-6"
                >
                    Secure authentication powered by session tokens
                </motion.p>
            </div>
        </div>
    );
}
