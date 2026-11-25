export function makeShortId(): string {
  // Prefixed so the ID is never purely numeric: react-hook-form would read a
  // digits-only path segment as an array index.
  return `id${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Transforms an array of T[] to an object of string key to S, using a function that maps T -> S.
 * Uses a short random ID for each key.
 */
export function makeIdMap<T, S>(
  input: T[],
  fn: (t: T) => S
): Record<string, S> {
  return input.reduce(
    (map, i) => {
      map[makeShortId()] = fn(i)
      return map
    },
    {} as Record<string, S>
  )
}

/**
 * Generates an array of integers from 0 to n, not inclusive.
 */
export function range(n: number) {
  return Array(n)
    .fill(null)
    .map((_, i) => i)
}

/**
 * Returns true if string is undefined or empty.
 */
export function stringEmpty(s: string): boolean {
  return !s || /^\s*$/.test(s)
}

/**
 * Returns keys of `record` that correspond to non-empty values.
 */
export function filterNonEmptyKeys(record: Record<string, string>): string[] {
  return Object.keys(record).filter((id) => !stringEmpty(record[id]))
}

/**
 * Smoothly scroll `target` to the centre of the viewport, only if it isn't
 * already fully visible (what `smooth-scroll-into-view-if-needed` did), using
 * native scrolling. Jumps instead of animating for users who prefer reduced
 * motion.
 */
export function scrollIntoView(target: Element) {
  const rect = target.getBoundingClientRect()
  if (rect.top >= 0 && rect.bottom <= window.innerHeight) return
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
  target.scrollIntoView({
    behavior: reduceMotion ? "instant" : "smooth",
    block: "center",
    inline: "start",
  })
}

/**
 * Check records for equality.
 */
export function recordsEqual<T>(
  record1: Record<string, T>,
  record2: Record<string, T>
) {
  const record1Keys = Object.keys(record1)
  const record2Keys = Object.keys(record2)
  if (record1Keys.length !== record2Keys.length) return false
  return record1Keys.every((k) => record1[k] === record2[k])
}

/**
 * Type guard for default case in tests. Can be used to match "never" TS type.
 */
export function assertNever(t: never): never {
  /* istanbul ignore next */
  throw new Error(`Unexpected object: ${t}`)
}
