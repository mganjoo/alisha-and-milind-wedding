import React from "react"
import NavLayout from "./NavLayout"
import Img, { FluidObject } from "gatsby-image"
import classnames from "classnames"

interface ImageLayoutProps {
  fluidImage: FluidObject | FluidObject[]
  alt?: string
  objectPosition?: string
  full?: boolean
}

const ImageLayout: React.FC<ImageLayoutProps> = ({
  fluidImage,
  children,
  alt,
  objectPosition,
  full,
}) => {
  return (
    <NavLayout>
      <Img
        fluid={fluidImage}
        alt={alt || ""}
        className={classnames(
          "mb-8 mx-auto shadow-md w-full p-cover",
          full ? "c-full-screen-hero" : "c-hero"
        )}
        imgStyle={objectPosition ? { objectPosition } : undefined}
      />
      <div className="px-8 sm:px-0">{children}</div>
    </NavLayout>
  )
}
export default ImageLayout
