import { useCallback, useEffect, useState } from "react"
import { get, set } from "idb-keyval"

interface IndexedValue<T> {
  loading: boolean
  value: T | undefined
}

export function useIndexedValue<T>(
  key: string
): [IndexedValue<T>, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<IndexedValue<T>>({
    loading: true,
    value: undefined,
  })
  useEffect(() => {
    get<T | undefined>(key).then(maybeValue => {
      setStoredValue({ loading: false, value: maybeValue })
    })
  }, [key])
  const setValue: (value: T) => void = useCallback(
    (value: T) => {
      setStoredValue({ loading: false, value: value })
      set(key, value)
    },
    [key]
  )
  return [storedValue, setValue]
}
