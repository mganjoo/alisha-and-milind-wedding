import { type Ref, type RefCallback, useCallback, useRef } from "react"

function assign<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node)
  else if (ref) ref.current = node
}

/**
 * Combines react-hook-form's `register()` ref (a new function on every render)
 * with an optional external ref into ONE callback whose identity only changes
 * with `external`/`key`. Otherwise React would detach and re-attach the refs on
 * every render, which would churn the NodeManager registry in a render loop.
 */
export function useMergedRef<T>(
  rhfRef: RefCallback<T>,
  external: Ref<T> | undefined,
  key: string
): RefCallback<T> {
  const rhfRefLatest = useRef(rhfRef)
  rhfRefLatest.current = rhfRef
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is an intentional extra dependency; it makes the callback identity change so the ref is re-attached when the field key changes
  return useCallback(
    (node: T | null) => {
      rhfRefLatest.current(node)
      assign(external, node)
    },
    [external, key]
  )
}
