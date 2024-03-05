<script setup lang="ts">
import Control from "@/nodeDialog/types/Control";
import { useFlowSettings } from "../useFlowVariables";
import { Ref } from "vue";
const props = defineProps<{
  control: Ref<Pick<Control, "path" | "rootSchema">>;
  subConfigKeys?: string[];
}>();
const flowSettings = useFlowSettings(props as any).flowSettings;

defineExpose({
  flowSettings,
});
</script>

<template>
  <slot />
</template>
