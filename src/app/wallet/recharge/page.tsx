"use client";

import React from 'react';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WalletRechargePage() {
    const [amount, setAmount] = React.useState('');

    const quickAmounts = [500, 1000, 2000, 5000];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-3">
                        <WalletIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Wallet Recharge</h1>
                        <p className="text-sm text-slate-500">Add funds to your wallet</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recharge Amount</CardTitle>
                        <CardDescription>Choose or enter the amount you want to add</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Enter Amount (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Quick Select</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {quickAmounts.map((amt) => (
                                    <Button
                                        key={amt}
                                        variant={amount === String(amt) ? "default" : "outline"}
                                        onClick={() => setAmount(String(amt))}
                                    >
                                        ₹{amt}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Bonus Offer!</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Get 5% extra on recharges above ₹2000
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" size="lg">
                            Proceed to Payment
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500">Available Balance</p>
                            <p className="text-3xl font-bold text-green-600">₹107.00</p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-4 space-y-2">
                            <h4 className="text-sm font-medium">Payment Methods</h4>
                            <ul className="text-xs text-slate-600 space-y-1">
                                <li>• UPI</li>
                                <li>• Net Banking</li>
                                <li>• Credit/Debit Card</li>
                                <li>• Wallet</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
