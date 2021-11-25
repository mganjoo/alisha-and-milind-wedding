import classnames from "classnames"
import { Link } from "gatsby"
import React, { useEffect, useRef, useState } from "react"
import { useWeddingMetadata } from "../../interfaces/WeddingMetadata"

interface HeaderLink {
  text: string
  to: string
  forceActive?: boolean
}

interface HeaderProps {
  links: HeaderLink[]
}

const Header: React.FC<HeaderProps> = ({ links }) => {
  const { displayTitle, weddingDate, location } = useWeddingMetadata()
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
  }, [dropdownVisible])

  return (
    <header className="sticky top-0 z-10 border-b h-bg-colors border-subtle sm:static sm:z-0 dark:border-subtle-night print:static">
      <div className="relative">
        <div className="py-3 text-center sm:pt-4 sm:pb-2">
          <h1 className="font-display text-2xl sm:text-3xl">
            <Link to="/" className="px-1 c-link-focus-outline">
              {displayTitle}
            </Link>
          </h1>
          <h2 className="font-serif text-sm sm:text-lg">
            {weddingDate} &middot; {location}
          </h2>
        </div>
        <div className="absolute top-0 right-0 mx-2 h-full flex items-center sm:hidden print:hidden">
          <button
            className="p-2 flex flex-col items-center justify-center c-link-focus-outline h-bg-colors"
            type="button"
            ref={menuButtonRef}
            onClick={() => setDropdownVisible(!dropdownVisible)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-5 h-5 fill-current"
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
          "border-subtle h-bg-colors h-fg-colors absolute w-full z-10 border-b font-sans font-semibold text-sm shadow-lg dark:border-subtle-night sm:shadow-none sm:static sm:visible sm:w-auto sm:border-b-0 sm:text-base print:hidden"
        )}
      >
        <ul className="pt-3 pb-4 shadow-inner border-t border-subtle dark:border-subtle-night sm:py-0 sm:flex sm:justify-center sm:items-center sm:border-t-0 sm:shadow-none dark:bg-background-secondary-night sm:dark:bg-transparent">
          {links.map((link, index) => (
            <li key={index} className="text-center sm:mx-1 md:mx-2">
              <Link
                onClick={closeDropdown}
                to={link.to}
                getProps={({ isCurrent, isPartiallyCurrent }) => ({
                  className: classnames(
                    "inline-block px-1 pt-4 pb-1 border-b-4 focus-visible:outline-none focus-visible:border-opacity-90 focus-visible:border-accent-focus hover:border-accent-hover hover:text-accent-hover dark:focus-visible:border-accent-focus-night dark:focus-visible:border-opacity-100 dark:hover:text-accent-hover-night dark:hover:border-accent-hover-night sm:px-2 sm:pt-3 sm:pb-2 sm:border-b-4",
                    isCurrent || isPartiallyCurrent || link.forceActive
                      ? "border-accent"
                      : "border-transparent"
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
