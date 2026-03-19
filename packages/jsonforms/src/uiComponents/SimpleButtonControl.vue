<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { KdsButton } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";
import inject from "../utils/inject";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type ReloadIcon = "reload";

const props = defineProps<VueControlProps<undefined>>();
const disabled = computed(() => !props.control.enabled);

const providedOptions = props.control.uischema.providedOptions;

const running = ref(false);
const uischema = computed(
  () =>
    props.control.uischema as UiSchemaWithProvidedOptions<{
      triggerId: string;
      icon?: ReloadIcon;
      runFinished?: string;
    }>,
);

const disableOnClick =
  providedOptions && providedOptions.includes("runFinished");
if (disableOnClick) {
  const runFinishedUuid = useProvidedState(uischema, "runFinished", null);
  watch(runFinishedUuid, () => {
    running.value = false;
  });
}
const disabledOrRunning = computed(() => disabled.value || running.value);
const triggerId = computed(() => uischema.value.options!.triggerId);

const icon = computed<ReloadIcon | undefined>(
  () => uischema.value.options!.icon,
);

const trigger = inject("trigger");

const onClick = () => {
  if (disableOnClick) {
    running.value = true;
  }
  trigger({ id: triggerId.value });
};
const hover = ref(false);
</script>

<template>
  <div
    class="simple-button-input"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <KdsButton
      variant="outlined"
      :disabled="disabledOrRunning"
      class="button-input"
      :label="control.label"
      :leading-icon="icon"
      @click="onClick"
    />
    <slot name="buttons" :hover="hover" />
  </div>
</template>

<style scoped>
.simple-button-input {
  position: relative;
  display: flex;
  place-content: center space-between;
  margin-bottom: var(--kds-spacing-container-0-5x);

  & .button-input {
    min-width: 100px;
    text-align: center;
  }
}
</style>
