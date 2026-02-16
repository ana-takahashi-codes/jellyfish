/**
 * Converts Tabler Icon component key to the name used by <Icon name="..." />.
 * e.g. "IconArrowLeft" -> "arrow-left", "IconBag" -> "bag"
 */
export function iconKeyToName(key) {
  if (!key || typeof key !== 'string' || !key.startsWith('Icon')) return key
  const withoutPrefix = key.slice(4)
  return withoutPrefix
    .replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`)
    .replace(/^-/, '')
}
