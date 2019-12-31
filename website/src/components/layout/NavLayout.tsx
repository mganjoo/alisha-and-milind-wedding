import { SkipNavLink, SkipNavContent } from "@reach/skip-nav"
import classnames from "classnames"
import Img, { FluidObject } from "gatsby-image"
import React from "react"
import Header from "../ui/Header"
import WeddingLogo from "../ui/WeddingLogo"
import BaseLayout from "./BaseLayout"
import "./NavLayout.module.css"

interface NavLayoutProps {
  heroImage?: FluidObject | FluidObject[]
  alt?: string
  objectPosition?: string
  hideBackToTop?: boolean
}

const NavLayout: React.FC<NavLayoutProps> = ({
  children,
  heroImage,
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
      <main className="flex flex-col pb-8">
        <SkipNavContent />
        {heroImage && (
          <div
            className="mb-8 border-b border-gray-subtle print:bg-transparent"
            styleName="page-bg"
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
      <footer className="pb-8 text-gray-600 font-serif flex flex-col items-center">
        {!hideBackToTop && (
          <button
            className="c-inline-button text-gray-700 hidden sm:block"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Back to top
          </button>
        )}
        <div className="my-2">
          <WeddingLogo />
        </div>
        <p className="text-sm">#AlishaWinsAMil</p>
      </footer>
    </BaseLayout>
  )
}
export default NavLayout
