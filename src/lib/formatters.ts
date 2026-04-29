export function formatPrice(value: number | string): string {
  const numeric =
    typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  return `$${Math.round(numeric)}`;
}

export function formatDuration(minutes: number): string {
  const safeMinutes = Number(minutes) || 0;
  if (safeMinutes >= 60) {
    const hours = Math.floor(safeMinutes / 60);
    const remainder = safeMinutes % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  }
  return `${safeMinutes}m`;
}

export function formatShortDate(input: string | Date): string | null {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
