<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

defineProps<VueLayoutProps>();
</script>

<template>
  <div class="horizontal">
    <div
      v-for="(element, index) in layout.uischema.elements"
      :key="`${layout.path}-${index}`"
      class="horizontal-element"
    >
      <div>
        <DispatchRenderer
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.horizontal {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  gap: 5px;
}

.horizontal-element {
  flex: 1;
  width: 0;
}
</style>
