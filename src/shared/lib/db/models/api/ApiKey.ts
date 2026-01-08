import mongoose, { Schema, Document } from 'mongoose'
import crypto from 'crypto'

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  key: string
  keyPrefix: string
  hashedKey: string
  permissions: string[]
  rateLimit: number
  requestCount: number
  lastUsedAt?: Date
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    keyPrefix: {
      type: String,
      required: true
    },
    hashedKey: {
      type: String,
      required: true,
      select: false
    },
    permissions: {
      type: [String],
      default: ['read']
    },
    rateLimit: {
      type: Number,
      default: 1000 // requests per hour
    },
    requestCount: {
      type: Number,
      default: 0
    },
    lastUsedAt: {
      type: Date
    },
    expiresAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Generate API key
ApiKeySchema.statics.generateKey = function () {
  const key = `winfoa_${crypto.randomBytes(32).toString('hex')}`
  const prefix = key.substring(0, 12)
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex')

  return { key, prefix, hashedKey }
}

// Verify API key
ApiKeySchema.methods.verifyKey = function (providedKey: string): boolean {
  const hashedProvidedKey = crypto.createHash('sha256').update(providedKey).digest('hex')
  return this.hashedKey === hashedProvidedKey
}

// Increment request count
ApiKeySchema.methods.incrementRequests = async function () {
  this.requestCount += 1
  this.lastUsedAt = new Date()
  await this.save()
}

export default mongoose.models.ApiKey ||
  mongoose.model<IApiKey>('ApiKey', ApiKeySchema)
