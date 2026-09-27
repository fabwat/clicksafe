export function createId(prefix = 'id'): string {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
}
