import type { PictureData } from "../../lib/picture"

interface ResponsivePictureProps {
  image: PictureData
  alt: string
  className?: string
  pictureClassName?: string
  pictureStyle?: React.CSSProperties
  style?: React.CSSProperties
  /** Overrides the `sizes` the image data was built with. */
  sizes?: string
  loading?: "lazy" | "eager"
  imgRef?: React.Ref<HTMLImageElement>
  onLoad?: () => void
}

/** Plain <picture> for React islands; see lib/picture.ts. */
const ResponsivePicture = ({
  image,
  alt,
  className,
  pictureClassName,
  pictureStyle,
  style,
  sizes = image.sizes,
  loading = "lazy",
  imgRef,
  onLoad,
}: ResponsivePictureProps) => (
  <picture className={pictureClassName} style={pictureStyle}>
    {image.sources.map((source) => (
      <source
        key={source.type}
        type={source.type}
        srcSet={source.srcSet}
        sizes={sizes}
      />
    ))}
    <img
      ref={imgRef}
      onLoad={onLoad}
      className={className}
      style={style}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
      alt={alt}
    />
  </picture>
)

export default ResponsivePicture
