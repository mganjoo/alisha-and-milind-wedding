import "focus-visible"
import classnames from "classnames"
import React from "react"
import { Helmet } from "react-helmet"
import { useWeddingMetadata } from "../../interfaces/WeddingMetadata"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"

interface BaseLayoutProps {
  additionalBodyClassName?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  additionalBodyClassName,
}) => {
  const metadata = useWeddingMetadata()
  return (
    <WeddingMetadataContext.Provider value={metadata}>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="mask-icon" href="/favicon-outline.svg" color="#000000" />
        <meta name="robots" content="noindex" />
        <body
          className={classnames(
            "h-bg-colors h-fg-colors selection:bg-orange-200 dark:selection:bg-orange-600 dark:selection:text-white",
            additionalBodyClassName
          )}
        ></body>
      </Helmet>
      {children}
    </WeddingMetadataContext.Provider>
  )
}
export default BaseLayout
