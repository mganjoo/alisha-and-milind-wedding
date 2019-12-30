import classnames from "classnames"
import React, { useState } from "react"
import Loading from "./Loading"

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
  const [loading, setLoading] = useState(true)
  return (
    <div
      className={classnames(
        "relative overflow-hidden w-full",
        containerClassName
      )}
      style={{ paddingBottom: paddingBottom }}
    >
      {loading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      )}
      <iframe
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full"
        title={title}
        onLoad={() => setLoading(false)}
        {...otherProps}
      />
    </div>
  )
}

export default IframeContainer
