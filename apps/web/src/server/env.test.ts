import { describe, expect, it } from "vitest"
import { decodePathParam } from "./env"

describe("decodePathParam", () => {
  it("decodes what the client's encodeURIComponent produced", () => {
    expect(decodePathParam(encodeURIComponent("t:M3AxoQSl"))).toBe("t:M3AxoQSl")
    expect(decodePathParam("t%3AM3AxoQSl")).toBe("t:M3AxoQSl")
  })
  it("leaves plain codes alone", () => {
    expect(decodePathParam("nB-PyzuVV")).toBe("nB-PyzuVV")
    expect(decodePathParam("t:M3AxoQSl")).toBe("t:M3AxoQSl")
  })
  it("treats malformed escapes and missing params as not found", () => {
    expect(decodePathParam("%E0%A4")).toBeUndefined()
    expect(decodePathParam(undefined)).toBeUndefined()
  })
})
