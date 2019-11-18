require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")
const sharedConstants = require("./shared-constants")

const longTitle = "Alisha & Milind Wedding"

module.exports = {
  siteMetadata: {
    title: longTitle,
    description: `Welcome to Alisha and Milind's wedding website! We're excited to celebrate with you.`,
    author: `@mganjoo`,
    siteUrl: `https://alishaandmilind.wedding`, // No trailing slash!
    image: `/alisha-and-milind-mirror.jpg`,
    contactEmail: `alisha.and.milind@gmail.com`,
    displayTitle: `Alisha & Milind`,
    displayDates: `May 1 & 2, 2020`,
    location: `San Mateo, CA`,
    // TODO: figure out if this can be shared with Cloud Functions
    events: [
      {
        shortName: "mehendi",
        name: "Mehendi",
        date: "2020-04-29T18:00:00",
        preEvent: true,
      },
      {
        shortName: "sangeet",
        name: "Sangeet",
        date: "2020-05-01T19:00:00",
        preEvent: false,
      },
      {
        shortName: "ceremony",
        name: "Ceremony",
        date: "2020-05-02T09:00:00",
        preEvent: false,
      },
      {
        shortName: "reception",
        name: "Reception",
        date: "2020-05-02T18:00:00",
        preEvent: false,
      },
    ],
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/${
          yn(process.env.DISABLE_FULL_SITE)
            ? "pages-save-the-date"
            : "pages-full-site"
        }`,
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
        short_name: `A&M Wedding`,
        language: `en`,
        start_url: yn(process.env.DISABLE_FULL_SITE) ? "/save-the-date" : "/",
        background_color: sharedConstants.offWhite,
        theme_color: sharedConstants.offWhite,
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
