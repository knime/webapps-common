<script setup lang="ts">
import { ref } from 'vue';
import useDropdownNavigation from '../useDropdownNavigation';

const props = defineProps({
    getNextElement: {
        type: Function,
        required: true
    },
    close: {
        type: Function,
        required: true
    }
});

const baseRef = ref(null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { currentMarkedIndex, resetNavigation } = useDropdownNavigation({ baseElement: baseRef, ...props });
</script>

<template>
  <button
    id="baseElement"
    ref="baseRef"
  />
</template>
