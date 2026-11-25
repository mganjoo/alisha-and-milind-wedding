/**
 * Replacement for Gatsby's `navigate(to, { replace, state })`.
 * Navigation is a full page load, so `state` is carried in sessionStorage and
 * read once on the destination page with `consumeNavigationState()`.
 */
const STATE_KEY = "am-wedding:navigation-state"

export function navigate(
  to: string,
  options: { replace?: boolean; state?: unknown } = {}
) {
  try {
    if (options.state !== undefined) {
      sessionStorage.setItem(
        STATE_KEY,
        JSON.stringify({ path: to, state: options.state })
      )
    } else {
      sessionStorage.removeItem(STATE_KEY)
    }
  } catch {
    // Storage unavailable (e.g. private mode): state is best-effort.
  }
  if (options.replace) window.location.replace(to)
  else window.location.assign(to)
}

/** Returns state passed to `navigate()` for the current page (once), if any. */
export function consumeNavigationState<T>(): T | undefined {
  try {
    const raw = sessionStorage.getItem(STATE_KEY)
    if (!raw) return undefined
    sessionStorage.removeItem(STATE_KEY)
    const { path, state } = JSON.parse(raw) as { path: string; state: T }
    const here = window.location.pathname.replace(/\/$/, "") || "/"
    const target = path.replace(/\/$/, "") || "/"
    return here === target ? state : undefined
  } catch {
    return undefined
  }
}
