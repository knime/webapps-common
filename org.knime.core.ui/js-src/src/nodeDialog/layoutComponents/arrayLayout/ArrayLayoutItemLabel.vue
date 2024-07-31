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
  subTitleProvider: string | undefined;
  index: number;
}>();

const titleConfig = props.titleConfig;

const elementTitle =
  titleConfig.type === "provided"
    ? useProvidedState(titleConfig.provider, "")
    : computed(() => `${titleConfig.title} ${props.index + 1}`);

const subTitle = useProvidedState(props.subTitleProvider, "");
</script>

<template>
  <div class="vertical">
    <Label :text="elementTitle" compact />
    <span v-if="subTitle">{{ subTitle }}</span>
  </div>
</template>

<style scoped>
.vertical {
  display: flex;
  flex-direction: column;

  & span {
    font-style: italic;
    font-size: 10px;
  }
}
</style>
