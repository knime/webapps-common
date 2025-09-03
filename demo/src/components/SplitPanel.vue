<script>
import { SplitPanel } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";

// import code from "webapps-common/ui/components/SplitPanel.vue?raw";
const code = "";

const codeExample = `<SplitPanel
      direction="right"
      :secondary-snap-size="100"
      use-pixel
>
  <template #default>
    Default content
  </template>
  <template #secondary>
    Secondary content
  </template>
</SplitPanel>
`;

export default {
  components: {
    SplitPanel,
    CodeExample,
  },
  computed: {
    code() {
      return code;
    },
  },
  data: function () {
    return {
      codeExample,
      secondarySize: 200,
      splitterExpanded: true,
      hideSecondaryPane: false,
    };
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            A simple 2 panel splitter component that works with pixels or
            percent, loosely based on
            <a href="https://github.com/rmp135/vue-splitter" target="_blank"
              >vue-splitter</a
            >
            (MIT license).
          </p>
          <p>
            The splitter can be configured to split horizontally or vertically,
            and the size of the secondary panel can be defined in percent or
            pixels. The size can be limited with min/max sizes, and a snap size
            can be defined so that the panel is automatically hidden when the
            size is below the snap size. Clicking on the splitter will also hide
            the secondary panel. The panel can be expanded again by clicking on
            the splitter or programmatically.
          </p>
          <p>
            The secondary panel can be positioned on any side (left, right, top,
            bottom) of the main panel.
          </p>
        </div>
      </div>
      <div class="grid-container page-content">
        <SplitPanel
          v-model:secondary-size="secondarySize"
          v-model:expanded="splitterExpanded"
          direction="right"
          :secondary-snap-size="100"
          :hide-secondary-pane="hideSecondaryPane"
          use-pixel
        >
          <template #default> Default content </template>
          <template #secondary> Secondary content </template>
        </SplitPanel>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>Secondary size: {{ secondarySize }}px</p>
          <p>Splitter expanded: {{ splitterExpanded }}</p>
          <label>
            <input v-model="hideSecondaryPane" type="checkbox" />
            Hide Secondary Pane
          </label>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SplitPanel.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.page-content {
  outline: 2px dotted purple;
  height: 500px;
  width: 500px;

  & .license-content {
    width: 100%;

    & :deep(section:last-child) {
      background: var(--knime-porcelain);
    }
  }
}
</style>
