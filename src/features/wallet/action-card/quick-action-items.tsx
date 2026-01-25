import { Plus, Send, Receipt, Banknote } from 'lucide-react';
import { QuickActionItem } from './quick-actions';

export const quickActions: QuickActionItem[] = [
  {
    id: 'recharge',
    label: 'Add Money',
    description: 'Top up wallet',
    icon: Plus,
    href: 'recharge',
    color: 'green',
  },
  {
    id: 'transfer',
    label: 'Transfer',
    description: 'Send money',
    icon: Send,
    href: 'transfer',
    color: 'blue',
  },
  {
    id: 'bills',
    label: 'Pay Bills',
    description: 'Utilities & more',
    icon: Receipt,
    href: 'bills',
    color: 'pink',
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    description: 'To bank account',
    icon: Banknote,
    href: 'withdraw',
    color: 'orange',
  },
];
