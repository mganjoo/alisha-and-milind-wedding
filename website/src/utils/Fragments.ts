import { graphql } from "gatsby"

export const heroImageFragment = graphql`
  fragment HeroImage on ImageSharp {
    gatsbyImageData(layout: CONSTRAINED, width: 672)
  }
`

export const gridImageFragment = graphql`
  fragment GridImage on ImageSharp {
    gatsbyImageData(layout: CONSTRAINED)
  }
`
