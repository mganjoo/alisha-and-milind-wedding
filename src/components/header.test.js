import React from "react"
import { render } from "@testing-library/react"
import Header from "./header"

describe("Header", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Header />)
    expect(getByText("Our Story")).toHaveTextContent("Our Story")
  })
})
