import { Router } from "@reach/router"
import React from "react"
import yn from "yn"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import CodeLoader from "../components/partials/CodeLoader"

const invitationPage = yn(process.env.GATSBY_DISABLE_FULL_SITE)
  ? "/"
  : "/invitation"

const Route: React.FC = () => {
  return (
    <BaseLayout>
      <SEO title="Welcome" image="/meta-main-hero.jpg" />
      <Router basepath="/r">
        <CodeLoader path="/" redirectTo="/" />
        <CodeLoader path="/home" redirectTo="/" />
        <CodeLoader path="/home/:code" redirectTo="/" />
        <CodeLoader path="/invitation" redirectTo={invitationPage} />
        <CodeLoader path="/invitation/:code" redirectTo={invitationPage} />
        <CodeLoader path="/:code" redirectTo="/" />
      </Router>
    </BaseLayout>
  )
}
export default Route
