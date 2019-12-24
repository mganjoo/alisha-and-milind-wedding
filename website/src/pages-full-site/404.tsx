import { Link } from "gatsby"
import React from "react"
import NotFound from "../components/partials/NotFound"

const NotFoundPage = () => (
  <NotFound>
    <p>
      We couldn&rsquo;t find that page. No worries: we can continue our
      celebrations on the <Link to="/">homepage</Link>!
    </p>
  </NotFound>
)
export default NotFoundPage
