import shortid from "shortid"
import smoothScrollIntoView from "smooth-scroll-into-view-if-needed"

/**
 * Transforms an array of T[] to an object of string key to S, using a function that maps T -> S.
 * Uses a `shortid` for key.
 */
export function makeIdMap<T, S>(
  input: T[],
  fn: (t: T) => S
): Record<string, S> {
  return input.reduce((map, i) => {
    map[shortid.generate()] = fn(i)
    return map
  }, {} as Record<string, S>)
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
  return Object.keys(record).filter(id => !stringEmpty(record[id]))
}

/**
 * Consistent options for scrolling things into view.
 */
export function scrollIntoView(target: Element) {
  smoothScrollIntoView(target, {
    scrollMode: "if-needed",
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
  return record1Keys.every(k => record1[k] === record2[k])
}

/**
 * Type guard for default case in tests. Can be used to match "never" TS type.
 */
export function assertNever(t: never): never {
  /* istanbul ignore next */
  throw new Error(`Unexpected object: ${t}`)
}
