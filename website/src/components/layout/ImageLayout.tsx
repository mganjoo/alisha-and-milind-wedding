import classnames from "classnames"
import Img, { FluidObject } from "gatsby-image"
import React from "react"
import NavLayout from "./NavLayout"
import "./ImageLayout.module.css"

interface ImageLayoutProps {
  fluidImage: FluidObject | FluidObject[]
  alt?: string
  objectPosition?: string
}

const ImageLayout: React.FC<ImageLayoutProps> = ({
  fluidImage,
  children,
  alt,
  objectPosition,
}) => {
  return (
    <NavLayout>
      <Img
        fluid={fluidImage}
        alt={alt || ""}
        className={classnames("mb-8 mx-auto shadow-md w-full p-cover")}
        // @ts-ignore styleName not supported on Gatsby image
        styleName="hero"
        imgStyle={objectPosition ? { objectPosition } : undefined}
      />
      <div className="px-8 sm:px-0">{children}</div>
    </NavLayout>
  )
}
export default ImageLayout
