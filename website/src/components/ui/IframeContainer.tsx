import classnames from "classnames"
import React from "react"

interface IframeContainerProps
  extends Omit<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    "width" | "height" | "className"
  > {
  width: number
  height: number
  containerClassName?: string
}

const IframeContainer: React.FC<IframeContainerProps> = ({
  width,
  height,
  title,
  containerClassName,
  ...otherProps
}) => {
  const paddingBottom = `${((100 * height) / width).toFixed(5)}%`
  return (
    <div
      className={classnames(
        "relative overflow-hidden w-full",
        containerClassName
      )}
      style={{ paddingBottom: paddingBottom }}
    >
      <iframe
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full"
        title={title}
        {...otherProps}
      />
    </div>
  )
}

export default IframeContainer
