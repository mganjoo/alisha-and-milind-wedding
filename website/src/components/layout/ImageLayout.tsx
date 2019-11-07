import React from "react"
import NavLayout from "./NavLayout"
import Img, { FluidObject } from "gatsby-image"

interface ImageLayoutProps {
  fluidImage: FluidObject | FluidObject[]
}

const ImageLayout: React.FC<ImageLayoutProps> = ({ fluidImage, children }) => {
  return (
    <NavLayout>
      <main className="-mt-4 md:flex md:px-4 md:mt-0">
        <Img
          fluid={fluidImage}
          alt=""
          className="mb-8 shadow-md md:mb-0 md:shadow-none md:w-7/12"
        />
        <div className="pl-10 flex flex-col items-center c-article md:items-start md:w-5/12">
          {children}
        </div>
      </main>
    </NavLayout>
  )
}
export default ImageLayout
