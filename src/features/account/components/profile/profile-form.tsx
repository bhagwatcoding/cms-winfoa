'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/actions/account'
import { Button, Input, Label } from '@/ui'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
    initialData: {
        firstName?: string
        lastName?: string
        email: string
        phone?: string
    }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState<unknown, FormData>(updateProfile, null)

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                    Update your personal details and contact information
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={initialData.firstName}
                            required
                            disabled={isPending}
                            placeholder="John"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={initialData.lastName}
                            required
                            disabled={isPending}
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={initialData.email}
                        disabled
                        className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                        Contact support to change your email address
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={initialData.phone}
                        disabled={isPending}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                {state?.error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        Profile updated successfully!
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
