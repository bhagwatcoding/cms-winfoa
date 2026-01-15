"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { payBill } from "@/app/wallet/actions";
import { AmountInput, ActionButton, FormCard } from "@/features/wallet";
import { Button, Input, Label } from "@/ui";
import { billCategories } from "@/features/wallet/bills/bill-validater";
import { Receipt, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/utils";
import { processBillPayment } from "./pay-bill";
import { BillSchema } from "./bill-validater";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"


// Create a type for the form based on the schema
type BillFormValues = z.infer<typeof BillSchema>

export default function BillsPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [amount, setAmount] = useState(0);
    const [consumerId, setConsumerId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedCategoryData = billCategories.find((c) => c.id === selectedCategory);

    const handlePayBill = async () => {
        // 1. CLEAR OLD ERRORS
        setError(null);

        // 2. PREPARE DATA FROM STATE
        // Ensure we handle the null case for category safely
        const payload = {
            category: selectedCategoryData?.name || "",
            amount: Number(amount),
            consumerId: consumerId,
        };

        // 3. VALIDATE USING ZOD MANUALLY
        // .safeParse() does not crash if validation fails
        const validation = BillSchema.safeParse(payload);

        if (!validation.success) {
            // Get the first error message and show it
            setError(validation.error.issues[0].message);
            return; // Stop execution
        }

        // 4. IF VALID, PROCEED
        setLoading(true);

        try {
            const result = await payBill(amount, {
                category: selectedCategory!, // We know it's valid now
                consumerId: consumerId.trim(),
            });

            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/wallet"), 2000);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    if (success) {
        return (
            <div className="mx-auto max-w-md px-4 py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold">Bill Paid Successfully!</h1>
                <p className="mt-2 text-muted-foreground">
                    ₹{amount.toLocaleString("en-IN")} has been paid for your {selectedCategoryData?.name} bill.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                    Redirecting to wallet...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/wallet">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Pay Bills</h1>
                    <p className="text-sm text-muted-foreground">
                        Pay all your utility bills in one place
                    </p>
                </div>
            </div>

            {/* Category Selection */}
            <FormCard
                title="Select Category"
                description="Choose the type of bill to pay"
                icon={Receipt}
            >
                <div className="grid grid-cols-3 gap-3">
                    {billCategories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                                    isSelected
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                )}
                            >
                                <div className={cn("rounded-lg p-2", category.color)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </FormCard>

            {/* Bill Details */}
            {selectedCategory && (
                <FormCard
                    title={`${selectedCategoryData?.name} Bill`}
                    description="Enter your bill details"
                    icon={selectedCategoryData?.icon || Receipt}
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="consumerId">Consumer/Account ID</Label>
                            <Input
                                id="consumerId"
                                placeholder="Enter your consumer ID"
                                value={consumerId}
                                onChange={(e) => setConsumerId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Bill Amount</Label>
                            <AmountInput
                                value={amount}
                                onChange={setAmount}
                                quickAmounts={[200, 500, 1000, 2000, 3000]}
                                min={1}
                                max={100000}
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <ActionButton
                            label={`Pay ₹${amount.toLocaleString("en-IN")}`}
                            loadingLabel="Processing..."
                            loading={loading}
                            disabled={amount < 1 || !consumerId.trim()}
                            icon={Receipt}
                            onClick={handlePayBill}
                        />
                    </div>
                </FormCard>
            )}

            {/* Info */}
            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Instant Confirmation</p>
                <p className="mt-1">
                    Bill payments are processed instantly and you'll receive a confirmation immediately.
                </p>
            </div>
        </div>
    );
}
