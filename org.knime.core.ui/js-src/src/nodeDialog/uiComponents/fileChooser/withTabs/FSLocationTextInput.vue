<script lang="ts">
import { FileChooserValue, FSCategory } from "../types/FileChooserProps";
interface Props {
  modelValue: FileChooserValue;
  disabled: boolean;
  isLocal?: boolean;
}
export { Props };

const currentSpacePrefix = "knime://knime.space/";
const localPrefix = "file://";
export const prefixes: [keyof typeof FSCategory, string][] = [
  ["relative-to-current-hubspace", currentSpacePrefix],
  ["LOCAL", localPrefix],
];
</script>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import getDeepActiveElement from "@/utils/getDeepActiveElement";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { startsWithSchemeRegex } from "./urlUtil";
import useFileChooserBackend from "../composables/useFileChooserBackend";

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [FileChooserValue];
}>();

const { getFilePath } = useFileChooserBackend({
  filteredExtensions: ref([]), // only relevant for browsing
  appendedExtension: ref(null), // We do not wish to append anything here, since the user should be able to manually access any file
  isWriter: ref(false), // only relevant for browsing
  backendType: computed(() =>
    props.isLocal ? "local" : "relativeToCurrentHubSpace",
  ),
});

const fsLocationToText = async (fsLocation: FileChooserValue) => {
  if (fsLocation.fsCategory === "relative-to-current-hubspace") {
    return currentSpacePrefix + fsLocation.path;
  }
  if (fsLocation.fsCategory === "CUSTOM_URL") {
    return fsLocation.path;
  }
  if (fsLocation.fsCategory === "LOCAL") {
    const { path, errorMessage } = await getFilePath(null, fsLocation.path);
    if (errorMessage) {
      return fsLocation.path;
    }
    return localPrefix + path;
  } else {
    return fsLocation.context!.fsToString;
  }
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
