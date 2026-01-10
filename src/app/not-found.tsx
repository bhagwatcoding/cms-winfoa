import Link from 'next/link';
import { Button } from '@/ui/button';
import { Home, FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-red-600 to-indigo-600 rounded-b-[4rem] z-0" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-3xl opacity-20" />
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-400 rounded-full blur-3xl opacity-20" />

            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 sm:p-12">

                    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <FileQuestion className="w-12 h-12 text-red-600" />
                    </div>

                    <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>

                    <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/" passHref>
                            <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                                <Home className="w-4 h-4" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-white/80 text-sm">
                    N.S.D. Education Portal
                </div>
            </div>
        </div>
    );
}
