import React from "react"
import Helmet from "react-helmet"
import classnames from "classnames"

interface BaseLayoutProps {
  additionalBodyClassName?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  additionalBodyClassName,
}) => {
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
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="robots" content="noindex" />
        <body
          className={classnames(
            "bg-off-white text-gray-900",
            additionalBodyClassName
          )}
        ></body>
      </Helmet>
      {children}
    </>
  )
}
export default BaseLayout
