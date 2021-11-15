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

const otherPagePlugin = [
  {
    resolve: `gatsby-plugin-page-creator`,
    options: {
      path: yn(process.env.GATSBY_DISABLE_FULL_SITE)
        ? `${__dirname}/src/pages-guard`
        : `${__dirname}/src/pages-full`,
    },
  },
]

module.exports = {
  siteMetadata: {
    title: longTitle,
    description: `Welcome to our wedding website! We're excited to celebrate with you.`,
    author: `@mganjoo`,
    siteUrl: `https://alishaandmilind.wedding`, // No trailing slash!
    contactEmail: `alisha.and.milind@gmail.com`,
    displayTitle: `Alisha & Milind`,
    displayDates: `October 30 & 31, 2020`,
    rsvpDeadline: `2020-09-15`,
    bookingDeadline: `2020-10-09`,
    location: `San Mateo, CA`,
    mainVenue: [
      "San Mateo Marriott San Francisco Airport",
      "1770 S Amphlett Blvd",
      "San Mateo, CA 94402",
    ],
    mainVenueUrl: "https://goo.gl/maps/2PnhXrqWcrBB2snc8",
  },
  plugins: [
    `gatsby-plugin-typescript`,
    ...demoPagePlugin,
    ...otherPagePlugin,
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
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/r/*`] },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: longTitle,
        short_name: `A&M Wedding`,
        start_url: "/",
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
    `gatsby-plugin-netlify`,
    `gatsby-plugin-offline`,
  ],
}
