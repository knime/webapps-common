<script setup lang="ts">
import { LoadingIcon, FunctionButton } from "@knime/components";
import EditIcon from "@knime/styles/img/icons/pencil.svg";
import ResetIcon from "@knime/styles/img/icons/reset-all.svg";
import { rendererProps } from "@jsonforms/vue";
import { useJsonFormsControlWithUpdate } from "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate";
import inject from "@/nodeDialog/utils/inject";
import { onMounted, ref } from "vue";

const props = defineProps(rendererProps());

const isTriggerActive = inject("isTriggerActive");
const trigger = inject("trigger");

const ELEMENT_RESET_BUTTON_ID = "ElementResetButton"; // (see the respective @InternalButtonReferenceId annotation in the backend)

const { control, handleChange } = useJsonFormsControlWithUpdate(props);
const setEditing = () => handleChange(control.value.path, true);
const reset = async () => {
  await handleChange(control.value.path, false);
  trigger({ id: ELEMENT_RESET_BUTTON_ID });
};

const isLoading = ref(false);
const MILLISECONDS_UNTIL_LOADING = 200;

onMounted(async () => {
  let resultAvailable = false;
  setTimeout(() => {
    if (!resultAvailable) {
      isLoading.value = true;
    }
  }, MILLISECONDS_UNTIL_LOADING);
  const resetPossible = await isTriggerActive({ id: ELEMENT_RESET_BUTTON_ID });
  if (resetPossible.state !== "SUCCESS" || resetPossible.result) {
    setEditing();
  }
  resultAvailable = true;
  isLoading.value = false;
});
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
