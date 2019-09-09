import React from "react"
import SEO from "../components/seo"
import BaseLayout from "../components/BaseLayout"

export default () => (
  <BaseLayout>
    <SEO title="Stay Tuned" />
    <main class="p-4">
      <h1 class="text-4xl font-serif mb-2">Stay Tuned</h1>
      <p class="text-lg font-sans">We'll have something for you really soon!</p>
    </main>
  </BaseLayout>
)
