import { TEST_MESSAGE } from '@/constants/config';

export function renderEmergencyMessage(template: string, name: string): string {
  return template.replaceAll('[NOME]', name);
}

export function buildTestMessage(template: string, name: string): string {
  return `${TEST_MESSAGE}\n\n${renderEmergencyMessage(template, name)}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
