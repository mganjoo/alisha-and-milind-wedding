import React from "react"
import SEO from "../components/SEO"
import BaseLayout from "../components/BaseLayout"

const NotFoundPage = () => (
  <BaseLayout>
    <SEO title="Not Found" />
    <main class="p-4">
      <h1 class="text-4xl font-serif mb-2">Oops!</h1>
      <p class="text-lg font-sans">
        We couldn&apos;t find that page. The full website is still a
        work in progress, so stay tuned!
      </p>
    </main>
  </BaseLayout>
)
export default NotFoundPage
