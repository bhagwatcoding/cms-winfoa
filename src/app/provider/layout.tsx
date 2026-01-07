import { ReactNode } from 'react';

export default function GodLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
