import type { CheckinSettings, FrequencyType, SafetyStatus } from '@/types';

import { addDaysToZonedDate, getZonedParts, parseTimeHHmm, zonedDateToUtc } from './timezone';

export interface DeadlineInput {
  nowUtc: Date;
  timezone: string;
  frequencyType: FrequencyType;
  frequencyValue: number;
  checkinTime: string | null;
}

function nextCalendarDeadline(input: DeadlineInput, afterCheckin: boolean): Date {
  const time = parseTimeHHmm(input.checkinTime ?? '20:00');
  const nowParts = getZonedParts(input.nowUtc, input.timezone);
  const todayAtTime = zonedDateToUtc(
    {
      year: nowParts.year,
      month: nowParts.month,
      day: nowParts.day,
      hour: time.hour,
      minute: time.minute,
      second: 0,
    },
    input.timezone,
  );

  if (afterCheckin || input.nowUtc.getTime() >= todayAtTime.getTime()) {
    return addDaysToZonedDate(
      {
        year: nowParts.year,
        month: nowParts.month,
        day: nowParts.day,
        hour: time.hour,
        minute: time.minute,
        second: 0,
      },
      1,
      input.timezone,
    );
  }

  return todayAtTime;
}

function nextIntervalDeadline(input: DeadlineInput): Date {
  const amount = Math.max(1, input.frequencyValue);

  if (input.frequencyType === 'every_n_days') {
    return new Date(input.nowUtc.getTime() + amount * 24 * 60 * 60 * 1000);
  }

  return new Date(input.nowUtc.getTime() + amount * 60 * 60 * 1000);
}

export function computeInitialDeadline(input: DeadlineInput): Date {
  if (input.frequencyType === 'daily' || input.frequencyType === 'specific_time') {
    return nextCalendarDeadline(input, false);
  }

  return nextIntervalDeadline(input);
}

export function computeNextDeadlineAfterCheckin(input: DeadlineInput): Date {
  if (input.frequencyType === 'daily' || input.frequencyType === 'specific_time') {
    return nextCalendarDeadline(input, true);
  }

  return nextIntervalDeadline(input);
}

export function computeDeadlineFromSettings(
  settings: Pick<CheckinSettings, 'frequencyType' | 'frequencyValue' | 'checkinTime'>,
  timezone: string,
  nowUtc: Date,
  afterCheckin: boolean,
): Date {
  const input: DeadlineInput = {
    nowUtc,
    timezone,
    frequencyType: settings.frequencyType,
    frequencyValue: settings.frequencyValue,
    checkinTime: settings.checkinTime,
  };

  return afterCheckin ? computeNextDeadlineAfterCheckin(input) : computeInitialDeadline(input);
}

export function getSafetyStatus(params: {
  nowUtc: Date;
  deadlineUtc: Date;
  gracePeriodMinutes: number;
  reminderMinutes: number;
  alertSent: boolean;
}): SafetyStatus {
  if (params.alertSent) {
    return 'ALERT_SENT';
  }

  const now = params.nowUtc.getTime();
  const deadline = params.deadlineUtc.getTime();
  const reminderAt = deadline - params.reminderMinutes * 60_000;

  if (now >= deadline) {
    return 'OVERDUE';
  }
  if (now >= reminderAt) {
    return 'DUE_SOON';
  }
  return 'SAFE';
}

export function isAlertDue(params: { nowUtc: Date; deadlineUtc: Date; gracePeriodMinutes: number }): boolean {
  const alertAt = params.deadlineUtc.getTime() + params.gracePeriodMinutes * 60_000;
  return params.nowUtc.getTime() >= alertAt;
}

export function isSameDeadlinePeriod(leftIso: string, rightIso: string): boolean {
  return new Date(leftIso).getTime() === new Date(rightIso).getTime();
}
