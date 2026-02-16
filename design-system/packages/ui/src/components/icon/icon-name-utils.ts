/**
 * Converts Tabler icon name (kebab-case or lowercase) to Icon component key.
 * e.g. "bag" becomes "IconBag", "arrow-left" becomes "IconArrowLeft"
 */
export function toIconComponentKey(name: string): string {
  if (!name || typeof name !== 'string') return ''
  const pascal = name
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
  return `Icon${pascal}`
}
