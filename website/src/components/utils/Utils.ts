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
  return input.reduce(
    (map, i) => {
      map[shortid.generate()] = fn(i)
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
 * Returns keys of `record` that correspond to non-empty values.
 */
export function filterNonEmptyKeys(record: Record<string, string>): string[] {
  return Object.keys(record).filter(
    id => record[id] && !/^\s*$/.test(record[id])
  )
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
