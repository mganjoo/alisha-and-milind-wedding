import React, { useContext } from "react"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"

const ContactEmail: React.FC = () => {
  const data = useContext(WeddingMetadataContext)
  return data ? (
    <a href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a>
  ) : null
}
export default ContactEmail
