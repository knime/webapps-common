<script lang="ts">
import type { Props as SettingsSubPanelProps } from "../SettingsSubPanel.vue";
import TestSettingsSubPanelContent from "./TestSettingsSubPanelContent.vue";
import { useApplyButton } from "@/nodeDialog/layoutComponents/settingsSubPanel";
export interface Props {
  settingsSubPanelConfig: SettingsSubPanelProps;
  onApply: () => Promise<void>;
}

export const expandButtonId = "expandButton";
export const contentId = "content";
</script>

<script setup lang="ts">
import { ref } from "vue";
import SettingsSubPanel from "../SettingsSubPanel.vue";

defineProps<Props>();
const content = ref<null | typeof TestSettingsSubPanelContent>(null);

const getApplyButton: typeof useApplyButton = () => content.value?.applyButton;

defineExpose({
  getApplyButton,
});
</script>

<template>
  <SettingsSubPanel v-bind="settingsSubPanelConfig">
    <template #expand-button="{ expand }">
      <button :id="expandButtonId" @click="expand">Expand</button>
    </template>
    <template #default>
      <TestSettingsSubPanelContent
        :id="contentId"
        ref="content"
        :on-apply="onApply"
      />
    </template>
  </SettingsSubPanel>
</template>
