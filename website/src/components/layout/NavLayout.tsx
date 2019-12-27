import { SkipNavLink, SkipNavContent } from "@reach/skip-nav"
import classnames from "classnames"
import Img, { FluidObject } from "gatsby-image"
import React from "react"
import Header from "../ui/Header"
import BaseLayout from "./BaseLayout"
import "./NavLayout.module.css"

interface NavLayoutProps {
  heroImage?: FluidObject | FluidObject[]
  heroBackground?: string
  alt?: string
  objectPosition?: string
  hideBackToTop?: boolean
}

const NavLayout: React.FC<NavLayoutProps> = ({
  children,
  heroImage,
  heroBackground,
  alt,
  objectPosition,
  hideBackToTop,
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
      <main className="flex flex-col pb-10">
        <SkipNavContent />
        {heroImage && (
          <div
            className={classnames("mb-8 print:bg-transparent", heroBackground)}
          >
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
          className={classnames("max-w-4xl mx-auto px-8 sm:px-6", {
            "mt-4": !heroImage,
          })}
        >
          {children}
        </div>
      </main>
      {!hideBackToTop && (
        <footer className="hidden pb-6 text-gray-700 sm:flex sm:justify-center">
          <button
            className="c-inline-button"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Back to top
          </button>
        </footer>
      )}
    </BaseLayout>
  )
}
export default NavLayout
