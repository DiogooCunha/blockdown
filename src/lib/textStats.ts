export function countChars(value: string): number {
  return value.length;
}

export function countWords(value: string): number {
  if (!value.trim()) return 0;
  return value.trim().split(/\s+/).length;
}
