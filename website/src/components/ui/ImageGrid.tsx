import { Dialog } from "@reach/dialog"
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
    <div
      className="my-6 sm:flex sm:flex-wrap sm:justify-center"
      styleName="grid-wrapper"
    >
      {images.map((image, i) => (
        <div
          key={image.image.src}
          className="mx-4 my-4 rounded-lg overflow-hidden flex flex-col flex-auto"
          onClick={() => handleClick(i)}
          onKeyPress={e => handleKeyPress(e, i)}
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
            <div className="text-center font-sans text-sm py-2 bg-gray-900 text-gray-100">
              {image.caption}
            </div>
          )}
        </div>
      ))}
      {dialogOpen && dialogImage && (
        <Dialog
          onDismiss={close}
          className="relative"
          aria-labelledby="caption-dialog"
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
        </Dialog>
      )}
    </div>
  )
}

export default ImageGrid
