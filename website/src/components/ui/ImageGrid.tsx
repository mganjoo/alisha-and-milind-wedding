import { DialogOverlay, DialogContent } from "@reach/dialog"
import Img, { FluidObject } from "gatsby-image"
import React, { useState } from "react"
import "./ImageGrid.module.css"
import Symbol from "./Symbol"

interface Image {
  image: FluidObject
  alt: string
  caption?: string
  fullCaption?: string
  objectPosition?: string
}

interface ImageGridProps {
  images: Image[]
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogImage, setDialogImage] = useState<Image>()

  const handleClick = (i: number) => {
    setDialogImage(images[i])
    setDialogOpen(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter") {
      handleClick(i)
    }
  }

  const close = () => setDialogOpen(false)

  return (
    <div className="my-6 sm:flex sm:flex-wrap sm:justify-center">
      {images.map((image, i) => (
        <div
          key={image.image.src}
          styleName="image-wrapper"
          onClick={() => handleClick(i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          role="button"
          tabIndex={0}
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
            <div className="text-center font-sans text-sm py-2 bg-gray-900 text-gray-100 print:text-gray-700 print:bg-transparent">
              {image.caption}
            </div>
          )}
        </div>
      ))}
      {dialogOpen && dialogImage && (
        <DialogOverlay onDismiss={close}>
          <DialogContent
            aria-label={
              dialogImage.fullCaption || dialogImage.caption || dialogImage.alt
            }
          >
            <div styleName="close-button-wrapper">
              <button aria-label="Close" onClick={close}>
                <Symbol symbol="close" size="m" />
              </button>
            </div>
            <Img
              fluid={dialogImage.image}
              alt={dialogImage.alt}
              className="w-full h-full"
              imgStyle={{ objectFit: "contain" }}
            />
            {dialogImage.fullCaption && (
              <p styleName="modal-caption" id="caption-dialog">
                {dialogImage.fullCaption}
              </p>
            )}
          </DialogContent>
        </DialogOverlay>
      )}
    </div>
  )
}

export default ImageGrid
