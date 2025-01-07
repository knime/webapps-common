<script lang="ts">
// (see the respective @InternalButtonReferenceId annotation in the backend)
export const ELEMENT_RESET_BUTTON_ID = "ElementResetButton";
</script>

<script setup lang="ts">
import { watch } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { FunctionButton, LoadingIcon } from "@knime/components";
import EditIcon from "@knime/styles/img/icons/pencil.svg";
import ResetIcon from "@knime/styles/img/icons/reset-all.svg";

import { useJsonFormsControlWithUpdate } from "../../composables/components/useJsonFormsControlWithUpdate";
import inject from "../../utils/inject";

const props = defineProps({
  ...rendererProps(),
  initialIsEdited: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const trigger = inject("trigger");

const { control, handleChange } = useJsonFormsControlWithUpdate(props);
const setEditing = () => handleChange(control.value.path, true);
const reset = async () => {
  await handleChange(control.value.path, false);
  trigger({ id: ELEMENT_RESET_BUTTON_ID });
};

watch(
  () => props.initialIsEdited,
  (initialIsEdited) => {
    if (initialIsEdited && !control.value.data) {
      setEditing();
    }
  },
);
</script>

<template>
  <FunctionButton v-if="isLoading" disabled>
    <LoadingIcon class="loading-icon" />
  </FunctionButton>
  <template v-else>
    <FunctionButton v-if="!control.data" title="Edit" @click="setEditing">
      <EditIcon />
    </FunctionButton>
    <FunctionButton v-else title="Reset to default" @click="reset">
      <ResetIcon />
    </FunctionButton>
  </template>
</template>

<style lang="postcss" scoped>
.loading-icon {
  width: 14px;
  height: 14px;
}
</style>
