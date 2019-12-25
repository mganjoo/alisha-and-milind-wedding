import { SkipNavLink, SkipNavContent } from "@reach/skip-nav"
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
      <SkipNavLink />
      <Header
        links={[
          { text: "Our Story", to: "/our-story" },
          { text: "Schedule", to: "/schedule" },
          { text: "Travel & Accommodation", to: "/travel" },
          { text: "FAQ", to: "/faq" },
          { text: "RSVP", to: "/rsvp" },
        ]}
      />
      <main className="-mt-4 flex flex-col pb-8 sm:mt-0 sm:px-6">
        <SkipNavContent />
        {heroImage && (
          <div className="mb-8">
            <Img
              fluid={heroImage}
              alt={alt || ""}
              className="p-cover"
              // @ts-ignore styleName not supported on Gatsby image
              styleName="hero"
              imgStyle={objectPosition ? { objectPosition } : undefined}
            />
          </div>
        )}
        <div
          className={classnames("max-w-4xl mx-auto px-6 sm:px-0", {
            "mt-4": !heroImage,
          })}
        >
          {children}
        </div>
      </main>
    </BaseLayout>
  )
}
export default NavLayout
