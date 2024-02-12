<script setup lang="ts">
import FileChooser from "./FileChooser.vue";
import { computed, onMounted, ref } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import FolderLenseIcon from "webapps-common/ui/assets/img/icons/folder-lense.svg";
import type StringFileChooserInputWithExplorerProps from "./types/StringFileChooserInputWithExplorerProps";

const props = defineProps<StringFileChooserInputWithExplorerProps>();
const emit = defineEmits(["update:modelValue"]);

const placeholder = computed(() => props.options?.placeholder);
const isWriter = computed(() => props.options?.isWriter);
const filteredExtensions = ref<string[]>([]);
onMounted(() => {
  if (props.options?.fileExtension) {
    filteredExtensions.value = [props.options?.fileExtension]; // TODO
  }
});

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
  <div v-if="active" class="modal-overlay">
    <FileChooser
      :backend-type="backendType"
      :initial-file-path="modelValue"
      :is-writer="isWriter"
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
