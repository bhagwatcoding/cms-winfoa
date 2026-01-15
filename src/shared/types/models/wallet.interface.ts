import { Document, Types } from "mongoose";
export interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWalletTransaction extends Document {
    userId: Types.ObjectId;
    amount: number;
    type: string;
    status: string;
    transactionId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
