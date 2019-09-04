# Alisha and Milind's Wedding Website

## 🛠 Getting started

1.  **Check out the repository and install dependencies.**

    ```sh
    git clone git@github.com:mganjoo/alisha-and-milind-wedding.git
    cd alisha-and-milind-wedding/
    npm install
    ```

1.  **Start developing.**

    ```sh
    npm run develop
    ```

1.  **Start editing.**

    The site will be running at _`http://localhost:8000`_, and the GraphiQL tool will be at \_`http://localhost:8000/___graphql`\_.

## Build environment variables

These options control how the Gatsby site gets generated.

- `GUARD_PAGE_ONLY`: When set to `"1"`, builds a single page ("save the date" or "coming soon")
  and deletes all other pages. This can be useful to allow development on the full website while the "public"
  website is still protected. (default: `"0"`)

## 🧪 Testing

This project has [Jest](https://jestjs.io/) configured for unit tests and [Cypress](https://www.cypress.io) for end-to-end tests.

End-to-end tests also include visual regression tests set up using [cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot).

### To run the entire test suite (unit + e2e) locally

```sh
npm run test
```

Running this command will also clean all previous visual regression diffs and test results stored in `cypress/diffs` and `cypress/results`.

### To open the Cypress app locally

```sh
npm run test:e2e:open
```

> **NOTE**: Visual regression tests in Electron produce different snapshot sizes when run from `cypress open` (and the relevant Cypress [issue](https://github.com/cypress-io/cypress/issues/2102) seems to be unresolved). For now this app hardcodes `toMatchImageSnapshot` to be a noop on a headed Electron instance.

### Updating snapshots

```sh
npm run test:e2e:screenshots:update
```

## 📗 Storybook

This project uses [Storybook](https://storybook.js.org) for development of UI components. To run a local instance of Storybook on port 6006:

```sh
npm run storybook
```

## 🔄 Continuous integration

The entire test suite is also run on CI servers, using the `test:ci` NPM script. The tests are identical; however, the failure threshold for visual regression tests is relaxed when running using this script, to allow for minor differences across machines.

## ℹ️ Status badges

[![Netlify Status](https://api.netlify.com/api/v1/badges/7b8c6a26-ba68-4d43-8588-64f155b15c47/deploy-status)](https://app.netlify.com/sites/winning-lamport-6a6661/deploys)
