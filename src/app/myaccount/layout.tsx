import { ReactNode } from 'react';

export default function MyAccountLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
