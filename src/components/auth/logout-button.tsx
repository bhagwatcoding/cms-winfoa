'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
    const { logout, loading } = useAuth();

    return (
        <Button
            variant="outline"
            onClick={logout}
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
            Logout
        </Button>
    );
}
