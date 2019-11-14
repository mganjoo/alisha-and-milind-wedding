import shortid from "shortid"

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
