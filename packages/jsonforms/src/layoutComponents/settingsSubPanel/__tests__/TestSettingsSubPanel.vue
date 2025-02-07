<script lang="ts">
export const expandButtonId = "expandButton";
export const contentId = "test-content";
</script>

<script setup lang="ts">
import SettingsSubPanel, {
  type Props as SettingsSubPanelProps,
} from "../SettingsSubPanel.vue";

export interface Props {
  settingsSubPanelConfig: SettingsSubPanelProps;
  onApply: () => Promise<void>;
}

defineProps<Props>();
</script>

<template>
  <SettingsSubPanel v-bind="settingsSubPanelConfig">
    <template #expand-button="{ expand }">
      <button :id="expandButtonId" @click="expand">Expand</button>
    </template>
    <template #default>
      <span :id="`${contentId}`">Hello world</span>
    </template>
  </SettingsSubPanel>
</template>
