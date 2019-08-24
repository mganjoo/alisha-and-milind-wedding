import React from "react"

const Header = () => (
  <header className="py-6 sm:py-4 sm:pb-0 sm:mb-4">
    <div className="relative">
      <div className="absolute h-full pl-4 flex items-center sm:hidden">
        <svg
          className="w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </div>
      <div className="mx-auto text-center">
        <h1 className="font-display text-2xl sm:mt-4 sm:text-4xl lg:text-5xl">
          Alisha & Milind
        </h1>
        <h2 className="font-sans uppercase text-sm sm:text-xl lg:text-2xl">
          May 1-3, 2020 &middot; San Mateo, CA
        </h2>
        <nav>
          <ul className="hidden font-sans font-semibold sm:text-base mt-4 sm:flex sm:justify-center lg:text-lg border-b border-gray-400">
            <li className="mx-4 pb-3 lg:mx-6">Our Story</li>
            <li className="mx-4 pb-3 lg:mx-6 border-b-4 border-orange-500">
              Events
            </li>
            <li className="mx-4 pb-3 lg:mx-6">Travel</li>
            <li className="mx-4 pb-3 lg:mx-6">FAQ</li>
            <li className="mx-4 pb-3 lg:mx-6">RSVP</li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
)

export default Header
