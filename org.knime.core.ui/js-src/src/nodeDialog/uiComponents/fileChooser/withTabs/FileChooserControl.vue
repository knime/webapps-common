<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import useDialogControl from "../../../composables/components/useDialogControl";
import LabeledControl from "../../label/LabeledControl.vue";
import { rendererProps } from "@jsonforms/vue";
import { type FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import { type FileChooserValue } from "../types/FileChooserProps";
import FSLocationTextControl from "./FSLocationTextControl.vue";
import { useFileChooserFileSystemsOptions } from "../composables/useFileChooserBrowseOptions";
import useFileChooserStateChange from "../composables/useFileChooserStateChange";
import FileBrowserButton from "../FileBrowserButton.vue";
import useSideDrawerContent from "../composables/useSideDrawerContent";
import SideDrawerContent from "./SideDrawerContent.vue";
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
  computed(() => control.value.data?.path),
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
    !validCategories.value.includes(control.value.data?.path.fsCategory)
  ) {
    onFsCategoryUpdate(validCategories.value[0]);
  }
});

const { onApply, sideDrawerValue } = useSideDrawerContent<FileChooserValue>({
  onChange,
  initialValue: data,
});
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
      <FileBrowserButton :disabled="disabled" @apply="onApply">
        <SideDrawerContent
          :id="labelForId"
          v-model="sideDrawerValue"
          :disabled="disabled"
          :options="browseOptions"
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

  & .fit-content {
    height: fit-content;
  }
}
</style>
