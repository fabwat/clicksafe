export type SafetyStatus = 'SAFE' | 'DUE_SOON' | 'OVERDUE' | 'ALERT_SENT';

export type FrequencyType =
  | 'daily'
  | 'every_n_hours'
  | 'every_n_days'
  | 'specific_time'
  | 'custom';

export type NotificationMethod = 'whatsapp' | 'sms';

export type AlertStatus = 'pending' | 'sent' | 'failed';

export type HistoryEventType =
  | 'checkin'
  | 'missed_checkin'
  | 'alert_sent'
  | 'alert_failed'
  | 'test_message';

export interface Session {
  userId: string;
  email: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  timezone: string;
  emergencyMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckinSettings {
  id: string;
  userId: string;
  frequencyType: FrequencyType;
  frequencyValue: number;
  checkinTime: string | null;
  gracePeriodMinutes: number;
  reminderMinutes: number;
  enabled: boolean;
  nextDeadlineAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  countryCode: string;
  relationship: string;
  notificationMethod: NotificationMethod;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Checkin {
  id: string;
  userId: string;
  checkedInAt: string;
  expectedDeadline: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  checkinDeadline: string;
  emergencyContactId: string;
  notificationMethod: NotificationMethod;
  status: AlertStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  retryCount: number;
  sentAt: string | null;
  createdAt: string;
}

export interface HistoryEvent {
  id: string;
  userId: string;
  type: HistoryEventType;
  occurredAt: string;
  title: string;
  description: string;
}

export interface Device {
  id: string;
  userId: string;
  pushToken: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: string;
  updatedAt: string;
}

export interface CheckinResult {
  created: boolean;
  checkedInAt: string;
  nextDeadlineAt: string;
  message: string;
  nextCheckinLabel: string;
}

export interface WhatsAppCloudConfig {
  accessToken: string;
  phoneNumberId: string;
  templateName: string;
}

export interface TestMessageResult {
  sent: boolean;
  method: NotificationMethod;
  preview: string;
  providerMessageId: string | null;
}
