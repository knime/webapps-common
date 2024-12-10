<script setup>
import { ref } from "vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
} from "@jsonforms/vue";

import DescriptionPopover from "../uiComponents/description/DescriptionPopover.vue";

import LayoutComponentWrapper from "./LayoutComponentWrapper.vue";
import VerticalLayoutBase from "./VerticalLayoutBase.vue";

const props = defineProps(rendererProps());
const { layout } = useJsonFormsLayout(props);

const hover = ref(false);
</script>

<template>
  <LayoutComponentWrapper :layout="layout" class="layout-component-wrapper">
    <div class="section" @mouseover="hover = true" @mouseleave="hover = false">
      <div class="section-header">
        <h3>
          {{ layout.uischema.label }}
          <DescriptionPopover
            v-if="layout.uischema.description"
            :html="layout.uischema.description"
            :hover="hover"
          />
        </h3>
      </div>
      <VerticalLayoutBase
        #default="{ element, index }"
        :elements="layout.uischema.elements"
      >
        <DispatchRenderer
          :key="`${layout.path}-${index}`"
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </VerticalLayoutBase>
    </div>
  </LayoutComponentWrapper>
</template>

<style lang="postcss" scoped>
.layout-component-wrapper {
  &:not(:first-child) {
    padding-top: var(--space-32);
  }
}

.section {
  & .section-header {
    position: sticky;
    top: 0;
    background-color: var(--knime-gray-ultra-light);
    z-index: 1;
    margin: 0 calc(-1 * var(--horizontal-dialog-padding));

    & h3 {
      margin: 0 var(--horizontal-dialog-padding) 9px;
      border-bottom: 1px solid var(--knime-silver-sand);
      color: var(--knime-masala);
      font-size: 16px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
