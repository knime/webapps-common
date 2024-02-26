<script setup lang="ts">
import { computed } from "vue";
import DateInput from "webapps-common/ui/components/forms/DateTimeInput.vue";
import useDialogControl from "../composables/components/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
const props = defineProps(rendererProps());
const {
  control,
  disabled,
  handleDirtyChange: onChange,
} = useDialogControl<string>({ props });

const options = computed(() => control.value.uischema.options);
const minimum = computed(() =>
  options.value?.minimum ? new Date(options.value.minimum) : null,
);
const maximum = computed(() =>
  options.value?.maximum ? new Date(options.value.maximum) : null,
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <DateInput
      :id="labelForId"
      two-lines
      :model-value="new Date(control.data)"
      class="date-time"
      :required="true"
      :show-time="options?.showTime"
      :show-seconds="options?.showSeconds"
      :show-milliseconds="options?.showMilliseconds"
      :timezone="options?.timezone"
      :date-format="options?.dateFormat"
      :min="minimum"
      :max="maximum"
      :disabled="disabled"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
