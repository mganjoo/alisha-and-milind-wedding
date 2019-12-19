import React from "react"
import { Link } from "gatsby"
import NotFound from "../components/partials/NotFound"

const IndexPage = () => (
  <NotFound>
    <p>
      Our full website is not ready yet. Meanwhile, please{" "}
      <Link to="/save-the-date">save the date</Link> for the big weekend!
    </p>
  </NotFound>
)
export default IndexPage
