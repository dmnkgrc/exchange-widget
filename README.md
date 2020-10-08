# Exchange Widget

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
