import React, { ReactNode } from "react"
import Helmet from "react-helmet"

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/favicon-outline.svg" color="#1a202c" />
        <meta name="robots" content="noindex" />
        <body className="bg-off-white font-serif text-gray-900"></body>
      </Helmet>
      {children}
    </>
  )
}
