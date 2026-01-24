'use client'

import { useState, useActionState } from 'react'
import { deleteAccount } from '@/actions/account'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/ui/dialog'
import { Button, Input, Label } from '@/ui'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function DeleteAccountDialog() {
    const [open, setOpen] = useState(false)
    const [confirmation, setConfirmation] = useState('')
    const [state, formAction, isPending] = useActionState<unknown, FormData>(deleteAccount, null)

    const isConfirmed = confirmation === 'DELETE'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-3">
                        <p className="text-sm">
                            Deleting your account will:
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Remove all your personal information</li>
                            <li>• Delete your activity history</li>
                            <li>• Cancel any active subscriptions</li>
                            <li>• Permanently delete your data</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmation">
                            Type <span className="font-bold text-red-600">DELETE</span> to confirm
                        </Label>
                        <Input
                            id="confirmation"
                            name="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder="DELETE"
                            disabled={isPending}
                            className="font-mono"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            {state.error}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={!isConfirmed || isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete My Account'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
