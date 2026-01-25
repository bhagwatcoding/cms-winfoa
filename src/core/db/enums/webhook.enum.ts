/**
 * Webhook Enums
 * Numeric values for efficient DB storage
 */

export enum WebhookEvent {
  USER_CREATED = 1,
  USER_UPDATED = 2,
  USER_DELETED = 3,
  SESSION_CREATED = 4,
  SESSION_EXPIRED = 5,
  PAYMENT_SUCCESS = 6,
  PAYMENT_FAILED = 7,
  API_KEY_CREATED = 8,
  API_KEY_REVOKED = 9,
  ROLE_CHANGED = 10,
}

export const WebhookEventLabel: Record<WebhookEvent, string> = {
  [WebhookEvent.USER_CREATED]: 'User Created',
  [WebhookEvent.USER_UPDATED]: 'User Updated',
  [WebhookEvent.USER_DELETED]: 'User Deleted',
  [WebhookEvent.SESSION_CREATED]: 'Session Created',
  [WebhookEvent.SESSION_EXPIRED]: 'Session Expired',
  [WebhookEvent.PAYMENT_SUCCESS]: 'Payment Success',
  [WebhookEvent.PAYMENT_FAILED]: 'Payment Failed',
  [WebhookEvent.API_KEY_CREATED]: 'API Key Created',
  [WebhookEvent.API_KEY_REVOKED]: 'API Key Revoked',
  [WebhookEvent.ROLE_CHANGED]: 'Role Changed',
};

export enum WebhookStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PAUSED = 3,
  ERROR = 4,
}

export const WebhookStatusLabel: Record<WebhookStatus, string> = {
  [WebhookStatus.ACTIVE]: 'Active',
  [WebhookStatus.INACTIVE]: 'Inactive',
  [WebhookStatus.PAUSED]: 'Paused',
  [WebhookStatus.ERROR]: 'Error',
};
