import { useEffect, useMemo } from "react"
import { navigate } from "../../utils/navigation"
import CodeLoader from "./CodeLoader"

/**
 * Same routes the old reach-router `<Router basepath="/s">` matched. `section`
 * is the page to redirect to; `/s/:code` and `/s/home/:code` both go home.
 */
const redirects: Record<string, string> = {
  home: "/",
  invitation: "/invitation",
  faq: "/faq",
  schedule: "/schedule",
  rsvp: "/rsvp",
  travel: "/travel",
  registry: "/registry",
}

export function matchCodeRoute(
  pathname: string
): { redirectTo: string; code?: string } | undefined {
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] !== "s") return undefined
  // Decode each segment on its own; a malformed escape (e.g. "%E0%A4") makes
  // that segment undecodable (null) instead of changing the route's shape.
  const rest = parts.slice(1).map((part) => {
    try {
      return decodeURIComponent(part)
    } catch {
      return null
    }
  })
  if (rest.length === 0) return { redirectTo: "/" }
  if (rest.length === 1) {
    // An undecodable code can't be any invitation's: same as an unknown code.
    return rest[0] === null
      ? { redirectTo: "/" }
      : { redirectTo: "/", code: rest[0] }
  }
  if (rest.length === 2) {
    const [section, code] = rest
    // An undecodable section isn't a known one, so the shape doesn't match.
    if (section === null || !Object.hasOwn(redirects, section)) return undefined
    return code === null
      ? { redirectTo: "/" }
      : { redirectTo: redirects[section], code }
  }
  return undefined
}

/** Client-only: reads the URL, then loads the invitation and redirects. */
const CodeRoute = () => {
  const match = useMemo(() => matchCodeRoute(window.location.pathname), [])
  // Any /s/... path that matches no route goes home (the page would otherwise
  // be blank).
  useEffect(() => {
    if (!match) navigate("/", { replace: true })
  }, [match])
  return match ? <CodeLoader {...match} /> : null
}
export default CodeRoute
