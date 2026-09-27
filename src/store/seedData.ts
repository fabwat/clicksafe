import {
  DEFAULT_CHECKIN_TIME,
  DEFAULT_EMERGENCY_MESSAGE,
  DEFAULT_GRACE_PERIOD_MINUTES,
  DEFAULT_REMINDER_MINUTES,
} from '@/constants/config';
import type {
  Alert,
  Checkin,
  CheckinSettings,
  EmergencyContact,
  HistoryEvent,
  Profile,
  Session,
} from '@/types';
import { computeInitialDeadline } from '@/utils/deadlines';
import { createId } from '@/utils/id';
import { getDeviceTimezone } from '@/utils/timezone';

export interface LocalWorkspace {
  session: Session;
  profile: Profile;
  settings: CheckinSettings;
  contacts: EmergencyContact[];
  checkins: Checkin[];
  alerts: Alert[];
  history: HistoryEvent[];
}

export function createLocalWorkspace(now = new Date()): LocalWorkspace {
  const userId = createId('user');
  const profile = createDefaultProfile(userId, now);
  const settings = createDefaultSettings(userId, profile.timezone, now);

  return {
    session: { userId, email: '' },
    profile,
    settings,
    contacts: [],
    checkins: [],
    alerts: [],
    history: [],
  };
}

function createDefaultProfile(userId: string, now = new Date()): Profile {
  const timestamp = now.toISOString();
  return {
    id: createId('profile'),
    userId,
    name: 'Você',
    email: '',
    timezone: getDeviceTimezone(),
    emergencyMessage: DEFAULT_EMERGENCY_MESSAGE,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDefaultSettings(userId: string, timezone: string, now = new Date()): CheckinSettings {
  const timestamp = now.toISOString();
  const nextDeadline = computeInitialDeadline({
    nowUtc: now,
    timezone,
    frequencyType: 'daily',
    frequencyValue: 1,
    checkinTime: DEFAULT_CHECKIN_TIME,
  });

  return {
    id: createId('settings'),
    userId,
    frequencyType: 'daily',
    frequencyValue: 1,
    checkinTime: DEFAULT_CHECKIN_TIME,
    gracePeriodMinutes: DEFAULT_GRACE_PERIOD_MINUTES,
    reminderMinutes: DEFAULT_REMINDER_MINUTES,
    enabled: true,
    nextDeadlineAt: nextDeadline.toISOString(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
