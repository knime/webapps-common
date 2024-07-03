<script setup lang="ts">
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { computed, ref, watchEffect } from "vue";
import type FlowVariableExposerProps from "../types/FlowVariableExposerProps";
import ErrorMessage from "../../ErrorMessage.vue";
import useExposedFlowVariable from "../composables/useExposedFlowVariable";

const props = defineProps<FlowVariableExposerProps>();
const { setExposedFlowVariable, exposedFlowVariableName } =
  useExposedFlowVariable();

const modelValue = ref("");
watchEffect(() => {
  if (exposedFlowVariableName.value === "" && modelValue.value.trim() === "") {
    return;
  }
  modelValue.value = exposedFlowVariableName.value;
});

const isValid = computed(
  () => modelValue.value === "" || Boolean(modelValue.value.trim()),
);

const onUpdate = (value: string) => {
  modelValue.value = value;
  setExposedFlowVariable({
    path: props.persistPath,
    flowVariableName: value,
  });
};

const ariaLabel = computed(
  () => `outputted-flow-variable-${props.persistPath}`,
);
</script>

<!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
<template>
  <InputField
    :id="id"
    :ariaLabel="ariaLabel"
    :model-value="modelValue"
    :is-valid="isValid"
    placeholder="No flow variable set"
    @update:model-value="onUpdate"
  />
  <ErrorMessage
    v-if="!isValid"
    class="error"
    :errors="[{ message: 'Flow variable name must not be blank.' }]"
  />
</template>

<style scoped>
.error {
  display: block; /* TODO: Revert with UIEXT-140 */
}
</style>
