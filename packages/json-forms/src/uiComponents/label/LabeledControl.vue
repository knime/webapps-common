<script setup lang="ts">
import DialogComponentWrapper from "../DialogComponentWrapper.vue";
import DialogLabel from "./DialogLabel.vue";
import { toRefs } from "vue";
import { useTriggersReexecution } from "../../composables/components/useDialogControl";
import type Control from "../../types/Control";

const props = withDefaults(
  defineProps<{
    control: Control;
    marginBottom?: number;
    show?: boolean;
    fill?: boolean;
  }>(),
  {
    marginBottom: 0,
    show: true,
    fill: false,
  },
);
const { control } = toRefs(props);

defineEmits<{
  controllingFlowVariableSet: [value: any];
}>();

const triggersReexecution = useTriggersReexecution(control);
</script>

<template>
  <DialogComponentWrapper
    :control="control"
    :class="{ fill }"
    :style="{ marginBottom: `${marginBottom}px` }"
  >
    <DialogLabel
      :class="{ fill }"
      :title="control.label"
      :show-reexecution-icon="triggersReexecution"
      :description="control.description"
      :errors="[control.errors]"
      :show="show"
      @controlling-flow-variable-set="
        (event) => $emit('controllingFlowVariableSet', event)
      "
    >
      <template #default="{ labelForId }">
        <slot :label-for-id="labelForId" />
      </template>
      <template #before-label>
        <slot name="before-label" />
      </template>
    </DialogLabel>
  </DialogComponentWrapper>
</template>

<style scoped>
.fill {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
