export interface ZonedDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  formatterCache.set(timeZone, formatter);
  return formatter;
}

export function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function getZonedParts(date: Date, timeZone: string): ZonedDateTime {
  const parts = getFormatter(timeZone).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

export function zonedDateToUtc(
  parts: Omit<ZonedDateTime, 'second'> & { second?: number },
  timeZone: string,
): Date {
  const second = parts.second ?? 0;
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    second,
  );

  let instant = new Date(utcGuess);
  const asZone = getZonedParts(instant, timeZone);
  const zoneAsUtc = Date.UTC(
    asZone.year,
    asZone.month - 1,
    asZone.day,
    asZone.hour,
    asZone.minute,
    asZone.second,
  );
  instant = new Date(utcGuess + (utcGuess - zoneAsUtc));

  const verify = getZonedParts(instant, timeZone);
  const verifyUtc = Date.UTC(
    verify.year,
    verify.month - 1,
    verify.day,
    verify.hour,
    verify.minute,
    verify.second,
  );
  const wantedUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, second);

  if (verifyUtc !== wantedUtc) {
    instant = new Date(instant.getTime() + (wantedUtc - verifyUtc));
  }

  return instant;
}

export function addDaysToZonedDate(parts: ZonedDateTime, days: number, timeZone: string): Date {
  const utcBase = zonedDateToUtc(parts, timeZone);
  const shifted = new Date(utcBase.getTime() + days * 24 * 60 * 60 * 1000);
  const next = getZonedParts(shifted, timeZone);
  return zonedDateToUtc(
    {
      year: next.year,
      month: next.month,
      day: next.day,
      hour: parts.hour,
      minute: parts.minute,
      second: parts.second,
    },
    timeZone,
  );
}

export function parseTimeHHmm(value: string): { hour: number; minute: number } {
  const [hourText, minuteText] = value.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Horário inválido: ${value}`);
  }

  return { hour, minute };
}
