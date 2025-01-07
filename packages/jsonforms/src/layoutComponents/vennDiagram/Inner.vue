<script setup lang="ts">
import type { ControlElement } from "@jsonforms/core";
import { rendererProps } from "@jsonforms/vue";

import Part from "./Part.vue";

const props = defineProps(rendererProps<ControlElement>());
</script>

<template>
  <Part
    v-bind="props"
    shape="path"
    d="M47.2186 51.6276L47.5469 51.9134L47.8752 51.6276C53.7717 46.495 57.5 38.9326 57.5 30.5C57.5 22.0674 53.7717 14.505 47.8752 9.37237L47.5469 9.08662L47.2186 9.37237C41.3221 14.505 37.5938 22.0674 37.5938 30.5C37.5938 38.9326 41.3221 46.495 47.2186 51.6276Z"
    stroke="#201E1E"
  />
</template>
