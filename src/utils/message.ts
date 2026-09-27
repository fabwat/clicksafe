export function renderEmergencyMessage(template: string, name: string): string {
  return template.replaceAll('[NOME]', name);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
