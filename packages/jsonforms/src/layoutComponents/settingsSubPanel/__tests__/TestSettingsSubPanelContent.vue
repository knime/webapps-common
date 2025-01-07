<script setup lang="ts">
import { onMounted } from "vue";

import { useApplyButton } from "..";

const props = defineProps<{
  onApply: () => Promise<void>;
}>();

const applyButton = useApplyButton();
onMounted(() => {
  applyButton.onApply.value = props.onApply;
});

defineExpose({ applyButton });
</script>

<template>
  <span> Hello world</span>
</template>
