import React from "react"
import SEO from "../components/SEO"
import BaseLayout from "../components/BaseLayout"

const IndexPage = () => (
  <BaseLayout>
    <SEO title="Coming Soon" />
    <main className="p-4 font-sans text-lg max-w-lg">
      <h1 className="text-4xl font-serif mb-2">Coming Soon</h1>
      <p>Stay tuned for our wedding website!</p>
    </main>
  </BaseLayout>
)
export default IndexPage
