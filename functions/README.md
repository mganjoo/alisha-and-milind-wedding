# Firebase Cloud Functions

This package includes Cloud Funtions for deploying to Firebase, as well as tests for those functions and Firestore security rules.

## Running tests

1. **Ensure `firebase-cli` is installed and configured.**

```sh
# On Mac
brew install firebase-cli

# Configure credentials
firebase login
```

2. **Run tests.**

Start the emulator:

```sh
npm run firestore
```

Run tests continuously (in watch mode):

```sh
npm run test:watch
```

or one-time:

```sh
npm run test
```

You can also run the emulator and tests in one command:

```
firebase emulators:exec --only firestore "npm run test"
```

## Deploying rules and functions

```sh
# To staging
firebase deploy

# To production
firebase -P production deploy
```

## Other one-time setup

### Configure Google API client ID and secret

Configure the Client ID and Client secret (available from https://console.cloud.google.com/apis/credentials)
for initializing the OAuth client for Sheets access. Also configure a `project_id` key corresponding to
the Firebase Project ID, so an OAuth callback URL can be constructed.

```sh
# This command references the "production" project, but authenticate on all of them
firebase -P production functions:config:set googleapi.client_id="YOUR_CLIENT_ID" googleapi.client_secret="YOUR_CLIENT_SECRET" googleapi.project_id="FIREBASE_PROJECT_ID"
```

Full instructions for authorization are derived from https://github.com/firebase/functions-samples/tree/master/google-sheet-sync#deploy-and-test.

### Configure Mailchimp API credentials

Configure the Mailchimp API credentials, and IDs for the Mailchimp audience and tags related to the wedding.

```sh
firebase -P production functions:config:set mailchimp.api_key="API_KEY" mailchimp.list_id="LIST_ID" mailchimp.tag_id.attending="TAG_ID_FOR_ATTENDING" mailchimp.tag_id.not_attending="TAG_ID_FOR_NOT_ATTENDING"
```

### Configure Google Sheet for output

Configure the spreadsheet ID (from `https://docs.google.com/spreadsheets/d/<spreadsheet_id>/edit`) and range of cells that the RSVP function should update (specified as a range reference, e.g. `SheetName!A:Q`).

```sh
firebase -P production functions:config:set rsvps.table_range="TABLE_RANGE" rsvps.spreadsheet_id="SPREADSHEET_ID"
```

### Specify whether project is a production project

The project is configured to work with both production and staging environments. Some Cloud functions, however, are only meant to be used in a production environment, so set a config key indicating whether the Firebasse project in question is a production project (the default is false).

```sh
firebase -P production functions:config:set project.is_prod="1"
```
