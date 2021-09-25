import { DialogOverlay, DialogContent } from "@reach/dialog"
import Img, { FluidObject } from "gatsby-image"
import React, { useState } from "react"
import styles from "./ImageGrid.module.css"
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
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2">
      {images.map((image, i) => (
        <div
          key={image.image.src}
          className={styles.image_wrapper}
          onClick={() => handleClick(i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          role="button"
          tabIndex={0}
        >
          <Img
            fluid={image.image}
            alt={image.alt}
            className={styles.image}
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
            <div className={styles.close_button_wrapper}>
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
              <p className={styles.modal_caption} id="caption-dialog">
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
