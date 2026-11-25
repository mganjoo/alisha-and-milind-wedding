import { createContext } from "react"
import { metadata, type WeddingMetadata } from "../lib/metadata"

/** Defaults to the static metadata, so no provider is required. */
export const WeddingMetadataContext = createContext<
  WeddingMetadata | undefined
>(metadata)
