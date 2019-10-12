import React from "react"
import SEO from "../components/meta/SEO"
import BaseLayout from "../components/layout/BaseLayout"
import { Link } from "gatsby"

const IndexPage = () => (
  <BaseLayout>
    <SEO title="Coming Soon" />
    <main className="p-4 font-sans text-lg max-w-lg">
      <h1 className="text-4xl font-serif mb-2">Coming Soon</h1>
      <p>
        Stay tuned for our wedding website. Meanwhile, please{" "}
        <Link to="/save-the-date" className="underline font-semibold">
          save the date
        </Link>{" "}
        for the big weekend!
      </p>
    </main>
  </BaseLayout>
)
export default IndexPage
