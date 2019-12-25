import { graphql } from "gatsby"

export const heroImageFragment = graphql`
  fragment HeroImage on ImageSharp {
    fluid(maxWidth: 672) {
      ...GatsbyImageSharpFluid
    }
  }
`
