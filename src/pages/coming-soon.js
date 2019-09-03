import React from "react"
import SEO from "../components/seo"
import Helmet from "react-helmet"

export default () => (
  <>
    <SEO title="Stay Tuned" />
    <Helmet>
      <body className="bg-orange-100 text-gray-900"></body>
    </Helmet>
    <main class="p-4">
      <h1 class="text-4xl font-serif mb-2">Stay Tuned</h1>
      <p class="text-lg font-sans">We'll have something for you really soon!</p>
    </main>
  </>
)
