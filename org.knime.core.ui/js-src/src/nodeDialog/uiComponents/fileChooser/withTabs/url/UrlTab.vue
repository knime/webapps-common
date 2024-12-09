<script lang="ts">
interface Props {
  modelValue: { path: string; timeout: number };
  id: string | null;
}
export type { Props };
</script>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";

import { useApplyButton } from "../../../../layoutComponents/settingsSubPanel";

import CustomUrlFileChooser from "./CustomUrlFileChooser.vue";
import { startsWithSchemeRegex } from "./urlUtil";

const props = defineProps<Props>();

const emit = defineEmits(["update:path", "update:timeout"]);

const { text: applyText, disabled: applyDisabled, onApply } = useApplyButton();

onMounted(() => {
  applyText.value = "Set Url";
  onApply.value = () => Promise.resolve();
});

const urlIsValid = computed(() =>
  startsWithSchemeRegex.test(props.modelValue.path),
);
watch(
  () => urlIsValid.value,
  (isValid) => {
    applyDisabled.value = !isValid;
  },
  { immediate: true },
);
const urlErrorMessage = computed(() =>
  urlIsValid.value
    ? null
    : 'The url needs to start with a scheme (e.g. "https://")',
);
</script>

<template>
  <CustomUrlFileChooser
    :id="id"
    :model-value="modelValue"
    :url-error-message="urlErrorMessage"
    @update:path="emit('update:path', $event)"
    @update:timeout="emit('update:timeout', $event)"
  />
</template>
