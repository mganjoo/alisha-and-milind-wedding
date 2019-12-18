import React from "react"
import NavLayout from "./NavLayout"
import Img, { FluidObject } from "gatsby-image"

interface ImageLayoutProps {
  fluidImage: FluidObject | FluidObject[]
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ fluidImage, children }) => {
  return (
    <NavLayout>
      <main className="-mt-4 max-w-3xl flex flex-col mb-10 mx-auto sm:mt-0 sm:px-4">
        <Img
          fluid={fluidImage}
          alt=""
          className="mb-8 shadow-md w-full"
          style={{ maxHeight: "24rem" }}
        />
        <div className="px-8 sm:px-0">{children}</div>
      </main>
    </NavLayout>
  )
}
export default ImageLayout
