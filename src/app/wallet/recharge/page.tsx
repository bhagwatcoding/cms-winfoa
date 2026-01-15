"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rechargeWallet } from "../actions";
import {
    AmountInput,
    PaymentMethodSelector,
    ActionButton,
    FormCard,
} from "@/features/wallet";
import { Button } from "@/ui";
import {
    Plus,
    Smartphone,
    CreditCard,
    Building2,
    Wallet,
    ArrowLeft,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
    {
        id: "upi",
        name: "UPI",
        icon: Smartphone,
        description: "GPay, PhonePe, Paytm",
    },
    {
        id: "card",
        name: "Debit/Credit Card",
        icon: CreditCard,
        description: "Visa, Mastercard, RuPay",
    },
    {
        id: "netbanking",
        name: "Net Banking",
        icon: Building2,
        description: "All major banks",
    },
    {
        id: "wallet",
        name: "Other Wallets",
        icon: Wallet,
        description: "Amazon Pay, etc.",
    },
];

export default function RechargePage() {
    const router = useRouter();
    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRecharge = async () => {
        if (amount < 10) {
            setError("Minimum amount is ₹10");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await rechargeWallet(amount, paymentMethod);
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
                <h1 className="text-2xl font-bold">Recharge Successful!</h1>
                <p className="mt-2 text-muted-foreground">
                    ₹{amount.toLocaleString("en-IN")} has been added to your wallet.
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
                    <h1 className="text-xl font-bold">Add Money</h1>
                    <p className="text-sm text-muted-foreground">
                        Top up your wallet balance
                    </p>
                </div>
            </div>

            {/* Amount Form */}
            <FormCard
                title="Enter Amount"
                description="Choose or enter the amount to add"
                icon={Plus}
            >
                <div className="space-y-6">
                    <AmountInput
                        value={amount}
                        onChange={setAmount}
                        quickAmounts={[100, 500, 1000, 2000, 5000, 10000]}
                        min={10}
                        max={100000}
                    />

                    <PaymentMethodSelector
                        methods={paymentMethods}
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                    />

                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <ActionButton
                        label={`Add ₹${amount.toLocaleString("en-IN")}`}
                        loadingLabel="Processing..."
                        loading={loading}
                        disabled={amount < 10}
                        icon={Plus}
                        onClick={handleRecharge}
                    />
                </div>
            </FormCard>

            {/* Info */}
            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Secure Payment</p>
                <p className="mt-1">
                    Your payment is protected by 256-bit SSL encryption. We never store
                    your card details.
                </p>
            </div>
        </div>
    );
}
