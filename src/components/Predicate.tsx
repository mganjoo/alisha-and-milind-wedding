export interface Predicate {
  (value: string): boolean
}
export const ValidEmail: Predicate = value => /\S+@\S+\.\S+/.test(value)
export const NonEmpty: Predicate = value => value.length > 0
