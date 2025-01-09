<script setup lang="ts" generic="SettingValue">
import { computed, ref } from "vue";

import { Button } from "@knime/components";

import type { VueControlProps } from "../higherOrderComponents/control/types";
import inject from "../utils/inject";

import DynamicIcon, { type Icon } from "./DynamicIcon.vue";

const props = defineProps<VueControlProps<undefined>>();
const disabled = computed(() => !props.control.enabled);

const triggerId = computed(() => props.control.uischema.options!.triggerId);

const icon = computed<Icon | undefined>(
  () => props.control.uischema.options!.icon,
);

const trigger = inject("trigger");

const onClick = () => {
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
      :disabled="disabled"
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
  margin-bottom: 10px;
  position: relative;
  display: flex;
  place-content: center space-between;

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
