import React from "react"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <BaseLayout>
    <SEO title="404 Not Found" />
    <main className="p-4 font-sans text-lg max-w-lg">
      <h1 className="text-4xl font-serif mb-2">Oops!</h1>
      <p>
        We couldn&apos;t find that page. The full website is still a work in
        progress, so stay tuned!
      </p>
      <p className="mt-4">
        <Link to="/save-the-date" className="underline font-semibold">
          Back to Save the Date
        </Link>
      </p>
    </main>
  </BaseLayout>
)
export default NotFoundPage
