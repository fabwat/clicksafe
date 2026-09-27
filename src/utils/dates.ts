import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getZonedParts } from './timezone';

const MONTHS_PT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatDateTime(isoUtc: string, timeZone: string): string {
  const parts = getZonedParts(new Date(isoUtc), timeZone);
  return `${pad(parts.day)} ${MONTHS_PT[parts.month - 1]} ${parts.year} · ${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function formatTime(isoUtc: string, timeZone: string): string {
  const parts = getZonedParts(new Date(isoUtc), timeZone);
  return `${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function formatDayHeading(isoUtc: string, timeZone: string): string {
  const parts = getZonedParts(new Date(isoUtc), timeZone);
  return `${pad(parts.day)} ${MONTHS_PT[parts.month - 1]} ${parts.year}`;
}

export function formatNextCheckinLabel(deadlineIso: string, timeZone: string, now = new Date()): string {
  const deadline = new Date(deadlineIso);
  const nowParts = getZonedParts(now, timeZone);
  const dueParts = getZonedParts(deadline, timeZone);
  const time = `${pad(dueParts.hour)}:${pad(dueParts.minute)}`;

  const nowDay = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day);
  const dueDay = Date.UTC(dueParts.year, dueParts.month - 1, dueParts.day);
  const dayDiff = Math.round((dueDay - nowDay) / 86_400_000);

  if (dayDiff === 0) {
    return `hoje às ${time}`;
  }
  if (dayDiff === 1) {
    return `amanhã às ${time}`;
  }

  return `${pad(dueParts.day)} ${MONTHS_PT[dueParts.month - 1]} ${dueParts.year} às ${time}`;
}

export function formatRelative(isoUtc: string): string {
  return formatDistanceToNowStrict(new Date(isoUtc), { addSuffix: true, locale: ptBR });
}
