# Hints

This composable and its support components provide a small, reusable system for showing contextual hints / popovers.

- `setupHints` — app-level setup for the hints system.
- `useHint` — the composable to access hint functionality in components.
- `HintProvider` — Global Vue component that renders the active hint

## Usage

Below are two recommended usage patterns. NOTE: a few example function signatures in the examples are reasonable assumptions — see "Assumptions & next steps" for details and update to match the actual API if necessary.

### 1) Setup

There are two pre-requisite steps for the usage of this feature:

1. You _must_ render the `HintProvider` component somewhere in your component tree. Ideally, as close as possible to the component tree's root
2. Your application _must_ call `setupHints` at some early stage during the lifecycle of your application. This setup will initialize the internal state, as well as fetch any remote state (see config)

```html
<!-- Somewhere in your root-component.vue -->
<HintProvider />
```

Then:

```ts
import { setupHints } from "@knime/components";

setupHints({
    // available hints the application wants to show. This is static data of the hints, not what the user
    // has seen or not
    hints: {...},
});
```

By default hints are stored in localstorage only. But you can also use a remote storage if you wish. Data will still be stored in localstorage but it will be synced constantly to your remote storage. You can do it like so:

```ts
setupHints({
    hints: ...,

    getRemoteHintState: (storageKey: string) =>
        myApi.get('/hint-state'),

    setRemoteHintState: (storageKey: string, currentState) =>
       myApi.post('/hint-state', { currentState }),
});
```

### 2) Showing a hint

Assuming you have a hint called "fancy-button", which has already been supplied to the `setupHints` called under the `hints` property. Then

```html
<template>
  <button ref="fancyButton" @click="clicked = true">Hi, I'm fancy</button>
</template>

<script setup>
  import { ref, useTemplateRef, onMounted } from "vue";
  import { useHint } from "@knime/components";

  const clicked = ref(false);
  const fancyButtonRef = useTemplateRef("fancyButton");

  onMounted(() => {
    useHint().createHint({
      // this id must match one of the hints supplied to `setupHints`
      hintId: "fancy-button",
      referenceElement: fancyButtonRef,

      // some arbitrary condition
      isVisibleCondition: computed(() => clicked.value),
    });
  });
</script>
```

### One important consideration to keep in mind:

When using a ref, the element passed via `referenceElement` must exist in the DOM at the time of calling `createHint`. Otherwise, there are no guarantees that the hint's visibility will be correctly updated.

If you need this use-case then you should use a `referenceSelector` instead:

```html
<template>
  <button @click="clicked = true">Click me!!</button>
  <div id="fancy-div" v-if="clicked">At first I was afraid, I was petrified</div>
</template>

<script setup>
  import { ref, useTemplateRef, onMounted } from "vue";
  import { useHint } from "@knime/components";

  const clicked = ref(false);
  const fancyButtonRef = useTemplateRef("fancyButton");

  onMounted(() => {
    useHint().createHint({
      // this id must match one of the hints supplied to `setupHints`
      hintId: "fancy-div",
      referenceSelector: '#fancy-div',

      // some arbitrary condition
      isVisibleCondition: computed(() => clicked.value),
    });
  });
</script>
```
