# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) KNIME JSONForms integration

This repository contains the frontend components of the KNIME JSONForms integration that is based on [Vue].
It is built as a [Vue library] and used in KNIME Analytics Platform and/or KNIME Hub.

## Installation

To install the `@knime/jsonforms` package, you can use npm:

```bash
npm install @knime/jsonforms
```

## Usage

The vue component controlling the JSONForms instance can be imported as follows:

```javascript
import { JsonFormsDialog } from "@knime/jsonforms";
```

It requires renderers as property, which can be constructed using a variety of defaults.

Those default components are divided into layouts and controls:

```javascript
import { controls, layouts } from "@jsonforms/testing";
```

Use the `toRenderers` method to construct the final list of renderers once the chosen controls/layouts are modified in the desired way. A modification might entail replacing the tester by which this renderer is used by jsonforms or wrapping a control using higher order vue components.

Combined example:

```vue
<script setup lang="ts">
import {
  controls,
  layouts,
  JsonFormsDialog
  toRenderers
} from "@knime/jsonforms"


const renderers = toRenderers([/**
  Add newly constructed renderers here
*/], [
  controls.dropdownRenderer,
  controls.textRenderer
], [
  layouts.sectionRenderer
])
</script>
<template>
  <JsonFormsDialog :data="..." ... :renderers="renderers" />
</template>
```

### Testing

Types and utility methods for testing are made available in the following way:

```javascript
import * from "@knime/jsonforms/testing"
```

## Development

### Prerequisites

- Install [Node.js][node], see version in [package.json](package.json).

Newer versions may also work, but have not been tested.

### Install dependencies

```sh
pnpm install
```

and then use the following commands. For detailed explanations see [Vue CLI docs]:

## Testing

Run unit- and integration-tests individually by

```sh
pnpm test:unit
pnpm test:integration
```

You can generate a coverage report with

```sh
pnpm coverage:unit
pnpm coverage:integration
```

The output can be found in the `coverage` folder. It contains a browseable html report as well as raw coverage data in
[LCOV] and [Clover] format, which can be used in analysis software (SonarQube, Jenkins, …).

### Running security audit

npm provides a check against known security issues of used dependencies. Run it by calling

```sh
pnpm audit
```

## Building

To build the package, use the following command:

```sh
pnpm build
```

# Join the Community!

- [KNIME Forum](https://forum.knime.com/)

[Vue]: https://vuejs.org/
[node]: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation
[Vue CLI docs]: https://cli.vuejs.org/guide/
[Vue library]: https://cli.vuejs.org/guide/build-targets.html#library
[LCOV]: https://github.com/linux-test-project/lcov
[Clover]: http://openclover.org/
