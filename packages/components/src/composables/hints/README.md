# hints

The useHint composeable and corresponding components live in this foder.

## Demo

A demo can be found here:
<https://knime.github.io/webapps-common/?tab=hints>

## Usage

Minimal setup to show a hint:

```vue
<script>
import { useHint } from "@knime/hints";

const hintConfiguration = {
  someElementsIdThatShouldBeHinted: {
    title: "Look at this thing",
    description: "Wow this is very cool.",
    linkHref: "https://knime.com/?something",
    linkText: "Learn more",
    dependsOn: [],
    align: "end",
    side: "bottom",
  },
};

// if you don't want to provide the config all the time create a repo local composable that binds that for you
const { createHintComponent } = useHint({
  hints: hintConfiguration,
  // more options see types
});

onMounted(() => {
  createHintComponent({
    hintId: "someElementsIdThatShouldBeHinted",
  });
});

// If you want to use a ref instead of the ID or selector base reference element you can do that:
const myElement = ref();
createHintComponent({ hintId: "someID", referenceElement: myElement });
</script>

<template>
  <!-- Put this once somewhere in your app, ideally very top level -->
  <HintProvider />
  <div ref="myElement">Something</div>
</template>
;
```
