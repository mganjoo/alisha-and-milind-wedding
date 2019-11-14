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

/**
 * Quickly see what props changed and caused a re-render.
 *
 * From: https://usehooks.com/useWhyDidYouUpdate/
 *
 * @param label Label to use for console output
 * @param props An object with props and values to monitor
 */
export function useWhyDidYouUpdate(label: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changes: Record<string, { from: any; to: any }> = {}
      allKeys.forEach(key => {
        if (
          previousProps.current &&
          previousProps.current[key] !== props[key]
        ) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })
      if (Object.keys(changes).length) {
        console.log("[why-did-you-update]", label, changes)
      }
    }
    previousProps.current = props
  })
}
