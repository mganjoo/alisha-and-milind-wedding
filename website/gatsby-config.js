require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")

const backgroundColor = "#fffcf7" // Off-white
const longTitle = "Alisha & Milind Wedding"
const shortTitle = "A&M Wedding"
const manifestStartUrl = yn(process.env.DISABLE_FULL_SITE)
  ? "/save-the-date"
  : "/"
const additionalPagesFolder = yn(process.env.DISABLE_FULL_SITE)
  ? "pages-save-the-date"
  : "pages-full-site"

module.exports = {
  siteMetadata: {
    title: longTitle,
    description: `Welcome to Alisha and Milind's wedding website! We're excited to celebrate with you.`,
    author: `@mganjoo`,
    siteUrl: `https://alishaandmilind.wedding`, // No trailing slash!
    image: `/alisha-and-milind-mirror.jpg`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/${additionalPagesFolder}`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: longTitle,
        short_name: shortTitle,
        language: `en`,
        start_url: manifestStartUrl,
        background_color: backgroundColor,
        theme_color: backgroundColor,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        display: "standalone",
        icons: [
          {
            src: `/am-square-96x96.png`,
            sizes: `96x96`,
            type: `image/png`,
          },
          {
            src: `/am-square-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/am-square-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-remove-console`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        tailwind: true,
        purgeOnly: [`src/styles/global.css`],
        // special whitelist:
        // <a> which is used indirectly by Gatsby <Link>
        whitelist: [`a`],
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-webpack-size`,
  ],
}
