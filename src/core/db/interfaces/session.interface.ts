// --- Interfaces ---
import { DeviceType } from '@/core/db/enums';

export interface IDeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  type: DeviceType;
  isMobile: boolean;
  deviceId?: string;
}

// The Clean Result returned to Frontend/Actions
export interface ISessionResult {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  deviceInfo?: Partial<IDeviceInfo>;
  lastAccessedAt?: Date;
}
