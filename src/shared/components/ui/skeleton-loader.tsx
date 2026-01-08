'use client'

import { cn } from '@/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
    animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
    className,
    variant = 'rectangular',
    animation = 'pulse',
    ...props
}: SkeletonProps) {
    const baseClasses = 'bg-muted animate-pulse'
    
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
        rounded: 'rounded-lg',
    }

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-[shimmer_2s_infinite]',
        none: '',
    }

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            {...props}
        />
    )
}

// Pre-built skeleton components
export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton variant="rounded" className="h-6 w-3/4" />
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-5/6" />
            <Skeleton variant="rounded" className="h-10 w-24" />
        </div>
    )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex gap-4">
                <Skeleton variant="rounded" className="h-4 w-1/4" />
                <Skeleton variant="rounded" className="h-4 w-1/4" />
                <Skeleton variant="rounded" className="h-4 w-1/4" />
                <Skeleton variant="rounded" className="h-4 w-1/4" />
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton variant="rounded" className="h-4 w-1/4" />
                    <Skeleton variant="rounded" className="h-4 w-1/4" />
                    <Skeleton variant="rounded" className="h-4 w-1/4" />
                    <Skeleton variant="rounded" className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    )
}

export function SkeletonAvatar() {
    return <Skeleton variant="circular" className="h-10 w-10" />
}

export function SkeletonButton() {
    return <Skeleton variant="rounded" className="h-10 w-24" />
}
