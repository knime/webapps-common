# ![Image](https://www.knime.com/files/knime_logo_github_40x40_4layers.png) KNIME UI Extension Service for KNIME® Analytics Platform

This folder contains the frontend wrapper that implements adapter pattern between data providers (back-end services) and
data consumers (e.g. KNIME Views).


## Usage in UI components

1. Run `npm i @knime/ui-extension-service` to install dependency.
2. Instantiate and use desired services as shown below

### Usage in an IFrame-based KNIME UI component (recommended)

```javascript
import { IFrameKnimeService, JsonDataService } from '@knime/ui-extension-service';
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
import { JsonDataService } from '@knime/ui-extension-service';
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

## Usage in custom visualizations
Custom UI component implementations can also use this package to interface with the KNIME® Analytics Platform.

To access this functionality within a component, simply add the provided IIFE build output as `<script>` content in
the HTML scope. This output is found in the `dist/knime-ui-extension-service.min.js` bundle and will automatically
execute the JavaScript necessary to provide access to the API.

*Note: In all cases, it's important to load the IIFE
content into the HTML document **before** the UI component implementation so the API is loaded and available in the
custom context.*

There are two options to use included in the `dist` folder (use only one at a time):

- `knime-ui-extension-service.min.js` a minified production build of the package
- `knime-ui-extension-service.dev.js` a documented package build intended for development/debugging

There are a number of ways to include this bundle in a component implementation:

### Document `<head>`
The simplest method is to copy the content directly into
the HTML document `<head>` as `<script>` tag content:

```html
<!DOCTYPE html>
...
<head>
    ...
    <script type="text/javascript">
        // Copy contents here
    </script>
    ...
</head>
...
```

### Local/Remote File System
If the component is being served by a filesystem or server, the path to the `min.js` file can also be included
as the src of the `<script>` tag in the `<head>` of the document:
```html
<!DOCTYPE html>
...
<head>
    ...
    // NOTE: Update the path to the correct resource location for your filesystem or server.
    <script src="./dist/knime-ui-extension-service.min.js"></script>
    ...
</head>
...
```


### Accessing the Package
Once loaded, the package will be available in the global scope of the view under the namespace
`window.KnimeUIExtensionService`; which includes the classes, functionality and types of this package. To include the
JSDoc comments in the document, adjust the IIFE file content (described in the above sections) to use the `.dev.js`
build file instead of the `.min.js` file.

## Development

### Prerequisites

* Install [Node.js][node], see version in [package.json](package.json).

Newer versions may also work, but have not been tested.

### Install dependencies

```sh
npm install
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
Bundles with rollup into esmodule format and an IIFE bundle.
```sh
npm run build
```

# Join the Community!
* [KNIME Forum](https://forum.knime.com/)


[node]: https://nodejs.org/
[Vue]: https://vuejs.org/
[jest]: https://jestjs.io/en