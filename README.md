# Exchange Widget

This project uses an ejected version for CRA, as well it uses [Chakra UI](https://chakra-ui.com/) as a component library. It is a good idea to use Chakra for this application, because it allows to build accessible apps fast. A small summary of the folder structure:

- config: contains CRA specific config after being ejected

- cypress/integration: contains the E2E tests

- public: contains files that should be public

- scripts: contains the CRA scripts to work after being ejected

- src/api: contains functions that mock an API

- src/components: contains shared components

- src/config: contains configuration such as constants and the currencies

- src/mocks: contains mocks to use in unit tests

- src/pages: contains the pages, for this case only Home and ExchangeCurrency

- src/types: contains shared types

- src/utils: contains utils such as number formatting

With more time I would probably spend more time improving the structure of the pages, so that it is clearer what is shared.

## Getting started

Install dependencies using:

```bash
yarn install
```

## Running the project

You can run the project using

```bash
yarn tart
```

This will try to automatically open your browser,
but if it does not work just open [http://localhost:3000](http://localhost:3000) to view it in the browser.
It will automatically refresh if you make any changes

## Testing

### Unit tests

To run unit tests you just need to run:

```bash
yarn test
```

This will launch the test runner in interactive mode.

### E2E tests

First, make sure the application is running in [http://localhost:3000](http://localhost:3000). Then, open cypress with:

```bash
yarn cypress:open
```

You can run any tests from there.

## Building

```bash
yarn build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
