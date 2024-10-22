<script setup lang="ts">
import { computed } from "vue";
import { DateTimeInput } from "@knime/components/date-time-input";
import useDialogControl from "../composables/components/useDialogControl";
import LabeledControl from "./label/LabeledControl.vue";
import { rendererProps } from "@jsonforms/vue";
const props = defineProps(rendererProps());
const { control, disabled, onChange } = useDialogControl<string>({ props });

const options = computed(() => control.value.uischema.options);
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <DateTimeInput
      :id="labelForId"
      two-lines
      :model-value="new Date(control.data)"
      class="date-time"
      :required="true"
      :show-time="false"
      :timezone="options?.timezone"
      :date-format="options?.dateFormat"
      compact
      :disabled="disabled"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>
