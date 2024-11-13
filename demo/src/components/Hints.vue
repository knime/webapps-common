<script setup lang="ts">
import { onMounted, ref } from "vue";

import { type HintConfiguration, setupHints, useHint } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

const hints: Record<string, HintConfiguration> = {
  showHintHere: {
    title: "Look at this thing",
    description: "Isn't it awesome?",
    dependsOn: [],
    side: "right",
  },
  "also-nice": {
    title: "Seems to be also nice",
    description: "Well well what do we have here?",
    dependsOn: ["showHintHere"],
  },
};

setupHints({ hints });
const { createHint } = useHint();

const referenceElement = ref<HTMLElement>();

onMounted(() => {
  createHint({
    hintId: "showHintHere",
    referenceElement,
  });

  createHint({
    hintId: "also-nice",
  });
});

const resetLocalStorage = () => {
  window.localStorage.removeItem("onboarding.hints.user");
};

const codeExample = `
<script setup lang="ts">
import { type HintConfiguration, useHint } from "@knime/components";

const hints: Record<string, HintConfiguration> = {
  showHintHere: {
    title: "Look at this thing",
    description: "Isn't it awesome?",
    dependsOn: [],
    side: "right",
  },
};

setupHints({ hints });
const { createHint } = useHint();

// this is just one way of providing the reference, the default is the id of the hint in this case showHintHere
const referenceElement = ref<HTMLElement>();

onMounted(() => {
  createHint({
    hintId: "showHintHere",
    referenceElement,
  });
});
<script>
<template>
  <HintProvider />
  <div ref="referenceElement">Text</div>
</template>

`;
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          The <code>useHint</code> composable helps you easily display product
          hints. The completed hints are saved in local storage and that state
          can be synced with a remote backend optionally. Hints are closed on
          click outside of the hint. If you don't see the hint just
          <a href="#" @click="resetLocalStorage">reset localStorage</a> and
          switch tabs or reload.
        </p>

        To use hints in your project:
        <ol>
          <li>
            Import and instantiate the <code>HintProvider</code> class in the
            setup section of the root component of your project (e.g. App.vue).
            The class instance will display the toasts.
          </li>
          <li>
            Call <code>setupHints</code> and provide the hints as well as other
            configuration.
          </li>
          <li>
            Create hints with the <code>createHint</code> function that is
            returned by <code>useHint</code>.
          </li>
        </ol>

        <p class="reference">
          <span ref="referenceElement"
            >This is some content we get a hint to.</span
          >
          <span id="also-nice">This is also content.</span>
        </p>

        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
p {
  margin: 0 0 15px;
}

.examples {
  max-width: 250px;
}

#also-nice {
  margin-left: 15px;
}

.reference {
  display: flex;
  margin: 3em 0;

  & span {
    background-color: var(--knime-porcelain);
    padding: 10px;
  }
}

.toggle {
  padding: 10px 0;
}
</style>
