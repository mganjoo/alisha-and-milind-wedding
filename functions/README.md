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
for initializing the OAuth client for Sheets access.

```sh
firebase functions:config:set googleapi.client_id="YOUR_CLIENT_ID" googleapi.client_secret="YOUR_CLIENT_SECRET"
```

Full instructions for authorization are derived from https://github.com/firebase/functions-samples/tree/master/google-sheet-sync#deploy-and-test.
