'use client'

import { updateEmailNotifications } from '@/features/account/actions'
import { Label } from '@/ui'
import { Switch } from '@/ui/switch'
import { useState, useTransition } from 'react'

interface NotificationSettingsProps {
    initialSettings: {
        marketing: boolean
        updates: boolean
        security: boolean
        newsletter: boolean
    }
}

export function NotificationSettings({ initialSettings }: NotificationSettingsProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleToggle = (key: keyof typeof settings) => {
        const newValue = !settings[key]
        setSettings(prev => ({ ...prev, [key]: newValue }))

        startTransition(async () => {
            const result = await updateEmailNotifications({
                ...settings,
                [key]: newValue
            })

            if (result.success) {
                setMessage({ type: 'success', text: 'Settings updated' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update' })
                // Revert on error
                setSettings(prev => ({ ...prev, [key]: !newValue }))
            }

            setTimeout(() => setMessage(null), 3000)
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                    Choose what email notifications you want to receive
                </p>
            </div>

            {message && (
                <div className={`p-3 text-sm rounded-lg ${message.type === 'success'
                    ? 'text-green-600 bg-green-50 border border-green-200'
                    : 'text-red-600 bg-red-50 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                        <Label htmlFor="marketing" className="text-base">
                            Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Receive emails about new features and promotions
                        </p>
                    </div>
                    <Switch
                        id="marketing"
                        checked={settings.marketing}
                        onCheckedChange={() => handleToggle('marketing')}
                        disabled={isPending}
                    />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                        <Label htmlFor="updates" className="text-base">
                            Product Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Get notified about product updates and improvements
                        </p>
                    </div>
                    <Switch
                        id="updates"
                        checked={settings.updates}
                        onCheckedChange={() => handleToggle('updates')}
                        disabled={isPending}
                    />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                    <div className="space-y-0.5">
                        <Label htmlFor="security" className="text-base font-medium">
                            Security Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Important notifications about your account security
                        </p>
                    </div>
                    <Switch
                        id="security"
                        checked={settings.security}
                        onCheckedChange={() => handleToggle('security')}
                        disabled={isPending}
                        className="data-[state=checked]:bg-red-600"
                    />
                </div>

                <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                        <Label htmlFor="newsletter" className="text-base">
                            Newsletter
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Weekly newsletter with tips and insights
                        </p>
                    </div>
                    <Switch
                        id="newsletter"
                        checked={settings.newsletter}
                        onCheckedChange={() => handleToggle('newsletter')}
                        disabled={isPending}
                    />
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Changes are saved automatically. Security alerts cannot be disabled.
            </p>
        </div>
    )
}
