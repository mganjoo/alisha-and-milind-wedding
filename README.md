# Alisha and Milind's Wedding Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/7b8c6a26-ba68-4d43-8588-64f155b15c47/deploy-status)](https://app.netlify.com/sites/winning-lamport-6a6661/deploys)
![GitHub Build and test Status](https://github.com/mganjoo/alisha-and-milind-wedding/workflows/Build%20and%20test/badge.svg)
![GitHub External test Status](https://github.com/mganjoo/alisha-and-milind-wedding/workflows/External%20test/badge.svg)
[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/Milind-Ganjoo/alisha-and-milind-wedding)

## 🛠 Getting started

1.  **Check out the repository and install dependencies.**

    ```sh
    git clone git@github.com:mganjoo/alisha-and-milind-wedding.git
    cd alisha-and-milind-wedding/
    npm install
    ```

1.  **Add Firebase credentials.**

    Go to Firebase Console > Project Settings and scroll down to find the
    section listing key app credentials. Create files `.env.development` and
    `.env.production` (they will be ignored by Git) in the root directory of
    the project, with the following contents:

    ```sh
    GATSBY_FIREBASE_API_KEY="<apiKey from Firebase>"
    GATSBY_FIREBASE_AUTH_DOMAIN="<authDomain from Firebase>"
    GATSBY_FIREBASE_PROJECT_ID="<projectId from Firebase>"
    ```

    **Note**: you might also want to add configuration variables for the build
    and test stage of the project. See
    [Configuration environment variables](#configuration-environment-variables)
    for available options.

1.  **Start developing.**

    ```sh
    npm run develop
    ```

1.  **Start editing.**

    The site will be running at `http://localhost:8000`, and the GraphiQL
    tool will be at `http://localhost:8000/___graphql`.

## ⚙️ Configuration environment variables

These options control how the Gatsby site gets generated. Usually, they also
affect what tests are run.

- `ENABLE_FULL_SITE`: When set to `"1"`, builds the entirety of the website
  (not just the Save the Date page). [**must be set in both build and test**; default: `"0"`]
- `GATSBY_USE_PROD_FIREBASE`: When set to `"1"`, uses the environment variables
  `GATSBY_PROD_FIREBASE_*` to configure Firebase instead of `GATSBY_FIREBASE_*`.
  This enables writes to the production Firebase instance. This should almost
  never be set in a local development environment or in CI.

For options that are usable in the test environment, you can set them in
[`cypress.env.json`](https://docs.cypress.io/guides/guides/environment-variables.html#Option-2-cypress-env-json)
or via `CYPRESS_*` environment variables.

## 🧪 Testing

This project has [Jest](https://jestjs.io/) configured for unit tests and
[Cypress](https://www.cypress.io) for end-to-end tests.

End-to-end tests also include visual regression tests set up using
[cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot).

### To run the entire test suite (unit + e2e) locally

```sh
npm run test
```

Running this command will also clean all previous visual regression diffs and
test results stored in `cypress/diffs` and `cypress/results`.

### To open the Cypress app locally

```sh
npm run test:e2e:open
```

> **NOTE**: Visual regression tests in Electron produce different snapshot sizes
> when run from `cypress open` (and the relevant Cypress
> [issue](https://github.com/cypress-io/cypress/issues/2102) seems to be
> unresolved). For now this app hardcodes `toMatchImageSnapshot` to be a noop
> on a headed Electron instance.

### Updating snapshots

```sh
npm run test:e2e:screenshots:update
```

## 📗 Storybook

This project uses [Storybook](https://storybook.js.org) for development of UI
components. To run a local instance of Storybook on port 6006:

```sh
npm run storybook
```

## 🔄 Continuous integration

The entire test suite is also run on CI servers, using the `test:ci` NPM
script. The tests are identical; however, the failure threshold for visual
regression tests is relaxed when running using this script, to allow for
minor differences across machines.
