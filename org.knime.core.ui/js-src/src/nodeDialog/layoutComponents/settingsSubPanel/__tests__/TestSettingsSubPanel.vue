<script lang="ts">
import type { Props as SettingsSubPanelProps } from "../SettingsSubPanel.vue";
export interface Props {
  onApply: () => Promise<void>;
  settingsSubPanelConfig: SettingsSubPanelProps;
}

export const expandButtonId = "expandButton";
export const contentId = "content";
</script>

<script setup lang="ts">
import SettingsSubPanel from "../SettingsSubPanel.vue";
import useSubPanel from "../useSubPanel";

const props = defineProps<Props>();

const subPanelProps = useSubPanel(props.onApply);
</script>

<template>
  <SettingsSubPanel v-bind="{ ...subPanelProps, ...settingsSubPanelConfig }">
    <template #expand-button="{ expand }">
      <button :id="expandButtonId" @click="expand">Expand</button>
    </template>
    <template #default>
      <span :id="contentId"> Hello world</span>
    </template>
  </SettingsSubPanel>
</template>
