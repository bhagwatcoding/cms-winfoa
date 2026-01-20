import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// ==========================================
// USER MODEL - Advanced Enterprise Grade
// ==========================================

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface ILoginHistory {
  ip: string;
  country?: string;
  city?: string;
  device: string;
  browser?: string;
  os?: string;
  loginAt: Date;
  sessionId?: mongoose.Types.ObjectId;
  loginMethod?: string;
  _id?: mongoose.Types.ObjectId;
}

export interface ILinkedAccount {
  provider: "google" | "github" | "microsoft" | "apple";
  providerId: string;
  email?: string;
  name?: string;
  avatar?: string;
  linkedAt: Date;
  lastUsedAt?: Date;
}

export interface IUserProfile {
  bio?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface IUserPreferences {
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface ITwoFactorSettings {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[]; // Hashed
  enabledAt?: Date;
  lastUsedAt?: Date;
  method?: "totp" | "sms" | "email";
}

export interface IUser extends Document, ISoftDelete {
  // Core identity
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;

  // Role & Permissions
  roleId: mongoose.Types.ObjectId;
  customPermissions?: string[];
  permissionOverrides?: string[];
  isGod: boolean;

  // Profile
  avatar?: string;
  profile?: IUserProfile;
  preferences: IUserPreferences;

  // Email verification
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Phone verification
  phoneVerified?: boolean;
  phoneVerifiedAt?: Date;

  // Two-Factor Authentication
  twoFactor: ITwoFactorSettings;

  // Account security
  accountLocked: boolean;
  lockoutUntil?: Date;
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  passwordHistory?: string[]; // Last 5 password hashes
  requirePasswordChange?: boolean;

  // OAuth / Linked Accounts
  linkedAccounts: ILinkedAccount[];

  // Trusted Devices
  trustedDevices: string[];

  // Login History (last 10)
  loginHistory: ILoginHistory[];

  // Activity timestamps
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  lastLoginIp?: string;

  // Status
  status: "active" | "inactive" | "suspended" | "pending";
  statusReason?: string;
  statusChangedAt?: Date;
  statusChangedBy?: mongoose.Types.ObjectId;

  // Soft Delete
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;

  // Metadata
  metadata?: Record<string, unknown>;
  tags?: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  lock(duration?: number, reason?: string): Promise<IUser>;
  unlock(): Promise<IUser>;
  recordFailedLogin(): Promise<IUser>;
  recordSuccessfulLogin(ip?: string, sessionId?: mongoose.Types.ObjectId): Promise<IUser>;
  addToLoginHistory(entry: Partial<ILoginHistory>): Promise<IUser>;
  updateLastActive(): Promise<IUser>;
  enable2FA(secret: string, backupCodes: string[]): Promise<IUser>;
  disable2FA(): Promise<IUser>;
  verify2FA(code: string): boolean;
  changePassword(newPassword: string): Promise<IUser>;
  linkAccount(account: ILinkedAccount): Promise<IUser>;
  unlinkAccount(provider: string): Promise<IUser>;

  // Virtuals
  fullName: string;
  initials: string;
  displayName: string;
}

// Static Methods
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findActive(): Promise<IUser[]>;
  findByRole(roleId: mongoose.Types.ObjectId): Promise<IUser[]>;
  findLocked(): Promise<IUser[]>;
  findGods(): Promise<IUser[]>;
  search(query: string, limit?: number): Promise<IUser[]>;
  countByStatus(): Promise<Record<string, number>>;
  cleanupLockedAccounts(): Promise<number>;
}

// ==========================================
// SCHEMA DEFINITION
// ==========================================

const LoginHistorySchema = new Schema<ILoginHistory>(
  {
    ip: { type: String, required: true },
    country: String,
    city: String,
    device: { type: String, required: true },
    browser: String,
    os: String,
    loginAt: { type: Date, default: Date.now },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session" },
    loginMethod: String,
  },
  { _id: true }
);

const LinkedAccountSchema = new Schema<ILinkedAccount>(
  {
    provider: {
      type: String,
      enum: ["google", "github", "microsoft", "apple"],
      required: true,
    },
    providerId: { type: String, required: true },
    email: String,
    name: String,
    avatar: String,
    linkedAt: { type: Date, default: Date.now },
    lastUsedAt: Date,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    // Core Identity
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },

    // Role & Permissions
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
      index: true,
    },
    customPermissions: {
      type: [String],
      default: [],
    },
    permissionOverrides: {
      type: [String],
      default: [],
    },
    isGod: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Profile
    avatar: String,
    profile: {
      bio: { type: String, maxlength: 500 },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
      },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
      },
      socialLinks: {
        website: String,
        linkedin: String,
        twitter: String,
        github: String,
      },
    },

    preferences: {
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
    },

    // Email Verification
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: Date,

    // Phone Verification
    phoneVerified: { type: Boolean, default: false },
    phoneVerifiedAt: Date,

    // Two-Factor Authentication
    twoFactor: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, select: false },
      backupCodes: { type: [String], select: false },
      enabledAt: Date,
      lastUsedAt: Date,
      method: { type: String, enum: ["totp", "sms", "email"] },
    },

    // Account Security
    accountLocked: { type: Boolean, default: false, index: true },
    lockoutUntil: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    lastFailedLoginAt: Date,
    lastPasswordChangeAt: Date,
    passwordHistory: { type: [String], select: false },
    requirePasswordChange: { type: Boolean, default: false },

    // OAuth / Linked Accounts
    linkedAccounts: {
      type: [LinkedAccountSchema],
      default: [],
    },

    // Trusted Devices
    trustedDevices: {
      type: [String],
      default: [],
    },

    // Login History
    loginHistory: {
      type: [LoginHistorySchema],
      default: [],
    },

    // Activity
    lastLoginAt: Date,
    lastActiveAt: Date,
    lastLoginIp: String,

    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
      index: true,
    },
    statusReason: String,
    statusChangedAt: Date,
    statusChangedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Soft Delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    deletedBy: String,

    // Metadata
    metadata: Schema.Types.Mixed,
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==========================================
// INDEXES
// ==========================================

// Compound indexes for common queries
UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ status: 1, isDeleted: 1 });
UserSchema.index({ roleId: 1, status: 1 });
UserSchema.index({ "profile.address.country": 1 });

// Text index for search
UserSchema.index(
  { firstName: "text", lastName: "text", email: "text" },
  { name: "user_search_index" }
);

// ==========================================
// VIRTUALS
// ==========================================

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual("initials").get(function () {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

UserSchema.virtual("displayName").get(function () {
  return this.fullName || this.email.split("@")[0];
});

// ==========================================
// MIDDLEWARE (HOOKS)
// ==========================================

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  try {
    // Store old password in history
    if (this.passwordHistory) {
      const oldPassword = this.password;
      this.passwordHistory.unshift(oldPassword);
      // Keep only last 5 passwords
      this.passwordHistory = this.passwordHistory.slice(0, 5);
    } else {
      this.passwordHistory = [];
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChangeAt = new Date();
  } catch (err) {
    console.error("Password hashing error:", err);
    throw err;
  }
});

// Auto-unlock expired lockouts
UserSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

// ==========================================
// INSTANCE METHODS
// ==========================================

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ comparePassword called but password field was not selected.");
    }
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isLocked = function (): boolean {
  if (!this.accountLocked) return false;
  if (this.lockoutUntil && this.lockoutUntil <= new Date()) {
    // Lockout expired
    return false;
  }
  return true;
};

UserSchema.methods.lock = async function (
  duration = 15 * 60 * 1000, // 15 minutes default
  reason?: string
): Promise<IUser> {
  this.accountLocked = true;
  this.lockoutUntil = new Date(Date.now() + duration);
  if (reason) {
    this.statusReason = reason;
  }
  return this.save();
};

UserSchema.methods.unlock = async function (): Promise<IUser> {
  this.accountLocked = false;
  this.lockoutUntil = undefined;
  this.failedLoginAttempts = 0;
  return this.save();
};

UserSchema.methods.recordFailedLogin = async function (): Promise<IUser> {
  this.failedLoginAttempts += 1;
  this.lastFailedLoginAt = new Date();

  // Auto-lock after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true;
    this.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }

  return this.save();
};

UserSchema.methods.recordSuccessfulLogin = async function (
  ip?: string,
  sessionId?: mongoose.Types.ObjectId
): Promise<IUser> {
  this.failedLoginAttempts = 0;
  this.lastLoginAt = new Date();
  this.lastActiveAt = new Date();

  if (ip) {
    this.lastLoginIp = ip;
  }

  // Auto-unlock if locked
  if (this.accountLocked && this.lockoutUntil && this.lockoutUntil <= new Date()) {
    this.accountLocked = false;
    this.lockoutUntil = undefined;
  }

  return this.save();
};

UserSchema.methods.addToLoginHistory = async function (
  entry: Partial<ILoginHistory>
): Promise<IUser> {
  const historyEntry: ILoginHistory = {
    ip: entry.ip || "unknown",
    device: entry.device || "unknown",
    loginAt: entry.loginAt || new Date(),
    ...entry,
  };

  this.loginHistory.unshift(historyEntry);
  // Keep only last 10 entries
  this.loginHistory = this.loginHistory.slice(0, 10);

  return this.save();
};

UserSchema.methods.updateLastActive = async function (): Promise<IUser> {
  this.lastActiveAt = new Date();
  return this.save();
};

UserSchema.methods.enable2FA = async function (
  secret: string,
  backupCodes: string[]
): Promise<IUser> {
  this.twoFactor.enabled = true;
  this.twoFactor.secret = secret;
  this.twoFactor.backupCodes = backupCodes;
  this.twoFactor.enabledAt = new Date();
  this.twoFactor.method = "totp";
  return this.save();
};

UserSchema.methods.disable2FA = async function (): Promise<IUser> {
  this.twoFactor.enabled = false;
  this.twoFactor.secret = undefined;
  this.twoFactor.backupCodes = undefined;
  this.twoFactor.enabledAt = undefined;
  this.twoFactor.method = undefined;
  return this.save();
};

UserSchema.methods.verify2FA = function (code: string): boolean {
  // This would integrate with a TOTP library like 'speakeasy'
  // For now, return false as placeholder
  console.log("2FA verification for code:", code);
  return false;
};

UserSchema.methods.changePassword = async function (
  newPassword: string
): Promise<IUser> {
  this.password = newPassword;
  this.requirePasswordChange = false;
  return this.save();
};

UserSchema.methods.linkAccount = async function (
  account: ILinkedAccount
): Promise<IUser> {
  // Check if account already linked
  const existing = this.linkedAccounts.find(
    (a) => a.provider === account.provider
  );

  if (existing) {
    Object.assign(existing, account, { lastUsedAt: new Date() });
  } else {
    this.linkedAccounts.push({ ...account, linkedAt: new Date() });
  }

  return this.save();
};

UserSchema.methods.unlinkAccount = async function (
  provider: string
): Promise<IUser> {
  this.linkedAccounts = this.linkedAccounts.filter(
    (a) => a.provider !== provider
  );
  return this.save();
};

// ==========================================
// STATIC METHODS
// ==========================================

UserSchema.statics.findByEmail = function (email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase(), isDeleted: false });
};

UserSchema.statics.findActive = function (): Promise<IUser[]> {
  return this.find({ status: "active", isDeleted: false });
};

UserSchema.statics.findByRole = function (
  roleId: mongoose.Types.ObjectId
): Promise<IUser[]> {
  return this.find({ roleId, isDeleted: false });
};

UserSchema.statics.findLocked = function (): Promise<IUser[]> {
  return this.find({ accountLocked: true, isDeleted: false });
};

UserSchema.statics.findGods = function (): Promise<IUser[]> {
  return this.find({ isGod: true, isDeleted: false });
};

UserSchema.statics.search = function (
  query: string,
  limit = 20
): Promise<IUser[]> {
  return this.find(
    { $text: { $search: query }, isDeleted: false },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit);
};

UserSchema.statics.countByStatus = async function (): Promise<
  Record<string, number>
> {
  const result = await this.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = {};
  result.forEach((item) => {
    counts[item._id] = item.count;
  });
  return counts;
};

UserSchema.statics.cleanupLockedAccounts = async function (): Promise<number> {
  const result = await this.updateMany(
    {
      accountLocked: true,
      lockoutUntil: { $lte: new Date() },
    },
    {
      accountLocked: false,
      $unset: { lockoutUntil: 1 },
      failedLoginAttempts: 0,
    }
  );
  return result.modifiedCount;
};

// ==========================================
// EXPORT
// ==========================================

export default (models.User as IUserModel) ||
  model<IUser, IUserModel>("User", UserSchema);
