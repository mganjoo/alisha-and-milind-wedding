import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import path from "path"
import fs from "fs-extra"
import { cli } from "cli-ux"

interface GoogleCredentials {
  installed: {
    client_id: string
    project_id: string
    client_secret: string
    redirect_uris: string[]
  }
}

// If modifying these scopes, delete token.json in the config dir.
const GoogleScopes = ["https://www.googleapis.com/auth/spreadsheets"]
const TokenFilename = "token.json"

async function getNewToken(
  oAuth2Client: OAuth2Client,
  scopes: string[],
  tokenPath?: string
) {
  const authUrl = oAuth2Client.generateAuthUrl({
    // prettier-ignore
    "access_type": "offline",
    scope: scopes,
  })
  cli.url("Authorize Google Sheets", authUrl)
  const code = await cli.prompt("Enter the code from that page here")
  const response = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(response.tokens)
  if (tokenPath) {
    await fs.writeJSON(tokenPath, response.tokens)
  }
  return oAuth2Client
}

export async function getAuthClient(
  credentialsPath: string,
  tokenBasePath?: string
) {
  const credentials = (await fs.readJSON(credentialsPath)) as GoogleCredentials
  const oAuth2Client = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  )

  const tokenPath = tokenBasePath ? path.join(tokenBasePath, TokenFilename) : ""
  try {
    const credentials = await fs.readJSON(tokenPath)
    oAuth2Client.setCredentials(credentials)
    return oAuth2Client
  } catch {
    return getNewToken(oAuth2Client, GoogleScopes, tokenPath)
  }
}
