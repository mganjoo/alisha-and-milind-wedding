import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { navigate } from "../../utils/navigation"
import CodeRoute, { matchCodeRoute } from "./CodeRoute"

vi.mock("../../utils/navigation")
vi.mock("./CodeLoader", () => ({ default: () => <span>loader</span> }))

describe("CodeRoute", () => {
  it.each(["/s/nope/abc", "/s/a/b/c", "/s/%E0%A4/abc"])(
    "redirects home (replace) for the unmatched path %s",
    (path) => {
      window.history.pushState({}, "", path)
      const { container } = render(<CodeRoute />)
      expect(navigate).toHaveBeenCalledWith("/", { replace: true })
      expect(container).toBeEmptyDOMElement()
    }
  )

  it("loads, without redirecting itself, for a matching path", () => {
    window.history.pushState({}, "", "/s/abc")
    const { getByText } = render(<CodeRoute />)
    expect(getByText("loader")).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
  })
})

describe("matchCodeRoute", () => {
  it("matches the valid routes", () => {
    expect(matchCodeRoute("/s")).toEqual({ redirectTo: "/" })
    expect(matchCodeRoute("/s/abc")).toEqual({ redirectTo: "/", code: "abc" })
    expect(matchCodeRoute("/s/home/abc")).toEqual({
      redirectTo: "/",
      code: "abc",
    })
    expect(matchCodeRoute("/s/rsvp/abc")).toEqual({
      redirectTo: "/rsvp",
      code: "abc",
    })
    expect(matchCodeRoute("/s/ab%20c")).toEqual({
      redirectTo: "/",
      code: "ab c",
    })
  })

  it("ignores other paths and unknown sections", () => {
    expect(matchCodeRoute("/faq")).toBeUndefined()
    expect(matchCodeRoute("/s/nope/abc")).toBeUndefined()
    expect(matchCodeRoute("/s/a/b/c")).toBeUndefined()
  })

  it.each([
    ["the code", "/s/%E0%A4"],
    ["the code after a section", "/s/rsvp/%E0%A4"],
    ["a lone percent sign", "/s/100%"],
    ["a lone percent sign after a section", "/s/rsvp/%"],
  ])(
    "goes home, without a code, for a route that fits with a malformed escape in %s",
    (_, path) => {
      const match = matchCodeRoute(path)
      expect(match).toEqual({ redirectTo: "/" })
      expect(match).not.toHaveProperty("code")
    }
  )

  it.each([
    ["the section", "/s/%E0%A4/abc"],
    ["the section and the code", "/s/%E0%A4/%E0%A4"],
    ["a later segment of a too-long route", "/s/rsvp/abc/%"],
    ["an unknown section with a malformed code", "/s/nope/%E0%A4"],
    ["a too-long route", "/s/a/%E0%A4/c"],
  ])(
    "ignores a route whose shape does not fit, with a malformed escape in %s",
    (_, path) => {
      expect(matchCodeRoute(path)).toBeUndefined()
    }
  )
})
