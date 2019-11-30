import React from "react"
import Header from "./Header"

const link1 = { text: "Our Story", to: "/our-story" }
const link2 = { text: "Events", to: "/events" }
const link3 = { text: "Travel", to: "/travel" }
const link4 = { text: "FAQ", to: "/faq" }
const link5 = { text: "RSVP", to: "/rsvp" }

const defaultLinks = [link1, link2, link3, link4, link5]
const linksWithActive = [
  link1,
  { ...link2, forceActive: true },
  link3,
  link4,
  link5,
]

export default {
  title: "Header",
}

export const main = () => <Header links={defaultLinks} />

export const withActiveLink = () => <Header links={linksWithActive} />