import { DialogOverlay, DialogContent } from "@reach/dialog"
import classNames from "classnames"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import React, { useState } from "react"
import {
  close_button_wrapper,
  image as image_style,
  image_wrapper,
  modal_caption,
  captioned_image,
  uncaptioned_image,
} from "./ImageGrid.module.css"
import Symbol from "./Symbol"

interface Image {
  image: IGatsbyImageData
  id: string
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
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2">
      {images.map((image, i) => (
        <div
          key={image.id}
          className={classNames(
            image_wrapper,
            "c-link-focus active:outline-none focus:outline-none"
          )}
          onClick={() => handleClick(i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          role="button"
          tabIndex={0}
        >
          <GatsbyImage
            image={image.image}
            alt={image.alt}
            className={classNames(
              image_style,
              image.caption ? captioned_image : uncaptioned_image
            )}
            imgStyle={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
          />
          {image.caption && (
            <div className="text-center font-sans text-sm py-2 bg-gray-800 text-primary-night dark:bg-gray-700 print:text-secondary print:bg-transparent">
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
            <div className={close_button_wrapper}>
              <button
                aria-label="Close"
                className="p-2 focus:outline-none focus:ring focus:ring-accent-focus-night"
                onClick={close}
              >
                <Symbol symbol="close" size="m" />
              </button>
            </div>
            <GatsbyImage
              image={dialogImage.image}
              alt={dialogImage.alt}
              className="w-full h-full"
              imgStyle={{ objectFit: "contain" }}
            />
            {dialogImage.fullCaption && (
              <p className={modal_caption} id="caption-dialog">
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
