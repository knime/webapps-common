<script setup lang="ts">
import { computed } from "vue";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import LabeledControl from "@/nodeDialog/uiComponents/label/LabeledControl.vue";
import { rendererProps } from "@jsonforms/vue";
import { type FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import FileBrowserButton from "../FileBrowserButton.vue";
import { useFileChooserBrowseOptions } from "../composables/useFileChooserBrowseOptions";
import { InputField } from "@knime/components";
import useSideDrawerContent from "../composables/useSideDrawerContent";
import FileExplorerTab from "../withTabs/FileExplorerTab.vue";
const props = defineProps(rendererProps());
const { control, onChange, disabled } = useDialogControl<string>({ props });
const uiSchemaOptions = computed(
  () =>
    control.value.uischema.options as FileChooserOptions & {
      placeholder?: string;
    },
);
const { sideDrawerValue, updateSideDrawerValue, onApply } =
  useSideDrawerContent<string>({
    onChange,
    initialValue: computed(() => control.value.data),
  });
const { appendedExtension, filteredExtensions, isLoaded, isWriter } =
  useFileChooserBrowseOptions(uiSchemaOptions);
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <div class="flex-row">
      <InputField
        :id="labelForId"
        class="flex-grow"
        :disabled="disabled"
        :model-value="control.data"
        :placeholder="uiSchemaOptions.placeholder"
        compact
        @update:model-value="onChange"
      />
      <FileBrowserButton :disabled="disabled" @apply="onApply">
        <FileExplorerTab
          v-if="isLoaded"
          :backend-type="'local'"
          :disabled="disabled"
          :options="uiSchemaOptions"
          :initial-value="control.data"
          :is-writer="isWriter"
          :filtered-extensions="filteredExtensions"
          :appended-extension="appendedExtension"
          :initial-file-path="sideDrawerValue"
          @choose-file="updateSideDrawerValue"
        />
      </FileBrowserButton>
    </div>
  </LabeledControl>
</template>

<style lang="postcss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  & .flex-grow {
    flex-grow: 1;
  }
}
</style>
