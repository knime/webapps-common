<script setup lang="ts">
import { computed } from "vue";
import useDialogControl from "../../composables/useDialogControl";
import StringFileChooserInputWithExplorer from "./StringFileChooserInputWithExplorer.vue";
import LabeledInput from "../label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
const props = defineProps(rendererProps());
const {
  control,
  handleDirtyChange: onChange,
  disabled,
} = useDialogControl<string>({ props });
const placeholder = computed(() => control.value.uischema.options?.placeholder);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <StringFileChooserInputWithExplorer
      :id="labelForId"
      :backend-type="'local'"
      :disabled="disabled"
      :placeholder="placeholder"
      :model-value="control.data"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
