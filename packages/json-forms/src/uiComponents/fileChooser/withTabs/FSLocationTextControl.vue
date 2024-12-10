<script lang="ts">
// eslint-disable-next-line import/order
import { FSCategory, type FileChooserValue } from "../types/FileChooserProps";

interface Props {
  modelValue: FileChooserValue;
  disabled: boolean;
  isLocal?: boolean;
  portIndex?: number;
  fileSystemSpecifier?: string;
}
export type { Props };

const currentSpacePrefix = "knime://knime.space/";
const embeddedDataPrefix = "knime://knime.workflow.data/";
export const prefixes: [keyof typeof FSCategory, string][] = [
  ["relative-to-current-hubspace", currentSpacePrefix],
  ["relative-to-embedded-data", embeddedDataPrefix],
];
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { InputField } from "@knime/components";

import getDeepActiveElement from "../../../utils/getDeepActiveElement";
import useFileChooserBackend, {
  getBackendType,
} from "../composables/useFileChooserBackend";

import { startsWithSchemeRegex } from "./url/urlUtil";

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [FileChooserValue];
}>();

const isConnected = computed(() => typeof props.portIndex !== "undefined");

const { getFilePath } = useFileChooserBackend({
  filteredExtensions: ref([]), // only relevant for browsing
  appendedExtension: ref(null), // We do not wish to append anything here, since the user should be able to manually access any file
  isWriter: ref(false), // only relevant for browsing
  backendType: computed(() =>
    getBackendType(props.modelValue.fsCategory, props.portIndex),
  ),
});

const fsLocationToText = async (fsLocation: FileChooserValue) => {
  if (
    !isConnected.value &&
    fsLocation.fsCategory === "relative-to-current-hubspace"
  ) {
    return currentSpacePrefix + fsLocation.path;
  }
  if (
    !isConnected.value &&
    fsLocation.fsCategory === "relative-to-embedded-data"
  ) {
    return embeddedDataPrefix + fsLocation.path;
  }
  if (!isConnected.value && fsLocation.fsCategory === "CUSTOM_URL") {
    return fsLocation.path;
  }
  if (!isConnected.value && fsLocation.fsCategory === "LOCAL") {
    const { path, errorMessage } = await getFilePath(null, fsLocation.path);
    if (errorMessage) {
      return fsLocation.path;
    }
    return path || "";
  }
  if (isConnected.value && fsLocation.fsCategory === "CONNECTED") {
    return fsLocation.path;
  }
  return fsLocation.context?.fsToString ?? "";
};

const inputField = ref<null | { $refs: { input: HTMLElement } }>(null);

const currentValue = ref("");
onMounted(() => {
  updateCurrentValueFromModelValue();
});

const updateCurrentValueFromModelValue = async () => {
  currentValue.value = await fsLocationToText(props.modelValue);
};

/**
 * Watcher is only used for updates other than user input to the text field.
 * The update on user input happens on focusout below.
 */
watch(
  () => props.modelValue,
  () => {
    if (getDeepActiveElement() !== inputField.value?.$refs.input) {
      updateCurrentValueFromModelValue();
    }
  },
);

const textToFsLocation = (text: string): FileChooserValue => {
  if (isConnected.value) {
    return {
      fsCategory: "CONNECTED",
      path: text,
      timeout: props.modelValue.timeout,
      context: {
        fsToString: "", // won't be used in case of isConnected = true
        fsSpecifier: props.fileSystemSpecifier,
      },
    };
  }
  for (const [fsCategory, prefix] of prefixes) {
    if (text.startsWith(prefix)) {
      return {
        fsCategory,
        path: text.replace(prefix, ""),
        timeout: props.modelValue.timeout,
      };
    }
  }
  const defaultCategory: keyof typeof FSCategory = props.isLocal
    ? "LOCAL"
    : "relative-to-current-hubspace";
  return {
    fsCategory: startsWithSchemeRegex.test(text)
      ? "CUSTOM_URL"
      : defaultCategory,
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
    compact
    @update:model-value="onTextInput"
    @focusout="updateCurrentValueFromModelValue"
  />
</template>
