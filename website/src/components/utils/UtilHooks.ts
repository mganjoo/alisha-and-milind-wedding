import { useEffect, useRef, useState } from "react"

export function useStateList<T>(stateList: T[]) {
  const [current, setCurrent] = useState(0)
  const movePrevious = () => setCurrent(c => (c > 0 ? c - 1 : c))
  const moveNext = () => setCurrent(c => (c < stateList.length - 1 ? c + 1 : c))
  const isAfter = (state: T) => {
    const reference = stateList.indexOf(state)
    if (reference === -1) {
      throw new Error(`could not find ${state} in ordered states`)
    }
    return current >= reference
  }

  return {
    state: stateList[current],
    movePrevious,
    moveNext,
    isAfter,
  }
}

// From https://usehooks.com/useWhyDidYouUpdate/
export function useWhyDidYouUpdate(
  name: string,
  props: { [key: string]: any }
) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef<{ [key: string]: any }>()

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      // Use this object to keep track of changed props
      const changesObj: { [key: string]: any } = {}
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (
          previousProps.current &&
          previousProps.current[key] !== props[key]
        ) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj)
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props
  })
}
