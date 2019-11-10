# Firestore security rules tests

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
firebase emulators:start --only firestore
```

Run tests:

```sh
npm run test
```

You can also run the emulator and tests in one command:

```
firebase emulators:exec --only firestore "npm run test"
```

## Deploying rules

```sh
# To staging
firebase deploy

# To production
firebase -P production deploy
```
