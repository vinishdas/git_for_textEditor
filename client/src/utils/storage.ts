export function incTag(tag: string): string {
  const match = tag.match(/#(\d+)/);

  if (!match) return tag; // No number found, return original

  const currentNumber = parseInt(match[1], 10);
  const newNumber = currentNumber + 1;

  return tag.replace(/#\d+/, `#${newNumber}`);
}
