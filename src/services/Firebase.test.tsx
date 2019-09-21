import { renderHook } from "@testing-library/react-hooks"
import { useFirestore } from "./Firebase"

describe("useFirestore", () => {
  it("loads instances correctly, even with multiple calls", async () => {
    const firstRender = renderHook(() => useFirestore())
    await firstRender.waitForNextUpdate()
    expect(firstRender.result.current).not.toBeNull()
    const secondRender = renderHook(() => useFirestore())
    await secondRender.waitForNextUpdate()
    expect(secondRender.result.current).not.toBeNull()
  })
})
