<script setup lang="ts">
import { ref } from 'vue';
import usePopper from '../usePopper';

const props = defineProps({
    options: {
        type: Object,
        required: true
    }
});
const toggleRef = ref(null);
const popoverRef = ref(null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { updatePopper } = usePopper({ referenceEl: toggleRef, popperTarget: popoverRef }, props.options);
</script>

<template>
  <div
    id="toggle"
    ref="toggleRef"
  />
  <div
    id="popover"
    ref="popoverRef"
  />
</template>
