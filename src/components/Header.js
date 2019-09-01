import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"
import { Link } from "gatsby"

function Header({ links }) {
  const [showDropdown, setShowDropdown] = useState(false)
  function toggleDropdown() {
    setShowDropdown(!showDropdown)
  }
  function closeDropdown() {
    setShowDropdown(false)
  }
  const menuButtonRef = useRef()
  const navRef = useRef()
  useEffect(() => {
    function handleClickOutside(event) {
      // Close if click is inside neither menu nor nav
      if (
        menuButtonRef.current &&
        navRef.current &&
        !menuButtonRef.current.contains(event.target) &&
        !navRef.current.contains(event.target)
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
  }, [showDropdown, menuButtonRef, navRef])

  return (
    <header className="border-b border-gray-400">
      <div className="relative">
        <div className="absolute mx-1 h-full flex items-center sm:hidden">
          <button
            className="p-2"
            ref={menuButtonRef}
            onClick={toggleDropdown}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="py-5 text-center sm:pt-8 sm:pb-2">
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl">
            <Link to="/">Alisha & Milind</Link>
          </h1>
          <h2 className="font-sans uppercase text-sm sm:text-xl lg:text-2xl">
            May 1-3, 2020 &middot; San Mateo, CA
          </h2>
        </div>
      </div>
      <nav
        ref={navRef}
        className={`${
          showDropdown ? "block " : "hidden "
        }py-3 border-t border-gray-400 font-sans font-semibold text-gray-900 text-sm sm:block sm:py-0 sm:border-t-0 sm:text-base lg:text-lg`}
      >
        <ul className="sm:flex sm:flex-row sm:justify-center sm:items-center">
          {links.map((link, index) => (
            <li
              key={index}
              className="text-center sm:inline-block sm:mx-2 lg:mx-4"
            >
              <Link
                onClick={closeDropdown}
                to={link.to}
                getProps={({ isCurrent }) => ({
                  className: `inline-block px-1 pt-4 pb-1 border-b-4 border-transparent hover:border-orange-300 sm:px-2 sm:py-3 sm:border-b-4${
                    isCurrent || link.forceActive
                      ? " border-orange-500 hover:border-orange-500"
                      : ""
                  }`,
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

Header.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      to: PropTypes.string,
      forceActive: PropTypes.bool,
    })
  ),
}

export default Header
