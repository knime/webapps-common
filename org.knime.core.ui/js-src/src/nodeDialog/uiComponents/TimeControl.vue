<script setup lang="ts">
import useDialogControl from "../composables/components/useDialogControl";
import LabeledControl from "./label/LabeledControl.vue";
import { rendererProps } from "@jsonforms/vue";

import { ref } from "vue";
import { DateTimeInput } from "@knime/components/date-time-input";
import { localTimeUtils } from "@/nodeDialog/utils/localTimeUtils";

const props = defineProps(rendererProps());
const { control, disabled, onChange } = useDialogControl<string>({ props });

const model = ref(localTimeUtils.fromString(control.value.data));
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <DateTimeInput
      :id="labelForId"
      v-model="model"
      class="date-time"
      :required="true"
      compact
      :disabled="disabled"
      :show-date="false"
      :show-time="true"
      :show-milliseconds="true"
      @update:model-value="
        (newValue) => onChange(localTimeUtils.toString(newValue))
      "
    />
  </LabeledControl>
</template>
