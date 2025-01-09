<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";

defineProps<VueLayoutProps>();
</script>

<template>
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
</template>
