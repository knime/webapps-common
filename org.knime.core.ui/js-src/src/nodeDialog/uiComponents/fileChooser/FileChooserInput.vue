<script setup lang="ts">
import type FileChooserProps from "./types/FileChooserProps";
import type { FileChooserValue, FSCategory } from "./types/FileChooserProps";
import LocalFileChooserInput from "./LocalFileChooserInput.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import CustomUrlFileChooser from "./CustomUrlFileChooser.vue";
import { mergeDeep } from "@/nodeDialog/utils";
import { computed } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";

const props = defineProps<FileChooserProps>();
const emit = defineEmits(["update:modelValue"]);

const onChange = (value: FileChooserValue) => {
  emit("update:modelValue", value);
};

const onPathUpdate = (path: string) => {
  onChange(mergeDeep(props.modelValue, { path }));
};

const onTimeoutUpdate = (timeout: number) => {
  onChange(mergeDeep(props.modelValue, { timeout }));
};

const onFsCategoryUpdate = (fsCategory: keyof typeof FSCategory) => {
  onChange(mergeDeep(props.modelValue, { fsCategory }));
};

const possibleCategories: { id: keyof typeof FSCategory; text: string }[] = [
  {
    id: "LOCAL",
    text: "Local File System",
  },
  {
    id: "CUSTOM_URL",
    text: "Custom/KNIME URL",
  },
];

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
    <LocalFileChooserInput
      v-else
      :id="id"
      :disabled="disabled"
      placeholder="Local file path"
      :model-value="modelValue.path"
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
