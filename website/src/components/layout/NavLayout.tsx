import { SkipNavLink, SkipNavContent } from "@reach/skip-nav"
import classNames from "classnames"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import React from "react"
import Header from "../ui/Header"
import WeddingLogo from "../ui/WeddingLogo"
import BaseLayout from "./BaseLayout"
import { hero } from "./NavLayout.module.css"

interface NavLayoutProps {
  heroImage?: IGatsbyImageData
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
          <div className="border-b h-bg-colors bg-hero-pattern flex justify-center border-subtle dark:bg-hero-pattern-night dark:border-subtle-night print:bg-transparent print:border-b-0">
            <GatsbyImage
              image={heroImage}
              alt={alt || ""}
              className={classNames("p-cover", hero)}
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
      <footer className="pb-8 text-secondary font-serif flex flex-col items-center dark:text-secondary-night print:text-secondary">
        {!hideBackToTop && (
          <button
            className="c-button-inline c-link-focus hidden sm:block print:hidden"
            type="button"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Back to top
          </button>
        )}
        <hr
          className="mt-4 mb-1 inline-block w-10 border-subtle dark:border-subtle-night print:border-subtle"
          aria-hidden
        />
        <div className="my-2">
          <WeddingLogo />
        </div>
        <p className="text-sm">Created with love by Milind &amp; Alisha</p>
        <p className="text-sm">#AlishaWonAMil</p>
      </footer>
    </BaseLayout>
  )
}
export default NavLayout
