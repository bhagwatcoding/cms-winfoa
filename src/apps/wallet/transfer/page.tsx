'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { transferMoney } from '../actions';
import { AmountInput, ActionButton, FormCard } from '@/features/wallet';
import { Button, Input, Label } from '@/ui';
import { Send, ArrowLeft, CheckCircle, User, AtSign } from 'lucide-react';
import Link from 'next/link';

export default function TransferPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (amount < 1) {
      setError('Minimum amount is ₹1');
      return;
    }
    if (!recipientEmail.trim()) {
      setError('Please enter recipient email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await transferMoney(recipientEmail.trim(), amount);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/wallet'), 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
        <h1 className="text-2xl font-bold">Transfer Successful!</h1>
        <p className="mt-2 text-muted-foreground">
          ₹{amount.toLocaleString('en-IN')} has been sent to {recipientEmail}.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Redirecting to wallet...</p>
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
          <h1 className="text-xl font-bold">Transfer Money</h1>
          <p className="text-sm text-muted-foreground">Send money to another user</p>
        </div>
      </div>

      {/* Transfer Form */}
      <FormCard
        title="Recipient Details"
        description="Enter the recipient's email address"
        icon={User}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </FormCard>

      <FormCard
        title="Transfer Amount"
        description="Choose or enter the amount to send"
        icon={Send}
      >
        <div className="space-y-6">
          <AmountInput
            value={amount}
            onChange={setAmount}
            quickAmounts={[100, 500, 1000, 2000, 5000]}
            min={1}
            max={50000}
          />

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <ActionButton
            label={`Send ₹${amount.toLocaleString('en-IN')}`}
            loadingLabel="Sending..."
            loading={loading}
            disabled={amount < 1 || !recipientEmail.trim()}
            icon={Send}
            onClick={handleTransfer}
          />
        </div>
      </FormCard>

      {/* Info */}
      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Instant Transfer</p>
        <p className="mt-1">
          Money will be credited to the recipient&apos;s wallet instantly. This action cannot be
          undone.
        </p>
      </div>
    </div>
  );
}
