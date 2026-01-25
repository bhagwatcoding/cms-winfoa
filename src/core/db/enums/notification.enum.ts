/**
 * Notification Enums
 * Numeric values for efficient DB storage
 */

export const enum NotificationType {
  SYSTEM = 1,
  SECURITY = 2,
  INFO = 3,
  MARKETING = 4,
  ACTIVITY = 5,
  REMINDER = 6,
  ALERT = 7,
}

export const NotificationTypeLabel: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: 'System',
  [NotificationType.SECURITY]: 'Security',
  [NotificationType.INFO]: 'Info',
  [NotificationType.MARKETING]: 'Marketing',
  [NotificationType.ACTIVITY]: 'Activity',
  [NotificationType.REMINDER]: 'Reminder',
  [NotificationType.ALERT]: 'Alert',
};

export const enum NotificationPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
}

export const NotificationPriorityLabel: Record<NotificationPriority, string> = {
  [NotificationPriority.LOW]: 'Low',
  [NotificationPriority.NORMAL]: 'Normal',
  [NotificationPriority.HIGH]: 'High',
  [NotificationPriority.URGENT]: 'Urgent',
};

export const enum NotificationChannel {
  IN_APP = 1,
  EMAIL = 2,
  SMS = 3,
  PUSH = 4,
}

export const NotificationChannelLabel: Record<NotificationChannel, string> = {
  [NotificationChannel.IN_APP]: 'In-App',
  [NotificationChannel.EMAIL]: 'Email',
  [NotificationChannel.SMS]: 'SMS',
  [NotificationChannel.PUSH]: 'Push',
};
