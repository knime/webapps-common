<script setup lang="ts">
import { computed, ref } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import LabeledInput from "./label/LabeledInput.vue";
import useDialogControl from "../composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import useHideOnNull from "./composables/useHideOnNull";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";

const props = defineProps(rendererProps());
const {
  handleDirtyChange: onChange,
  control,
  disabled,
} = useDialogControl<string | null | undefined>({ props });

const placeholder = computed(
  () => control.value.uischema.options?.placeholder ?? "",
);
const controlElement = ref(null);
const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control,
    disabled,
    controlElement,
  },
  {
    setDefault: () => onChange(""),
    setNull: () => onChange(null),
  },
);
</script>

<template>
  <LabeledInput :control="control" @controlling-flow-variable-set="onChange">
    <template #before-label>
      <Checkbox v-if="showCheckbox" v-bind="checkboxProps" />
    </template>
    <template #default="{ labelForId }">
      <InputField
        v-if="showControl"
        :id="labelForId"
        ref="controlElement"
        :placeholder="placeholder"
        :model-value="control.data"
        :disabled="disabled"
        @update:model-value="onChange"
      />
    </template>
  </LabeledInput>
</template>
