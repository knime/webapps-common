<script setup lang="ts">
import { computed } from "vue";
import useDialogControl from "../../../composables/components/useDialogControl";
import StringFileChooserControlWithExplorer from "./StringFileChooserControlWithExplorer.vue";
import LabeledControl from "../../label/LabeledControl.vue";
import { rendererProps } from "@jsonforms/vue";
import type { FileChooserOptions } from "../../../types/FileChooserUiSchema";
const props = defineProps(rendererProps());
const { control, onChange, disabled } = useDialogControl<string>({ props });
const uiSchemaOptions = computed(
  () => control.value.uischema.options as FileChooserOptions,
);
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <StringFileChooserControlWithExplorer
      :id="labelForId"
      :backend-type="'local'"
      :disabled="disabled"
      :options="uiSchemaOptions"
      :model-value="control.data"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>
