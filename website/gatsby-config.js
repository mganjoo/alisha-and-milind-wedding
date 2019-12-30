require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")
const sharedConstants = require("./shared-constants")

const longTitle = "Alisha & Milind Wedding"

const googleAnalyticsPlugin = process.env.GA_TRACKING_ID
  ? [
      {
        resolve: `gatsby-plugin-google-gtag`,
        options: {
          trackingIds: [process.env.GA_TRACKING_ID],
          gtagConfig: {
            anonymize_ip: true,
            allow_ad_personalization_signals: false,
            custom_map: { dimension1: "branch" },
          },
        },
      },
    ]
  : []

const demoPagePlugin = yn(process.env.DISABLE_DEMO_PAGES)
  ? []
  : [
      {
        resolve: `gatsby-plugin-page-creator`,
        options: {
          path: `${__dirname}/src/pages-demo`,
        },
      },
    ]

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
    rsvpDeadline: `2020-03-15`,
    bookingDeadline: `2020-04-15`,
    location: `San Mateo, CA`,
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
    ...demoPagePlugin,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `events`,
        path: `${__dirname}/src/events`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-remark-plaintext`,
    `gatsby-remark-source-name`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-css-modules`,
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
    ...googleAnalyticsPlugin,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        tailwind: true,
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
