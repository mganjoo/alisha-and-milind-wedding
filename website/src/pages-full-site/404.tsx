import React from "react"
import NotFound from "../components/partials/NotFound"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <NotFound>
    <p>
      We couldn&apos;t find that page. No worries: we can continue our
      celebrations on the <Link to="/">homepage</Link>!
    </p>
  </NotFound>
)
export default NotFoundPage
