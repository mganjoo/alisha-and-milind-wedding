import classnames from "classnames"
import Img, { FluidObject } from "gatsby-image"
import React from "react"
import Header from "../ui/Header"
import BaseLayout from "./BaseLayout"
import "./NavLayout.module.css"

interface NavLayoutProps {
  heroImage?: FluidObject | FluidObject[]
  alt?: string
  objectPosition?: string
}

const NavLayout: React.FC<NavLayoutProps> = ({
  children,
  heroImage,
  alt,
  objectPosition,
}) => {
  return (
    <BaseLayout>
      <Header
        links={[
          { text: "Our Story", to: "/our-story" },
          { text: "Schedule", to: "/schedule" },
          { text: "Travel & Accommodation", to: "/travel" },
          { text: "FAQ", to: "/faq" },
          { text: "RSVP", to: "/rsvp" },
        ]}
      />
      <main className="-mt-4 max-w-4xl flex flex-col mx-auto pb-8 sm:mt-0 sm:px-6">
        {heroImage && (
          <Img
            fluid={heroImage}
            alt={alt || ""}
            className="mb-8 mx-auto shadow-md w-full p-cover"
            // @ts-ignore styleName not supported on Gatsby image
            styleName="hero"
            imgStyle={objectPosition ? { objectPosition } : undefined}
          />
        )}
        <div className={classnames("px-6 sm:px-0", { "mt-4": !heroImage })}>
          {children}
        </div>
      </main>
    </BaseLayout>
  )
}
export default NavLayout
