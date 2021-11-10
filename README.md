# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME UI Extension Service for KNIME® Analytics Platform

This folder contains the frontend wrapper that implements adapter pattern between data providers (back-end services) and
data consumers (e.g. KNIME Views).

## Development

### Prerequisites

* Install [Node.js][node], see version in [.nvmrc](.nvmrc).

Newer versions may also work, but have not been tested.

Pull the contained [git submodules](https://stackoverflow.com/a/4438292/5134084) with
```sh
git submodule update --init
```

### Install dependencies

```sh
npm install
```

### Launch development server
To start project in a browser window for dev purposes use:
```sh
npm run dev
```

### Testing

#### Running unit tests
This project contains unit tests written with [jest]. They are run with

```sh
npm run test:unit
```

### Linting

```sh
npm run lint
```

## Build production version
Bundles with rollup into commonjs module
```sh
npm run build
```

## Basic usage in UI components
1. Add a submodule in app, where you wish to have access to KNIME service. To do so, run the command below in the root folder of the app where you want to use KNIME service.
```javascript
git submodule add https://bitbucket.org/KNIME/knime-ui-extension-service knime-ui-extension-service
```
1. Run `npm i` to install all dependencies.

2. To use the services inside a Vue-based KNIME UI component you have to import and instantiate each desired service with the
passed `knimeService` instance, e.g.
```javascript
...
import { JsonDataService } from 'knime-ui-extension-service';
...
props: {
    knimeService: {
        type: Object,
        required: true,
        default: null
    }
},
async mounted() {
    const jsonDataService = new JsonDataService(this.knimeService);
    this.initialData = await jsonDataService.getInitialData();
}
```


# Join the Community!
* [KNIME Forum](https://forum.knime.com/)


[node]: https://nodejs.org/
[Vue]: https://vuejs.org/
[Java]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[jest]: https://jestjs.io/en
