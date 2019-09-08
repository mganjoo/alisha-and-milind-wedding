module.exports = {
  siteMetadata: {
    title: `A & M Wedding`,
    description: `Welcome to Alisha Saxena and Milind Ganjoo's wedding website! We're excited to celebrate with you.`,
    author: `@mganjoo`,
  },
  plugins: [
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
        name: `Alisha & Milind Wedding`,
        short_name: `A&M Wedding`,
        language: `en`,
        start_url: `/`,
        background_color: "#fffcf7", // off-white
        theme_color: "#fffcf7", // off-white
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        display: "standalone",
        icon_options: {
          purpose: `maskable`,
        },
        icons: [
          {
            src: `/am-logo-96x96.png`,
            sizes: `96x96`,
            type: `image/png`,
          },
          {
            src: `/am-logo-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/am-logo-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
        crossOrigin: `use-credentials`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        tailwind: true,
        purgeOnly: [`src/styles/global.css`],
        // whitelist <a> which is used indirectly by Gatsby <Link>
        whitelist: [`a`],
      },
    },
  ],
}
