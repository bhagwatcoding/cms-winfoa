// MyAccount subdomain types

export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletBalance: number;
  status: string;
  role: string;
  joinedAt: Date;
}

export interface IUserPreferences {
  _id: string;
  userId: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showActivity: boolean;
  };
}

export interface IActivityLog {
  _id: string;
  userId: string;
  action: string;
  resource: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface IWalletTransaction {
  _id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
