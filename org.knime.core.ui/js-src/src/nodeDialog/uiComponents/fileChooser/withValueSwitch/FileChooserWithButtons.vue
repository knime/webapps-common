<script setup lang="ts">
import { ref } from "vue";
import type { BackendType } from "../types";
import Button from "webapps-common/ui/components/Button.vue";
import DialogFileExplorer from "../DialogFileExplorer.vue";

const props = withDefaults(
  defineProps<{
    initialFilePath?: string;
    isWriter?: boolean;
    filteredExtensions?: string[];
    appendedExtension?: string | null;
    backendType: BackendType;
  }>(),
  {
    initialFilePath: "",
    isWriter: false,
    filteredExtensions: () => [],
    appendedExtension: null,
  },
);

const emit = defineEmits<{
  chooseFile: [
    /**
     * The full path of the chosen file
     */
    filePath: string,
  ];
  cancel: [];
}>();

const fileIsSelected = ref(false);
const explorer = ref<typeof DialogFileExplorer | null>(null);

const openFile = () => {
  explorer.value?.openFile();
};

const onCancel = () => {
  emit("cancel");
};

const onOpenFile = (name: string) => {
  emit("chooseFile", name);
};

const buttonWrapper = ref<null | HTMLElement>(null);
</script>

<template>
  <div class="wrapper">
    <DialogFileExplorer
      ref="explorer"
      v-bind="props"
      :click-outside-exception="buttonWrapper"
      @choose-file="onOpenFile"
      @file-is-selected="
        (isSelected) => {
          fileIsSelected = isSelected;
        }
      "
    />
    <div ref="buttonWrapper" class="button-wrapper">
      <Button compact with-border @click="onCancel">Cancel</Button>
      <Button
        ref="applyButton"
        :disabled="!fileIsSelected"
        compact
        primary
        @click="openFile"
        >Choose</Button
      >
    </div>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  & .button-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 10px 0;
  }
}
</style>
