import React from "react"
import Img, { FluidObject } from "gatsby-image"
import "./ImageGrid.module.css"

interface ImageGridProps {
  images: {
    image: FluidObject
    alt: string
    caption?: string
    objectPosition?: string
  }[]
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  return (
    <div className="my-6 sm:flex sm:flex-wrap sm:justify-center">
      {images.map(image => (
        <div
          key={image.image.src}
          className="mx-4 my-4 rounded-lg overflow-hidden flex flex-col flex-auto"
        >
          <Img
            fluid={image.image}
            alt={image.alt}
            // @ts-ignore styleName not supported on Gatsby image
            styleName="image"
            imgStyle={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
          />
          {image.caption && (
            <div className="text-center font-sans text-sm py-2 bg-gray-900 text-gray-100">
              {image.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
