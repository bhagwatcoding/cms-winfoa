import {
  Zap,
  Wifi,
  Phone,
  Tv,
  GraduationCap,
  Droplets,
  FireExtinguisherIcon,
  LucideIcon,
} from 'lucide-react';
import { z } from 'zod';

export interface BillInterFace {
  category?: string;
  amount?: number;
  consumerId?: string;
  success?: boolean;
  error?: string;
}

export const BillSchema = z.object({
  category: z.string().min(1, 'Please select a bill category'),

  // 2. USE COERCE (Handles "500" string -> 500 number automatically)
  amount: z.coerce
    .number()
    .min(1, 'Please enter the bill amount')
    .max(100000, 'Amount should be less than 100000'), // Fixed limit to match message

  consumerId: z
    .string()
    .min(1, 'Please enter consumer/account ID')
    .max(21, 'Please enter Valid consumer/account ID'),

  success: z.boolean().optional(),
  error: z.string().optional(),
});

export async function BillResult(
  category: string,
  amount: number | string, // Allow string input here for safety
  consumerId: string
): Promise<BillInterFace> {
  const result = BillSchema.safeParse({
    category,
    amount,
    consumerId,
  });

  if (!result.success) {
    // 3. FIX ERROR MESSAGE (Get the first readable error)
    const firstErrorMessage = result.error.issues[0].message;

    return {
      category,
      amount: Number(amount) || 0, // Fallback if amount was invalid
      consumerId,
      success: false,
      error: firstErrorMessage, // Returns clean text, not JSON
    };
  }

  return {
    category: result.data.category,
    amount: result.data.amount,
    consumerId: result.data.consumerId,
    success: true,
  };
}

export interface BillCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}
export const billCategories: BillCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    icon: Phone,
    color: 'text-green-500 bg-green-500/10',
  },
  {
    id: 'electricity',
    name: 'Electricity',
    icon: Zap,
    color: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: 'internet',
    name: 'Internet',
    icon: Wifi,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    id: 'dth',
    name: 'DTH/Cable',
    icon: Tv,
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    id: 'water',
    name: 'Water',
    icon: Droplets,
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: FireExtinguisherIcon,
    color: 'text-orange-500 bg-orange-500/10',
  },
];
