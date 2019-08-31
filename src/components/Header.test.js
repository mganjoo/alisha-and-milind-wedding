import React from "react"
import { render } from "@testing-library/react"
import Header from "./Header"

const link1 = { text: "Our Story", to: "/our-story" }
const link2 = { text: "Events", to: "/events" }
const link3 = { text: "Travel", to: "/travel" }
const link4 = { text: "FAQ", to: "/faq" }
const link5 = { text: "RSVP", to: "/rsvp" }

const linksWithActive = [
  link1,
  { ...link2, forceActive: true },
  link3,
  link4,
  link5,
]

describe("Header", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Header links={linksWithActive} />)
    expect(getByText("Our Story")).toHaveTextContent("Our Story")
  })
})
