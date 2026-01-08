'use client'

import { useEffect } from 'react'
import { Button } from '@/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-red-600 to-rose-600 rounded-b-[4rem] z-0" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-3xl opacity-20" />
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-20" />

            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 sm:p-12">
                    <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 mb-2">Something went wrong!</h1>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">An unexpected error occurred</h2>

                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                        {error.message || 'We encountered an error while processing your request. Please try again.'}
                    </p>

                    {process.env.NODE_ENV === 'development' && error.digest && (
                        <div className="mb-6 p-4 bg-slate-100 rounded-lg text-left">
                            <p className="text-xs font-mono text-slate-600 break-all">
                                Error ID: {error.digest}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={reset}
                            className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-white/80 text-sm">
                    WINFOA Education Portal
                </div>
            </div>
        </div>
    )
}
