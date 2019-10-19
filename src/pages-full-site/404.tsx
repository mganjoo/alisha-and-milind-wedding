import React from "react"
import NotFound from "../components/partials/NotFound"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <NotFound>
    <p>
      We couldn&apos;t find that page. Come celebrate with us on the{" "}
      <Link to="/">homepage</Link>!
    </p>
  </NotFound>
)
export default NotFoundPage
