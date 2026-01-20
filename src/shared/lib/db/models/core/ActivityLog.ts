import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import { ActionType, ResourceType } from "@/types";

export interface IActivityLog extends Document {
  actorId: mongoose.Types.ObjectId;
  action: ActionType;
  resource: ResourceType;
  resourceId?: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ActionType, required: true },
    resource: { type: String, enum: ResourceType, required: true },
    resourceId: { type: String },
    details: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default (models.ActivityLog as Model<IActivityLog>) ||
  model<IActivityLog>("ActivityLog", ActivityLogSchema);
