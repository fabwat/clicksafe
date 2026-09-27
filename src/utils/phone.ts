const COUNTRY_CODES = ['+55', '+1', '+351', '+44', '+33', '+971', '+81', '+34', '+49'] as const;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeCountryCode(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('+')) {
    return `+${digitsOnly(trimmed)}`;
  }
  return `+${digitsOnly(trimmed)}`;
}

export function toE164(countryCode: string, phone: string): string {
  return `${normalizeCountryCode(countryCode)}${digitsOnly(phone)}`;
}

export function isValidPhone(countryCode: string, phone: string): boolean {
  const e164 = toE164(countryCode, phone);
  return /^\+[1-9]\d{7,14}$/.test(e164);
}

export function formatPhoneDisplay(countryCode: string, phone: string): string {
  const code = normalizeCountryCode(countryCode);
  const national = digitsOnly(phone);

  if (code === '+55' && national.length === 11) {
    return `${code} ${national.slice(0, 2)} ${national.slice(2, 7)}-${national.slice(7)}`;
  }

  if (national.length >= 8) {
    return `${code} ${national.slice(0, national.length - 4)}-${national.slice(-4)}`;
  }

  return `${code} ${national}`.trim();
}

export function isKnownCountryCode(value: string): boolean {
  return COUNTRY_CODES.includes(normalizeCountryCode(value) as (typeof COUNTRY_CODES)[number]);
}
