import mongoose, { Schema, Document } from 'mongoose';

export interface ICenter extends Document {
    name: string;
    code: string;
    address: string;
    contact: string;
    walletBalance: number;
}

const CenterSchema: Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Center || mongoose.model<ICenter>('Center', CenterSchema);
