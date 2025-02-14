<script setup lang="ts">
import { ref } from "vue";
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";

defineProps<VueLayoutProps>();

const hover = ref(false);
</script>

<template>
  <div class="section" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="section-header">
      <h3>
        {{ layout.uischema.label }}
        <slot name="buttons" :hover="hover" />
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
</template>

<style lang="postcss" scoped>
.section {
  &:not(:first-child) {
    padding-top: var(--space-16);
  }

  & .section-header {
    position: sticky;
    top: 0;
    background-color: var(--knime-gray-ultra-light);
    z-index: 1;
    margin: 0 calc(-1 * var(--horizontal-dialog-padding));

    & h3 {
      margin: 0 var(--horizontal-dialog-padding);
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
