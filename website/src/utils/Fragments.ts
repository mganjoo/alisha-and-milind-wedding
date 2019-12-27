import { graphql } from "gatsby"

export const heroImageFragment = graphql`
  fragment HeroImage on ImageSharp {
    fluid(maxWidth: 672) {
      ...GatsbyImageSharpFluid_noBase64
    }
  }
`

export const gridImageFragment = graphql`
  fragment GridImage on ImageSharp {
    fluid {
      ...GatsbyImageSharpFluid
    }
  }
`
