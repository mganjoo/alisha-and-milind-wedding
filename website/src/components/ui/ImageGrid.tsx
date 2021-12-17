import { DialogOverlay, DialogContent } from "@reach/dialog"
import classNames from "classnames"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import React, { useState } from "react"
import { captioned_image, uncaptioned_image } from "./ImageGrid.module.css"
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
          className="mx-4 my-4 rounded-lg overflow-hidden flex flex-col flex-auto print:rounded-none print:w-64 print:flex-none print:mx-auto c-link-focus active:outline-none focus:outline-none"
          onClick={() => handleClick(i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          role="button"
          tabIndex={0}
        >
          <GatsbyImage
            image={image.image}
            alt={image.alt}
            className={classNames(
              "h-full max-h-[24rem] sm:min-w-[16rem] print:max-h-full print:mx-4",
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
            <div className="absolute top-0 right-0 text-white z-10 m-2">
              <button
                aria-label="Close"
                className="p-2 bg-background-secondary-night border-subtle-night hover:text-accent-hover-night focus:outline-none focus:ring focus:ring-accent-focus-night"
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
              <p
                className="text-primary-night absolute inset-x-0 bottom-0 px-2 py-3 font-sans text-center text-sm bg-background-night bg-opacity-75"
                id="caption-dialog"
              >
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
