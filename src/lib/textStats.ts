function toPlainText(value: string): string {
  const withoutTags = value.replace(/<[^>]+>/g, " ");
  const normalized = withoutTags.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return normalized;
}

export function countChars(value: string): number {
  const text = toPlainText(value);
  return text.length;
}

export function countWords(value: string): number {
  const text = toPlainText(value);
  if (!text) return 0;
  return text.split(/\s+/).length;
}
