import clsx from "clsx"
import { useState } from "react"
import { Dialog, Modal, ModalOverlay } from "react-aria-components"
import type { PictureData } from "../../lib/picture"
import styles from "./ImageGrid.module.css"
import ResponsivePicture from "./ResponsivePicture"
import SymbolIcon from "./Symbol"

// Rendered widths: a grid cell, and the modal (max-w-3xl).
const gridSizes = "(min-width: 640px) 400px, calc(100vw - 6rem)"
const modalSizes = "(min-width: 768px) 768px, 100vw"

interface Image {
  image: PictureData
  id: string
  alt: string
  caption?: string
  fullCaption?: string
  objectPosition?: string
}

interface ImageGridProps {
  images: Image[]
}

const ImageGrid = ({ images }: ImageGridProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogImage, setDialogImage] = useState<Image>()

  const handleClick = (i: number) => {
    setDialogImage(images[i])
    setDialogOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter") {
      handleClick(i)
    }
  }

  const close = () => setDialogOpen(false)

  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2">
      {images.map((image, i) => (
        // biome-ignore lint/a11y/useSemanticElements: a <button> can't legally contain this block markup (div/picture) and would change the DOM/layout
        <div
          key={image.id}
          className="mx-4 my-4 rounded-lg overflow-hidden flex flex-col flex-auto print:rounded-none print:w-64 print:flex-none print:mx-auto c-link-focus active:outline-hidden focus:outline-hidden"
          onClick={() => handleClick(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          role="button"
          tabIndex={0}
        >
          <ResponsivePicture
            image={image.image}
            alt={image.alt}
            sizes={gridSizes}
            // Fills the grid cell (cropping with object-cover) like the old
            // Gatsby wrapper: the aspect ratio only sets the natural height.
            pictureClassName={clsx(
              "relative block flex-auto max-h-96 overflow-hidden sm:min-w-[16rem] print:max-h-full print:mx-4",
              image.caption ? styles.captioned_image : styles.uncaptioned_image
            )}
            pictureStyle={{
              aspectRatio: `${image.image.width} / ${image.image.height}`,
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
          />
          {image.caption && (
            <div className="text-center font-sans text-sm py-2 bg-stone-800 text-primary-night dark:bg-stone-700 print:text-secondary print:bg-transparent">
              {image.caption}
            </div>
          )}
        </div>
      ))}
      <ModalOverlay
        className={styles.overlay}
        isOpen={dialogOpen && !!dialogImage}
        onOpenChange={setDialogOpen}
        isDismissable
      >
        <Modal className={styles.content}>
          {dialogImage && (
            <Dialog
              aria-label={
                dialogImage.fullCaption ||
                dialogImage.caption ||
                dialogImage.alt
              }
              className="h-full outline-hidden"
            >
              <div className="absolute top-0 right-0 text-white z-10 m-2">
                <button
                  type="button"
                  aria-label="Close"
                  className="p-2 bg-background-secondary-night border-subtle-night hover:text-accent-hover-night focus:outline-hidden focus:ring-3 focus:ring-accent-focus-night"
                  onClick={close}
                >
                  <SymbolIcon symbol="close" size="m" />
                </button>
              </div>
              <ResponsivePicture
                image={dialogImage.image}
                alt={dialogImage.alt}
                sizes={modalSizes}
                pictureClassName="block w-full h-full"
                className="w-full h-full object-contain"
              />
              {dialogImage.fullCaption && (
                <p
                  className="text-primary-night absolute inset-x-0 bottom-0 px-2 py-3 font-sans text-center text-sm bg-background-night/75"
                  id="caption-dialog"
                >
                  {dialogImage.fullCaption}
                </p>
              )}
            </Dialog>
          )}
        </Modal>
      </ModalOverlay>
    </div>
  )
}

export default ImageGrid
