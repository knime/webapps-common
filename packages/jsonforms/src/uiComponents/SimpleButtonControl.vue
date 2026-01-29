<script setup lang="ts" generic="SettingValue">
import { computed, ref, watch } from "vue";

import { Button } from "@knime/components";

import type { VueControlProps } from "../higherOrderComponents/control/types";
import inject from "../utils/inject";

import DynamicIcon, { type Icon } from "./DynamicIcon.vue";
import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

const props = defineProps<VueControlProps<undefined>>();
const disabled = computed(() => !props.control.enabled);

const providedOptions = props.control.uischema.providedOptions;

const running = ref(false);
const uischema = computed(
  () =>
    props.control.uischema as UiSchemaWithProvidedOptions<{
      triggerId: string;
      icon?: Icon;
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

const icon = computed<Icon | undefined>(() => uischema.value.options!.icon);

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
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <Button
      compact
      with-border
      :disabled="disabledOrRunning"
      class="button-input"
      @click="onClick"
    >
      <DynamicIcon v-if="icon" :icon="icon" />{{ control.label }}
    </Button>
    <slot name="buttons" :hover="hover" />
  </div>
</template>

<style scoped>
.simple-button-input {
  position: relative;
  display: flex;
  place-content: center space-between;
  margin-bottom: 10px;

  & .button-input {
    min-width: 100px;
    text-align: center;
  }

  & .button-input-text {
    width: 100%;
  }
}

svg {
  height: 18px;
}
</style>
