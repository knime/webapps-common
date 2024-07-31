<script lang="ts">
export type TitleConfig =
  | { type: "provided"; provider: string }
  | { type: "enumerated"; title: string };
</script>

<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
import useProvidedState from "@/nodeDialog/composables/components/useProvidedState";
import { computed } from "vue";

const props = defineProps<{
  titleConfig: TitleConfig;
  index: number;
}>();

const elementTitle =
  props.titleConfig.type === "provided"
    ? useProvidedState(props.titleConfig.provider, "")
    : computed(() => `${props.titleConfig} ${props.index + 1}`);
</script>

<template>
  <Label :text="elementTitle" compact />
</template>
