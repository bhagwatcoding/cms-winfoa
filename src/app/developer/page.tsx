import { Book, Code, Zap, Shield } from 'lucide-react'

export default function DeveloperPortalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Developer Portal
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4">
                        Everything you need to integrate with WINFOA API
                    </p>
                </div>

                {/* Quick Start */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-600 font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Create an API Key</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate your API key from the API Keys page
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-600 font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Make Your First Request</h3>
                                <div className="mt-2 p-4 bg-gray-950 rounded-lg">
                                    <code className="text-sm text-green-400">
                                        curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
                                        &nbsp;&nbsp;https://api.winfoa.com/v1/users
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-pink-600 font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Start Building</h3>
                                <p className="text-sm text-muted-foreground">
                                    Explore our API documentation and examples below
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                            <Book className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Documentation</h3>
                        <p className="text-sm text-muted-foreground">
                            Complete API reference with examples
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                            <Code className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Code Examples</h3>
                        <p className="text-sm text-muted-foreground">
                            Ready-to-use code in multiple languages
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-pink-600" />
                        </div>
                        <h3 className="font-semibold mb-2">API Playground</h3>
                        <p className="text-sm text-muted-foreground">
                            Test API calls directly in your browser
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Security</h3>
                        <p className="text-sm text-muted-foreground">
                            Best practices for secure integration
                        </p>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
                    <div className="space-y-4">
                        {[
                            { method: 'GET', path: '/v1/users', desc: 'List all users' },
                            { method: 'POST', path: '/v1/users', desc: 'Create a new user' },
                            { method: 'GET', path: '/v1/users/{id}', desc: 'Get user by ID' },
                            { method: 'PUT', path: '/v1/users/{id}', desc: 'Update user' },
                            { method: 'DELETE', path: '/v1/users/{id}', desc: 'Delete user' },
                        ].map((endpoint, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <span
                                    className={`px-3 py-1 rounded text-xs font-mono font-bold ${endpoint.method === 'GET'
                                            ? 'bg-green-100 text-green-700'
                                            : endpoint.method === 'POST'
                                                ? 'bg-blue-100 text-blue-700'
                                                : endpoint.method === 'PUT'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {endpoint.method}
                                </span>
                                <code className="flex-1 font-mono text-sm">{endpoint.path}</code>
                                <span className="text-sm text-muted-foreground">
                                    {endpoint.desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const metadata = {
    title: 'Developer Portal - WINFOA',
    description: 'API documentation and developer resources'
}
