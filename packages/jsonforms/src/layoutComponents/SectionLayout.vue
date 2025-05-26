<script setup lang="ts">
import { ref } from "vue";
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";
import SectionHeading from "./section/SectionHeading.vue";

defineProps<VueLayoutProps>();

const hover = ref(false);
</script>

<template>
  <div class="section" @mouseover="hover = true" @mouseleave="hover = false">
    <SectionHeading :title-text="layout.uischema.label">
      <template #right-buttons>
        <slot name="buttons" :hover="hover" />
      </template>
    </SectionHeading>
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
}
</style>
