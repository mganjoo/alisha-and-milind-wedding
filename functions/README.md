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
