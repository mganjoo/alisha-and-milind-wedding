import React from "react"
import SEO from "../components/SEO"
import BaseLayout from "../components/BaseLayout"

const NotFoundPage = () => (
  <BaseLayout>
    <SEO title="404 Not Found" />
    <main className="p-4 font-sans text-lg max-w-lg">
      <h1 className="text-4xl font-serif mb-2">Oops!</h1>
      <p>
        We couldn&apos;t find that page. The full website is still a work in
        progress, so stay tuned!
      </p>
    </main>
  </BaseLayout>
)
export default NotFoundPage
