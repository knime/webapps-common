<script lang="ts">
import { BackendType } from "../types";

interface StringFileChooserInputWithExplorerProps {
  modelValue: string;
  disabled: boolean;
  options?: {
    placeholder?: string;
    isWriter?: boolean;
    fileExtension?: string;
    fileExtensions?: string[];
    fileExtensionProvider?: string;
    currentSpaceName?: string;
  };
  id: string | null;
  backendType: BackendType;
}

export { StringFileChooserInputWithExplorerProps };
</script>

<script setup lang="ts">
import FileChooserWithButtons from "./FileChooserWithButtons.vue";
import { computed, ref, toRef } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import FolderLenseIcon from "webapps-common/ui/assets/img/icons/folder-lense.svg";
import { useFileChooserBrowseOptions } from "../composables/useFileChooserBrowseOptions";

const props = withDefaults(
  defineProps<StringFileChooserInputWithExplorerProps>(),
  { options: () => ({}) },
);
const emit = defineEmits(["update:modelValue"]);

const placeholder = computed(() => props.options?.placeholder);
const { filteredExtensions, appendedExtension, isWriter, isLoaded } =
  useFileChooserBrowseOptions(toRef(props, "options"));

const active = ref(false);
const deactivateFileChooser = () => {
  active.value = false;
};
const activateFileChooser = () => {
  active.value = true;
};

const onChange = (file: string) => {
  emit("update:modelValue", file);
};

const chooseFile = (chosen: string) => {
  onChange(chosen);
  deactivateFileChooser();
};
</script>

<template>
  <InputField
    :id="id"
    :disabled="disabled"
    :model-value="modelValue"
    :placeholder="placeholder"
    @update:model-value="onChange"
  >
    <template #iconRight>
      <FunctionButton
        :disabled="disabled"
        title="Browse local file system"
        @click="activateFileChooser"
      >
        <FolderLenseIcon />
      </FunctionButton>
    </template>
  </InputField>
  <div v-if="active && isLoaded" class="modal-overlay">
    <FileChooserWithButtons
      :backend-type="backendType"
      :initial-file-path="modelValue"
      :is-writer="isWriter"
      :appended-extension="appendedExtension"
      :filtered-extensions="filteredExtensions"
      @choose-file="chooseFile"
      @cancel="deactivateFileChooser"
    />
  </div>
</template>

<style scoped lang="postcss">
.modal-overlay {
  position: fixed;
  inset: 0;
  padding: 20px;
  z-index: 100;
  background-color: var(--knime-white);
}
</style>
