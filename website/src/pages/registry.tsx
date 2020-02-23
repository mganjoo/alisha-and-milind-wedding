import React, { useEffect } from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import ExternalLink from "../components/ui/ExternalLink"
import Loading from "../components/ui/Loading"
import PageHeading from "../components/ui/PageHeading"

const RegistryPage = () => {
  useEffect(() => {
    let script = document.createElement("script")
    script.src = "https://widget.zola.com/js/widget.js"
    script.id = "zola-wjs"
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.parentNode && script.parentNode.removeChild(script)
    }
  }, [])
  return (
    <NavLayout>
      <SEO
        title="Registry"
        image="/meta-faq-hero.jpg"
        description="Information about our wedding registry."
      />
      <PageHeading>Registry</PageHeading>
      <div
        className="text-center zola-registry-embed"
        data-registry-key="alishaandmilind"
      >
        <div className="mb-4">
          <Loading />
        </div>
        <ExternalLink
          className="c-button c-button-primary c-button-comfortable shadow-md"
          href="https://www.zola.com/registry/alishaandmilind"
        >
          Visit our wedding registry on Zola
        </ExternalLink>
      </div>
    </NavLayout>
  )
}
export default RegistryPage
