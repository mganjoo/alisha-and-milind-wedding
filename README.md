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
    npm install && npm run bootstrap
    ```

1.  **Add Firebase credentials.**

    Go to Firebase Console > Project Settings and scroll down to find the
    section listing key app credentials. Create files `.env.development` and
    `.env.production` (they will be ignored by Git) in the `website/` directory of
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
    cd website
    npm run develop
    ```

1.  **Start editing.**

    The site will be running at `http://localhost:8000`, and the GraphiQL
    tool will be at `http://localhost:8000/___graphql`.

## ⚙️ Netlify configuration environment variables

These options control how the Gatsby site gets generated. These options
should only be set on Netlify in staging and production environments,
never in CI or test environments.

- `DISABLE_FULL_SITE`: When set to `"1"`, builds only the Save the Date page (instead of the full site).
- `GATSBY_USE_PROD_FIREBASE`: When set to `"1"`, uses the environment variables
  `GATSBY_PROD_FIREBASE_*` to configure Firebase instead of the `GATSBY_FIREBASE_*` variables
  listed in [Getting Started](#getting-started).
  **This enables writes to the production Firebase instance.**

## 🧪 Testing

This project has [Jest](https://jestjs.io/) configured for unit tests and
[Cypress](https://www.cypress.io) for end-to-end tests.

End-to-end tests also include visual regression tests set up using
[Percy](https://percy.io).

### To run the entire test suite (unit + e2e) locally

```sh
npm run test
```

### To open the Cypress app locally

```sh
npm run test:e2e:open
```

## 🔄 Continuous integration

The entire test suite is also run on CI servers, using the `test:ci` NPM
script.
