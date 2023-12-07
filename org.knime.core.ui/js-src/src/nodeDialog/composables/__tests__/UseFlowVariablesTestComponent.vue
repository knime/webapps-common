<script setup lang="ts">
import { useFlowSettings } from "../useFlowVariables";
const props = defineProps<{
  path: string;
  configKeys?: string[];
  subConfigKeys?: string[];
}>();
const flowSettings = useFlowSettings(props);

defineExpose({
  flowSettings,
});
</script>

<template>
  <slot />
</template>
