import React from "react"
import Header from "./Header"

const link1 = { text: "Schedule", to: "/schedule" }
const link2 = { text: "Travel & Accommodation", to: "/travel" }
const link4 = { text: "The Story", to: "/story" }
const link3 = { text: "FAQ", to: "/faq" }
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
  decorators: [
    (storyFn: any) => (
      <div>
        {storyFn()}
        <p className="px-4 text-center">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
    ),
  ],
}

export const main = () => <Header links={defaultLinks} />

export const withActiveLink = () => <Header links={linksWithActive} />
