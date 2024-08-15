<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import SideDrawerContent from "./SideDrawerContent.vue";
import useDialogControl from "../../../composables/components/useDialogControl";
import LabeledControl from "../../label/LabeledControl.vue";
import SettingsSubPanel from "@/nodeDialog/layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import { rendererProps } from "@jsonforms/vue";
import { FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import { FunctionButton } from "@knime/components";
import FolderLenseIcon from "@knime/styles/img/icons/folder-lense.svg";
import FileChooserProps, { FileChooserValue } from "../types/FileChooserProps";
import FSLocationTextControl from "./FSLocationTextControl.vue";
import { useFileChooserFileSystemsOptions } from "../composables/useFileChooserBrowseOptions";
import useFileChooserStateChange from "../composables/useFileChooserStateChange";
const props = defineProps(rendererProps());
const {
  control,
  onChange: onChangeControl,
  disabled: disabledByFramework,
  flowSettings,
} = useDialogControl<{ path: FileChooserValue }>({
  props,
});

const disabled = computed(
  () =>
    disabledByFramework.value ||
    control.value.uischema.options?.fileSystemConnectionMissing,
);

const browseOptions = computed(() => {
  return control.value.uischema.options as FileChooserOptions;
});

const { validCategories } = useFileChooserFileSystemsOptions(browseOptions);
const getDefaultData = () => {
  return {
    path: "",
    timeout: 10000,
    fsCategory: validCategories.value[0],
    context: {
      fsSpecifier: browseOptions.value.fileSystemSpecifier,
    },
  };
};

const data = computed(() => {
  return control.value.data?.path ?? getDefaultData();
});

const onChange = (value: any) => {
  onChangeControl({ path: value });
};

const isOverwritten = computed(() =>
  Boolean(flowSettings.value?.controllingFlowVariableName),
);

/**
 * Reset to default data when flow variable is cleared
 */
watch(
  () => isOverwritten.value,
  (value) => {
    if (!value) {
      onChange(getDefaultData());
    }
  },
);

const { onFsCategoryUpdate } = useFileChooserStateChange(
  computed(() => control.value.data.path),
  onChange,
  browseOptions,
);

/**
 * This currently can happen in case a node implementation sets the default value to one that is not supported in this frontend.
 * Or when there was a file system connected/removed since the last time the settings were saved.
 * In this case, we switch to a default.
 */
onMounted(() => {
  if (
    !isOverwritten.value &&
    !validCategories.value.includes(control.value.data.path)
  ) {
    onFsCategoryUpdate(validCategories.value[0]);
  }
});

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
        :port-index="browseOptions.portIndex"
        :file-system-specifier="browseOptions.fileSystemSpecifier"
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
