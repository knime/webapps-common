<script setup lang="ts">
import FolderLenseIcon from "@knime/styles/img/icons/folder-lense.svg";
import SettingsSubPanel from "@/nodeDialog/layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import { FunctionButton } from "@knime/components";

interface Props {
  disabled: boolean;
}

defineProps<Props>();
const emit = defineEmits(["apply"]);
</script>

<template>
  <SettingsSubPanel @apply="() => emit('apply')">
    <template #expand-button="{ expand }">
      <FunctionButton
        class="fit-content"
        :disabled="disabled"
        primary
        compact
        @click="expand"
        ><FolderLenseIcon
      /></FunctionButton>
    </template>
    <template #default>
      <slot />
    </template>
  </SettingsSubPanel>
</template>
