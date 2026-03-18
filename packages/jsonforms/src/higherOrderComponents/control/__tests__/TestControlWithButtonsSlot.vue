<script setup lang="ts">
import { ref } from "vue";

import type { ControlSlots, VueControlProps } from "..";

defineProps<VueControlProps<string>>();
defineSlots<ControlSlots>();

const hover = ref(false);
</script>

<template>
  <div
    class="test-control"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <span class="control-content">Data: {{ control.data }}</span>
    <div class="buttons-slot">
      <slot name="buttons" :hover="hover" />
    </div>
  </div>
</template>
