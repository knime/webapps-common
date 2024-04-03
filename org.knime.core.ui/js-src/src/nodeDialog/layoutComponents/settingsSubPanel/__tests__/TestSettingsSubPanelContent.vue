<script setup lang="ts">
import { useApplyButton } from "@/nodeDialog/layoutComponents/settingsSubPanel";
import { onMounted } from "vue";

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
