<script setup lang="ts">
import type FileChooserProps from "../types/FileChooserProps";
import type { FileChooserValue, FSCategory } from "../types/FileChooserProps";
import StringFileChooserInputWithExplorer from "./StringFileChooserInputWithExplorer.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import CustomUrlFileChooser from "../CustomUrlFileChooser.vue";
import { computed, toRef } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import useFileChooserStateChange from "../composables/useFileChooserStateChange";

const props = defineProps<FileChooserProps>();
const emit = defineEmits(["update:modelValue"]);

const { onFsCategoryUpdate, onPathUpdate, onTimeoutUpdate } =
  useFileChooserStateChange(
    toRef(props, "modelValue"),
    (value: FileChooserValue) => {
      emit("update:modelValue", value);
    },
  );

const possibleCategories: { id: keyof typeof FSCategory; text: string }[] = [
  {
    id: "LOCAL",
    text: "Local File System",
  },
  {
    id: "CUSTOM_URL",
    text: "Custom/KNIME URL",
  },
  {
    id: "relative-to-current-hubspace",
    text: "Current Hub space",
  },
];

const stringFileChooserPlaceholder = computed(() =>
  props.modelValue.fsCategory === "LOCAL"
    ? "Local file path"
    : "Path relative to hub space",
);

const stringFileChooserOptions = computed(() => ({
  placeholder: stringFileChooserPlaceholder.value,
  ...props.options,
}));

const isSupported = computed(() =>
  possibleCategories.map(({ id }) => id).includes(props.modelValue.fsCategory),
);
</script>

<template>
  <template v-if="isSupported">
    <ValueSwitch
      class="value-switch"
      :disabled="disabled"
      placeholder=""
      :possible-values="possibleCategories"
      :model-value="modelValue.fsCategory"
      @update:model-value="onFsCategoryUpdate"
    />
    <CustomUrlFileChooser
      v-if="modelValue.fsCategory === 'CUSTOM_URL'"
      :id="id"
      :model-value="modelValue"
      :disabled="disabled"
      @update:path="onPathUpdate"
      @update:timeout="onTimeoutUpdate"
    />
    <StringFileChooserInputWithExplorer
      v-else
      :id="id"
      :backend-type="
        modelValue.fsCategory === 'LOCAL'
          ? 'local'
          : 'relativeToCurrentHubSpace'
      "
      :disabled="disabled"
      :model-value="modelValue.path"
      :options="stringFileChooserOptions"
      @update:model-value="onPathUpdate"
    />
  </template>
  <InputField
    v-else
    :id="id"
    :model-value="modelValue.context?.fsToString"
    disabled
  />
</template>

<style scoped lang="postcss">
.value-switch {
  margin-bottom: 10px;
}
</style>
