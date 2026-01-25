'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withdrawMoney } from '../actions';
import { AmountInput, ActionButton, FormCard } from '@/features/wallet';
import { Button, Input, Label } from '@/ui';
import { Banknote, ArrowLeft, CheckCircle, Building2, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (amount < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      setError('Please fill all bank details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await withdrawMoney(amount, {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
      });
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
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
          <CheckCircle className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">Withdrawal Requested!</h1>
        <p className="mt-2 text-muted-foreground">
          ₹{amount.toLocaleString('en-IN')} will be credited to your bank account within 2-3
          business days.
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
          <h1 className="text-xl font-bold">Withdraw Money</h1>
          <p className="text-sm text-muted-foreground">Transfer to your bank account</p>
        </div>
      </div>

      {/* Bank Details Form */}
      <FormCard
        title="Bank Details"
        description="Enter your bank account information"
        icon={Building2}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="e.g., State Bank of India"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              placeholder="e.g., SBIN0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              maxLength={11}
            />
          </div>
        </div>
      </FormCard>

      {/* Amount Form */}
      <FormCard title="Withdrawal Amount" description="Minimum withdrawal is ₹100" icon={Banknote}>
        <div className="space-y-6">
          <AmountInput
            value={amount}
            onChange={setAmount}
            quickAmounts={[500, 1000, 2000, 5000, 10000]}
            min={100}
            max={100000}
          />

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <ActionButton
            label={`Withdraw ₹${amount.toLocaleString('en-IN')}`}
            loadingLabel="Processing..."
            loading={loading}
            disabled={amount < 100 || !bankName.trim() || !accountNumber.trim() || !ifscCode.trim()}
            icon={Banknote}
            onClick={handleWithdraw}
          />
        </div>
      </FormCard>

      {/* Info */}
      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Processing Time</p>
        <p className="mt-1">
          Withdrawals are processed within 2-3 business days. Bank holidays may cause delays.
        </p>
      </div>
    </div>
  );
}
