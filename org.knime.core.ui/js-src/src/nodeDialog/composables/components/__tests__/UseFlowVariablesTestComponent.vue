<script setup lang="ts">
import { UseFlowSettingsProps, useFlowSettings } from "../useFlowVariables";
const props = defineProps<UseFlowSettingsProps>();
const flowSettings = useFlowSettings(props).flowSettings;

defineExpose({
  flowSettings,
});
</script>

<template>
  <slot />
</template>
