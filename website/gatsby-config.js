require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
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

const demoPagePlugin =
  process.env.DISABLE_DEMO_PAGES === "1"
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
      path:
        process.env.GATSBY_DISABLE_FULL_SITE === "1"
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
    weddingDate: `2022-01-22`,
    bookingDeadline: `2021-12-21`,
    rsvpDeadline: `2021-12-31`,
    rsvpChangeDeadline: `2022-01-15`,
    location: `Las Vegas, NV`,
    mainVenue: [
      "JW Marriott Las Vegas Resort & Spa",
      "221 N Rampart Blvd",
      "Las Vegas, NV 89145",
    ],
    mainVenueUrl: "https://goo.gl/maps/JYLyQWqnpuAWtK7x6",
    preEventsVenue: ["123 Example Ave", "Las Vegas, NV 89145"],
    preEventsVenueUrl: "https://goo.gl/maps/JYLyQWqnpuAWtK7x6",
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
