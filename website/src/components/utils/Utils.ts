import { FormikHelpers } from "formik"
import shortid from "shortid"

export function createSubmitFunction<Val>(
  submit: (values: Val) => Promise<void>
) {
  return (values: Val, actions: FormikHelpers<Val>) => {
    return submit(values).finally(() => actions.setSubmitting(false))
  }
}

/**
 *
 * Transforms an array of T[] to an object of string key to S, using a function that maps T -> S.
 * Uses a `shortid` for key.
 */
export function makeIdMap<T, S>(
  input: T[],
  fn: (t: T) => S
): { [key: string]: S } {
  return input.reduce(
    (map, i) => {
      map[shortid.generate()] = fn(i)
      return map
    },
    {} as { [key: string]: S }
  )
}

export function range(n: number) {
  return Array(n)
    .fill(null)
    .map((_, i) => i)
}
