# ![Image](https://www.knime.com/sites/default/files/knime_logo_github_40x40_4layers.png) @knime/hints

KNIME's hints library. Used in other consuming `@knime` packages. Based on <https://github.com/lycHub/ysx-library/>

## Demo

A demo can be found here:
<https://knime.github.io/webapps-common/?q=useHints>

## Installation

To install the `@knime/hints` package, you can use npm:

```bash
npm install @knime/hints
```

## Usage

Minimal setup to show a hint:

```javascript
import { setHintConfiguration, useHint } from "@knime/hints";

// needs to only happen once very early in the app startup (ideally before app.mount())
setHintConfiguration({
  someElementsIdThatShouldBeHinted: {
    title: "Look at this thing",
    description: "Wow this is very cool.",
    linkHref: "https://knime.com/?something",
    linkText: "Learn more",
    dependsOn: [],
    align: "end",
    side: "bottom",
  },
});

const { createHintComponent } = useHint({
  uniqueUserId: "someUserId", // used as part of the localstorage key
});

onMounted(() => {
  createHintComponent({
    hintId: "someElementsIdThatShouldBeHinted",
    checkHintVisibilityCondition: () => true,
  });
});
```

## Join the Community

- [KNIME Forum](https://forum.knime.com/)
