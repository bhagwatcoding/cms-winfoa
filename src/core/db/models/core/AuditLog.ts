import mongoose, { Schema, Document, Model, model, models } from 'mongoose';
import { IGeoInfo, IDeviceInfo } from '@/core/db/interfaces';
import { AuditSeverity, AuditCategory, getNumericEnumValues } from '@/core/db/enums';

// ==========================================
// AUDIT LOG MODEL
// ==========================================

export interface IAuditActor {
  userId?: mongoose.Types.ObjectId;
  email?: string;
  name?: string;
  role?: string;
  ip?: string;
  isSystem?: boolean;
}

export interface IAuditTarget {
  model?: string;
  documentId?: string;
  field?: string;
  previousValue?: unknown;
  newValue?: unknown;
  changes?: Record<string, { from: unknown; to: unknown }>;
}

export interface IAuditContext {
  requestId?: string;
  sessionId?: string;
  userAgent?: string;
  duration?: number;
  source?: string;
}

export interface IAuditLog extends Document {
  eventType: string;
  category: AuditCategory; // Numeric Enum
  severity: AuditSeverity; // Numeric Enum
  actor: IAuditActor;
  target?: IAuditTarget;
  context?: IAuditContext;
  geoInfo?: IGeoInfo;
  deviceInfo?: Partial<IDeviceInfo>;
  message: string;
  details?: Record<string, unknown>;
  checksumHash?: string;
  timestamp: Date;
  expiresAt?: Date;
}

interface IAuditLogModel extends Model<IAuditLog> {
  log(params: Record<string, unknown>): Promise<IAuditLog>;
  // ... other statics
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    eventType: { type: String, required: true, index: true },
    category: {
      type: Number,
      enum: getNumericEnumValues(AuditCategory),
      required: true,
      index: true,
    },
    severity: {
      type: Number,
      enum: getNumericEnumValues(AuditSeverity),
      default: AuditSeverity.Info,
      index: true,
    },
    actor: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      email: String,
      name: String,
      role: String,
      ip: String,
      isSystem: { type: Boolean, default: false },
    },
    target: {
      model: String,
      documentId: String,
      field: String,
      previousValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      changes: Schema.Types.Mixed,
    },
    context: {
      requestId: String,
      sessionId: String,
      userAgent: String,
      duration: Number,
      source: { type: String, default: 'web' },
    },
    message: { type: String, required: true },
    details: Schema.Types.Mixed,
    checksumHash: String,
    timestamp: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: false, collection: 'audit_logs' }
);

// Indexes
AuditLogSchema.index({ 'actor.userId': 1, timestamp: -1 });
AuditLogSchema.index({ category: 1, timestamp: -1 });

// Statics
AuditLogSchema.statics.log = async function (params: Record<string, unknown>) {
  return this.create({
    ...params,
    severity: (params.severity as AuditSeverity) ?? AuditSeverity.Info,
    timestamp: new Date(),
  });
};

export default (models.AuditLog as IAuditLogModel) ||
  model<IAuditLog, IAuditLogModel>('AuditLog', AuditLogSchema);
