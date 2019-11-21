import React from "react"
import NavLayout from "./NavLayout"
import Img, { FluidObject } from "gatsby-image"

interface ImageLayoutProps {
  fluidImage: FluidObject | FluidObject[]
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ fluidImage, children }) => {
  return (
    <NavLayout>
      <main className="-mt-4 max-w-3xl flex flex-col mb-10 mx-auto sm:mt-0">
        <Img fluid={fluidImage} alt="" className="mb-8 shadow-md w-full" />
        <div className="flex flex-col items-center px-8 sm:px-4">
          {children}
        </div>
      </main>
    </NavLayout>
  )
}
export default ImageLayout
