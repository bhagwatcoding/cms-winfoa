import { getApiKeys } from '@/api/actions/apikey'
import { CreateApiKeyForm } from '@/api/components/create-api-key-form'
import { ApiKeyList } from '@/api/components/api-key-list'
import { redirect } from 'next/navigation'

export default async function ApiKeysPage() {
    const result = await getApiKeys()

    if ('error' in result) {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        API Keys
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your API keys and monitor usage
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Key List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Your API Keys</h2>
                            <ApiKeyList keys={result.data} />
                        </div>
                    </div>

                    {/* Right - Create Key */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Create New Key</h2>
                            <CreateApiKeyForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const metadata = {
    title: 'API Keys - WINFOA',
    description: 'Manage your API keys'
}
