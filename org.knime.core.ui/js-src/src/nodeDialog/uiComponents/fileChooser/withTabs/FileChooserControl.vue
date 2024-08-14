<script setup lang="ts">
import { computed, ref, watch } from "vue";
import SideDrawerContent from "./SideDrawerContent.vue";
import useDialogControl from "../../../composables/components/useDialogControl";
import LabeledControl from "../../label/LabeledControl.vue";
import SettingsSubPanel from "@/nodeDialog/layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import { rendererProps } from "@jsonforms/vue";
import { FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import { FunctionButton } from "@knime/components";
import FolderLenseIcon from "@knime/styles/img/icons/folder-lense.svg";
import FileChooserProps from "../types/FileChooserProps";
import FSLocationTextControl from "./FSLocationTextControl.vue";
const props = defineProps(rendererProps());
const {
  control,
  onChange: onChangeControl,
  disabled,
  flowSettings,
} = useDialogControl({
  props,
});

const browseOptions = computed(() => {
  return control.value.uischema.options as FileChooserOptions;
});

const getDefaultData = () => {
  return {
    path: "",
    timeout: 10000,
    fsCategory: browseOptions.value.isLocal
      ? "LOCAL"
      : "relative-to-current-hubspace",
  };
};

const data = computed(() => {
  return control.value.data?.path ?? getDefaultData();
});

const onChange = (value: any) => {
  onChangeControl({ path: value });
};

watch(
  () => Boolean(flowSettings.value?.controllingFlowVariableName),
  (value) => {
    if (!value) {
      onChange(getDefaultData());
    }
  },
);

const content = ref<null | { modelValue: FileChooserProps["modelValue"] }>(
  null,
);
const onApply = () => {
  if (!content.value) {
    return;
  }
  onChange(content.value.modelValue);
};
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <div class="flex-row">
      <FSLocationTextControl
        :id="labelForId"
        class="flex-grow"
        :model-value="data"
        :disabled="disabled"
        :is-local="browseOptions.isLocal"
        @update:model-value="onChange"
      />
      <SettingsSubPanel @apply="onApply">
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
          <SideDrawerContent
            :id="labelForId"
            ref="content"
            :disabled="disabled"
            :initial-value="data"
            :options="browseOptions"
          />
        </template>
      </SettingsSubPanel>
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

  & .fit-content {
    height: fit-content;
  }
}
</style>
