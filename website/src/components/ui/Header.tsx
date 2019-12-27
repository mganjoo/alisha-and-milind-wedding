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
    <header className="sticky top-0 z-10 border-b border-gray-subtle bg-off-white sm:static sm:z-0 print:static">
      <div className="relative">
        <div className="py-3 text-center sm:pt-6 sm:pb-2">
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
        <div className="absolute top-0 right-0 ml-1 mr-2 h-full flex items-center sm:hidden print:hidden">
          <button
            className="p-2 flex flex-col items-center justify-center bg-off-white focus:outline-none focus:shadow-outline-light"
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
            <span className="font-sans text-xs w-full">Menu</span>
          </button>
        </div>
      </div>
      <nav
        ref={navRef}
        className={classnames(
          dropdownVisible ? "visible" : "invisible",
          "absolute w-full z-10 bg-off-white border-b border-gray-subtle font-sans font-semibold text-gray-900 text-sm shadow-lg sm:shadow-none sm:static sm:visible sm:w-auto sm:border-b-0 sm:text-base print:hidden"
        )}
      >
        <ul className="py-3 shadow-inner border-t border-gray-subtle sm:py-0 sm:flex sm:flex-row sm:justify-center sm:items-center sm:border-t-0 sm:shadow-none">
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
