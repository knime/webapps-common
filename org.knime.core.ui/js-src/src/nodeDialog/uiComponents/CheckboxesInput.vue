<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { optionsMapper } from "../utils";
import Checkboxes from "webapps-common/ui/components/forms/Checkboxes.vue";
import useDialogControl from "../composables/useDialogControl";
import { IdAndText } from "../types/ChoicesUiSchema";
import LabeledInput from "./label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
const props = defineProps(rendererProps());
const {
  control,
  disabled,
  handleDirtyChange: onChange,
} = useDialogControl({ props });

const alignment = computed(
  () => control.value.uischema.options?.checkboxLayout,
);

const options = ref(null as null | IdAndText[]);
onMounted(() => {
  options.value = control.value.schema.anyOf?.map(optionsMapper)!;
});
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    :margin-bottom="10"
    @controlling-flow-variable-set="onChange"
  >
    <Checkboxes
      v-if="options"
      :id="labelForId"
      :possible-values="options"
      :alignment="alignment"
      :disabled="disabled"
      :model-value="control.data"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
