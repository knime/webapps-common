<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

defineProps<VueLayoutProps>();
</script>

<template>
  <div class="horizontal">
    <DispatchRenderer
      v-for="(element, index) in layout.uischema.elements"
      :key="index"
      class="horizontal-element"
      :schema="layout.schema"
      :uischema="element"
      :path="layout.path"
      :enabled="layout.enabled"
      :renderers="layout.renderers"
      :cells="layout.cells"
    />
  </div>
</template>

<style scoped>
.horizontal {
  display: inline-flex;
  gap: 5px;
  justify-content: space-between;
  width: 100%;
}

.horizontal-element {
  flex: 1;
  width: 0;
}
</style>
