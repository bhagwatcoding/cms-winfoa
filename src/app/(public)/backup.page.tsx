import Link from 'next/link'
import { Button } from '@/ui/button'
import {
    GraduationCap,
    Users,
    BookOpen,
    Award,
    TrendingUp,
    Shield,
    Zap,
    Globe,
    ArrowRight,
    CheckCircle2,
    Star
} from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200 mb-6">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-indigo-900">
                                #1 Education Management Platform
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Transform Education
                            </span>
                            <br />
                            <span className="text-gray-900">
                                With Modern Technology
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Complete multi-subdomain platform for managing students, courses, staff, and everything in between.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/auth/signup">
                                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/developer">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                                    View Documentation
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-6 justify-center items-center mt-12 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span>Setup in 5 minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Everything You Need
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features to manage your entire education ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Student Management',
                                description: 'Comprehensive student profiles, attendance tracking, and performance analytics',
                                color: 'blue'
                            },
                            {
                                icon: BookOpen,
                                title: 'Course Management',
                                description: 'Create, organize, and deliver engaging courses with ease',
                                color: 'indigo'
                            },
                            {
                                icon: GraduationCap,
                                title: 'Staff Portal',
                                description: 'Empower your team with dedicated tools and dashboards',
                                color: 'purple'
                            },
                            {
                                icon: Award,
                                title: 'Results & Certificates',
                                description: 'Automated result processing and certificate generation',
                                color: 'pink'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Analytics Dashboard',
                                description: 'Real-time insights and data-driven decision making',
                                color: 'orange'
                            },
                            {
                                icon: Shield,
                                title: 'Enterprise Security',
                                description: 'Bank-level security with OAuth and role-based access',
                                color: 'green'
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                            >
                                <div className={`h-14 w-14 rounded-xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10,000+', label: 'Active Users' },
                            { value: '500+', label: 'Institutions' },
                            { value: '1M+', label: 'API Requests/month' },
                            { value: '99.9%', label: 'Uptime' }
                        ].map((stat, i) => (
                            <div key={i} className="p-6">
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-xl text-indigo-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subdomains Showcase */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Multiple Specialized Portals
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Each subdomain tailored for specific needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Auth Portal',
                                url: 'auth.winfoa.com',
                                icon: Shield,
                                description: 'Secure authentication with OAuth support',
                                gradient: 'from-blue-500 to-indigo-500'
                            },
                            {
                                name: 'My Account',
                                url: 'myaccount.winfoa.com',
                                icon: Users,
                                description: 'Personal dashboard and settings',
                                gradient: 'from-indigo-500 to-purple-500'
                            },
                            {
                                name: 'API Gateway',
                                url: 'api.winfoa.com',
                                icon: Zap,
                                description: 'RESTful API with rate limiting',
                                gradient: 'from-purple-500 to-pink-500'
                            },
                            {
                                name: 'Developer Portal',
                                url: 'developer.winfoa.com',
                                icon: BookOpen,
                                description: 'Complete API documentation',
                                gradient: 'from-pink-500 to-orange-500'
                            },
                            {
                                name: 'Education Center',
                                url: 'center.winfoa.com',
                                icon: GraduationCap,
                                description: 'Main education management hub',
                                gradient: 'from-orange-500 to-red-500'
                            },
                            {
                                name: 'Admin (UMP)',
                                url: 'ump.winfoa.com',
                                icon: Globe,
                                description: 'Universal management portal',
                                gradient: 'from-red-500 to-blue-500'
                            }
                        ].map((subdomain, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-transparent hover:scale-105"
                            >
                                <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${subdomain.gradient} flex items-center justify-center mb-4`}>
                                    <subdomain.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{subdomain.name}</h3>
                                <p className="text-sm text-gray-500 font-mono mb-3">{subdomain.url}</p>
                                <p className="text-gray-600 text-sm">{subdomain.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-2xl mx-auto">
                        Join thousands of institutions already using WINFOA
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-gray-100">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-gray-400">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-lg mb-4">
                        Built with ❤️ using Next.js, TypeScript, and Shadcn UI
                    </p>
                    <p className="text-sm">
                        © 2026 WINFOA. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export const metadata = {
    title: 'WINFOA - Transform Education With Modern Technology',
    description: 'Complete multi-subdomain education management platform with student management, courses, staff portal, and more.'
}
