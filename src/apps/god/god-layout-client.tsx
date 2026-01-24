"use client";

import { PropsWithChildren } from "react";
import { ErrorBoundary } from "@/ui";
import { Suspense } from 'react'
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { GodSideBar } from "@/features/god/layout/sidebar";

export function GodLayoutClient({ children }: PropsWithChildren) {
    const pathname = usePathname();
    console.log(pathname);
    return (
        <GodSideBar>
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin" />
                    </div>
                }>
                    {children}
                </Suspense>
            </ErrorBoundary>
        </GodSideBar>
    );
}
