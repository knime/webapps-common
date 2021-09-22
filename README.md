# Knime Service for KNIME® Analytics Platform

This folder contains the frontend wrapper that implements adapter pattern between data providers (
back-end services) and data consumers (ui-nodes)

## Development
<!-- @TODO: write dev readme -->

### Prerequisites

* Install [Node.js][node], see version in [.nvmrc](.nvmrc).
* Only for test coverage uploads to SonarQube: you also need [Java]™ 8 or 11.

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

## Build production version
Bundles with rollup into commonjs module
```sh
npm run build
```

## Basic usage of KNIME Service in UI components
To use KNIME service inside UI component you have to import desired service such as ```JSONDataService```
and assign settings to initialData received via method provided by selected service.  
```javascript
...
import { JSONDataService } from '<file location>';
...
async mounted() {
    const jsonDataService = new JSONDataService(this.knimeService);
    const initialData = await jsonDataService.getInitialData();
    this.settings = initialData.settings;
}
```
