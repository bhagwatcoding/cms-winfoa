import Link from 'next/link';
import { Button } from '@/ui/button';
import { GraduationCap, ArrowRight, CheckCircle2, Shield, Zap, Users } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 rounded-lg p-2">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">EduPortal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Sign In
                        </Link>
                        <Link href="/login">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Manage Your Educational <span className="text-blue-600">Empire</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            The all-in-one platform for educational centers. Manage students, staff, exams, and finances with enterprise-grade tooling.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base">
                                Request Demo <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                                View Pricing
                            </Button>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        {[
                            { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security for your student data." },
                            { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance globally." },
                            { icon: Users, title: "Student Management", desc: "Complete lifecycle management from admission to alumni." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <f.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                <p className="text-slate-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2024 N.S.D. Education Portal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
