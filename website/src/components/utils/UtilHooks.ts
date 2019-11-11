import { useState } from "react"

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
