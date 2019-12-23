import classnames from "classnames"
import { Link, useStaticQuery, graphql } from "gatsby"
import React, { useEffect, useRef, useState } from "react"

interface HeaderLink {
  text: string
  to: string
  forceActive?: boolean
}

interface HeaderProps {
  links: HeaderLink[]
}

const Header: React.FC<HeaderProps> = ({ links }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            displayTitle
            displayDates
            location
          }
        }
      }
    `
  )
  const [dropdownVisible, setDropdownVisible] = useState(false)
  function closeDropdown() {
    setDropdownVisible(false)
  }
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (dropdownVisible) {
      const handleClickOutside = (event: UIEvent) => {
        // Close if click is inside neither menu nor nav
        if (
          menuButtonRef.current &&
          navRef.current &&
          !menuButtonRef.current.contains(event.target as HTMLButtonElement) &&
          !navRef.current.contains(event.target as HTMLElement)
        ) {
          closeDropdown()
        }
      }
      document.addEventListener("touchstart", handleClickOutside)
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("touchstart", handleClickOutside)
      }
    }
    return
  }, [dropdownVisible, menuButtonRef, navRef])

  return (
    <header className="border-b border-gray-subtle mb-4">
      <div className="relative">
        <div className="absolute mx-1 h-full flex items-center sm:hidden">
          <button
            className="ml-1 p-2 focus:outline-none focus:shadow-outline-light"
            ref={menuButtonRef}
            onClick={() => setDropdownVisible(!dropdownVisible)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="py-5 text-center sm:pt-8 sm:pb-2">
          <h1 className="font-display text-2xl sm:text-4xl">
            <Link
              to="/"
              className="focus:outline-none focus:shadow-outline-light px-1"
            >
              {data && data.site.siteMetadata.displayTitle}
            </Link>
          </h1>
          <h2 className="font-serif text-sm sm:text-xl">
            {data && data.site.siteMetadata.displayDates} &middot;{" "}
            {data && data.site.siteMetadata.location}
          </h2>
        </div>
      </div>
      <nav
        ref={navRef}
        className={classnames(
          dropdownVisible ? "block" : "hidden",
          "py-3 border-t border-gray-subtle font-sans font-semibold text-gray-900 text-sm shadow-inner sm:shadow-none sm:block sm:py-0 sm:border-t-0 sm:text-base"
        )}
      >
        <ul className="sm:flex sm:flex-row sm:justify-center sm:items-center">
          {links.map((link, index) => (
            <li key={index} className="text-center sm:inline-block sm:mx-2">
              <Link
                onClick={closeDropdown}
                to={link.to}
                getProps={({ isCurrent, isPartiallyCurrent }) => ({
                  className: classnames(
                    "inline-block px-1 pt-4 pb-1 border-b-4 focus:outline-none focus:border-orange-300 hover:border-orange-500 hover:text-orange-700 sm:px-2 sm:py-3 sm:border-b-4",
                    isCurrent || isPartiallyCurrent || link.forceActive
                      ? " border-orange-600"
                      : " border-transparent"
                  ),
                })}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
export default Header
