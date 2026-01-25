// app/actions/pay-bill.ts
'use server';

import { BillResult } from './bill-validater'; // Your file path

export async function processBillPayment(formData: FormData) {
  const category = formData.get('category') as string;
  const amount = formData.get('amount') as string;
  const consumerId = formData.get('consumerId') as string;

  // 1. Validate
  const validation = await BillResult(category, amount, consumerId);

  if (!validation.success) {
    return { error: validation.error };
  }

  // 2. Proceed with Database/Payment Gateway logic
  console.log('Processing Payment for:', validation.category, validation.amount);

  return { success: true };
}
