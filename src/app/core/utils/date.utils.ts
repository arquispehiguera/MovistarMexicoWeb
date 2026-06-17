const PERU_OFFSET_MS = -5 * 60 * 60 * 1000;

export function toPeruISOString(date: Date = new Date()): string {
  return new Date(date.getTime() + PERU_OFFSET_MS).toISOString().replace('Z', '');
}
