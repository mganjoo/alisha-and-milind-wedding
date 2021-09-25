import { SkipNavLink, SkipNavContent } from "@reach/skip-nav"
import classNames from "classnames"
import Img, { FluidObject } from "gatsby-image"
import React from "react"
import Header from "../ui/Header"
import WeddingLogo from "../ui/WeddingLogo"
import BaseLayout from "./BaseLayout"
import styles from "./NavLayout.module.css"

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
          { text: "Schedule", to: "/schedule" },
          { text: "Travel & Hotel", to: "/travel" },
          { text: "Our Story", to: "/story" },
          { text: "Video", to: "/video" },
          { text: "FAQ", to: "/faq" },
          { text: "Registry", to: "/registry" },
          { text: "RSVP", to: "/rsvp" },
        ]}
      />
      <main>
        <SkipNavContent />
        {heroImage && (
          <div
            className={classNames(
              "border-b border-gray-subtle print:bg-transparent print:border-b-0",
              styles.page_bg
            )}
          >
            <Img
              fluid={heroImage}
              alt={alt || ""}
              className={classNames("p-cover", styles.hero)}
              imgStyle={objectPosition ? { objectPosition } : undefined}
            />
          </div>
        )}
        <div
          className={classNames("max-w-4xl mx-auto px-8 pt-6 pb-8 sm:px-6", {
            "mt-4": !heroImage,
          })}
        >
          {children}
        </div>
      </main>
      <footer className="pb-8 text-gray-700 font-serif flex flex-col items-center">
        {!hideBackToTop && (
          <button
            className="c-inline-button hidden sm:block print:hidden"
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Back to top
          </button>
        )}
        <hr
          className="mt-4 mb-1 inline-block w-10 border-gray-500"
          aria-hidden
        />
        <div className="my-2">
          <WeddingLogo />
        </div>
        <p className="text-sm">Created with love by Milind &amp; Alisha</p>
        <p className="text-sm">#AlishaWinsAMil</p>
      </footer>
    </BaseLayout>
  )
}
export default NavLayout
