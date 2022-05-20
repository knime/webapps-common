# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME UI Extension Service for KNIME® Analytics Platform

This folder contains the frontend wrapper that implements adapter pattern between data providers (back-end services) and
data consumers (e.g. KNIME Views).

## Development

### Prerequisites

* Install [Node.js][node], see version in [package.json](package.json).

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


### Security audit

npm provides a check against known security issues of used dependencies. Run it by calling
```sh
npm run audit
```

## Build production version
Bundles with rollup into esmodule format.
```sh
npm run build
```

## Basic usage in UI components
1. Add a submodule in app, where you wish to have access to KNIME service. To do so, run the command below in the root folder of the app where you want to use KNIME service.
```javascript
git submodule add https://bitbucket.org/KNIME/knime-ui-extension-service knime-ui-extension-service
```
1. Run `npm i` to install dependencies.
2. Instantiate and use desired services as shown below

### Usage in an IFrame-based KNIME UI component
```javascript
import { IFrameKnimeService, JsonDataService } from 'knime-ui-extension-service';
this.knimeService = new IFrameKnimeService();
await this.knimeService.waitForInitialization();
this.knimeJsonDataService = new JsonDataService(this.knimeService);
this.initialData = await this.knimeJsonDataService.initialData();
```

### Usage in a Vue-based KNIME UI component
In this case, the `getKnimeService` method is already provided by the parent application and just needs to be called.
*Note*: to make the view compatible with re-execution in Data Apps, use a computed property to access the `knimeService` e.g.
```javascript
...
import { JsonDataService } from 'knime-ui-extension-service';
...
inject: ['getKnimeService'],
...
computed: {
    knimeService() {
        return this.getKnimeService();
    }
}
...
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