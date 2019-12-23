import { Link } from "gatsby"
import React from "react"
import NotFound from "../components/partials/NotFound"

const NotFoundPage = () => (
  <NotFound>
    <p>
      We couldn&apos;t find that page. The full website is still a work in
      progress, so stay tuned!
    </p>
    <p>
      Meanwhile, please <Link to="/save-the-date">save the date</Link> for the
      big weekend!
    </p>
  </NotFound>
)
export default NotFoundPage
