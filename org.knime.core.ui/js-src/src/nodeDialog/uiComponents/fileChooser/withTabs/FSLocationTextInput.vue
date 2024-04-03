<script lang="ts">
import { FileChooserValue } from "../types/FileChooserProps";
interface Props {
  modelValue: FileChooserValue;
  disabled: boolean;
}
export { Props };
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import getDeepActiveElement from "@/utils/getDeepActiveElement";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { startsWithSchemeRegex } from "./urlUtil";

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [FileChooserValue];
}>();

const currentSpacePrefix = "knime://knime.space/";

const fsLocationToText = (fsLocation: FileChooserValue) => {
  if (fsLocation.fsCategory === "relative-to-current-hubspace") {
    return currentSpacePrefix + fsLocation.path;
  }
  if (fsLocation.fsCategory === "CUSTOM_URL") {
    return fsLocation.path;
  }
  /**
   * TODO: UIEXT-1734 change this to however local paths should be represented
   */
  if (fsLocation.fsCategory === "LOCAL") {
    return `(LOCAL, ${fsLocation.path})`;
  } else {
    return fsLocation.context?.fsToString;
  }
};

const inputField = ref<null | { $refs: { input: HTMLElement } }>(null);

const currentValue = ref(fsLocationToText(props.modelValue));

const textValue = computed(() => fsLocationToText(props.modelValue));
const updateCurrentValueFromTextValue = () => {
  currentValue.value = textValue.value;
};

/**
 * Watcher is only used for updates other than user input to the text field.
 * The update on user input happens on focusout below.
 */
watch(
  () => textValue.value,
  () => {
    if (getDeepActiveElement() !== inputField.value?.$refs.input) {
      updateCurrentValueFromTextValue();
    }
  },
);

const textToFsLocation = (text: string): FileChooserValue => {
  if (text.startsWith(currentSpacePrefix)) {
    return {
      fsCategory: "relative-to-current-hubspace",
      path: text.replace(currentSpacePrefix, ""),
      timeout: props.modelValue.timeout,
    };
  }
  return {
    fsCategory: startsWithSchemeRegex.test(text)
      ? "CUSTOM_URL"
      : "relative-to-current-hubspace",
    path: text,
    timeout: props.modelValue.timeout,
  };
};

const onTextInput = (text: string) => {
  currentValue.value = text;
  emit("update:modelValue", textToFsLocation(text));
};
</script>

<template>
  <InputField
    ref="inputField"
    :model-value="currentValue"
    :disabled="disabled"
    @update:model-value="onTextInput"
    @focusout="updateCurrentValueFromTextValue"
  />
</template>
