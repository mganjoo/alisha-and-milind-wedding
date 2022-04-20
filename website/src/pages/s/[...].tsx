import { Router } from "@gatsbyjs/reach-router"
import React from "react"
import BaseLayout from "../../components/layout/BaseLayout"
import SEO from "../../components/meta/SEO"
import CodeLoader from "../../components/partials/CodeLoader"

const Route: React.FC = () => {
  return (
    <BaseLayout>
      <SEO title="Welcome" image="/meta-main-hero.jpg" />
      <Router basepath="/s">
        <CodeLoader path="/" redirectTo="/" />
        <CodeLoader path="/home/:code" redirectTo="/" />
        <CodeLoader path="/invitation/:code" redirectTo="/invitation" />
        <CodeLoader path="/faq/:code" redirectTo="/faq" />
        <CodeLoader path="/schedule/:code" redirectTo="/schedule" />
        <CodeLoader path="/rsvp/:code" redirectTo="/rsvp" />
        <CodeLoader path="/travel/:code" redirectTo="/travel" />
        <CodeLoader path="/registry/:code" redirectTo="/registry" />
        <CodeLoader path="/:code" redirectTo="/" />
      </Router>
    </BaseLayout>
  )
}
export default Route
