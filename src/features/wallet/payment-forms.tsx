"use client";

import { cn } from "@/utils";
import { Button, Input, Label } from "@/ui";
import { LucideIcon, Loader2 } from "lucide-react";
import { useState } from "react";

// Amount input with quick select buttons
interface AmountInputProps {
    value: number;
    onChange: (value: number) => void;
    quickAmounts?: number[];
    currency?: string;
    min?: number;
    max?: number;
    className?: string;
}

export function AmountInput({
    value,
    onChange,
    quickAmounts = [100, 500, 1000, 2000, 5000],
    currency = "₹",
    min = 1,
    max = 100000,
    className,
}: AmountInputProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                    {currency}
                </span>
                <Input
                    type="number"
                    value={value || ""}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onChange(Math.min(Math.max(val, min), max));
                    }}
                    className="h-16 pl-10 text-3xl font-bold text-center"
                    placeholder="0"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amount) => (
                    <button
                        key={amount}
                        type="button"
                        onClick={() => onChange(amount)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition-all",
                            value === amount
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        )}
                    >
                        {currency}{amount.toLocaleString("en-IN")}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Payment method selector
interface PaymentMethod {
    id: string;
    name: string;
    icon: LucideIcon;
    description?: string;
}

interface PaymentMethodSelectorProps {
    methods: PaymentMethod[];
    selected: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function PaymentMethodSelector({
    methods,
    selected,
    onSelect,
    className,
}: PaymentMethodSelectorProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <Label>Payment Method</Label>
            <div className="grid gap-3 sm:grid-cols-2">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => onSelect(method.id)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 transition-all",
                            selected === method.id
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                    >
                        <div
                            className={cn(
                                "rounded-lg p-2",
                                selected === method.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}
                        >
                            <method.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium">{method.name}</p>
                            {method.description && (
                                <p className="text-xs text-muted-foreground">
                                    {method.description}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Action button with loading state
interface ActionButtonProps {
    label: string;
    loadingLabel?: string;
    loading?: boolean;
    disabled?: boolean;
    icon?: LucideIcon;
    variant?: "default" | "destructive" | "outline";
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
}

export function ActionButton({
    label,
    loadingLabel = "Processing...",
    loading = false,
    disabled = false,
    icon: Icon,
    variant = "default",
    onClick,
    type = "button",
    className,
}: ActionButtonProps) {
    return (
        <Button
            type={type}
            variant={variant}
            disabled={disabled || loading}
            onClick={onClick}
            className={cn(
                "h-12 w-full gap-2 text-base font-semibold",
                variant === "default" &&
                "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
                className
            )}
        >
            {loading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {loadingLabel}
                </>
            ) : (
                <>
                    {Icon && <Icon className="h-5 w-5" />}
                    {label}
                </>
            )}
        </Button>
    );
}

// Form card wrapper
interface FormCardProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

export function FormCard({
    title,
    description,
    icon: Icon,
    children,
    className,
}: FormCardProps) {
    return (
        <div className={cn("rounded-2xl border bg-card p-6", className)}>
            <div className="mb-6 flex items-center gap-3">
                {Icon && (
                    <div className="rounded-xl bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}
