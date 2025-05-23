<script setup lang="ts">
import { toRef } from "vue";

import ArrowDropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";

import { useIconFlipper } from "../../composables/useIconFlipper";
import FunctionButton from "../Buttons/FunctionButton.vue";
import ExpandTransition from "../transitions/ExpandTransition.vue";

type Props = {
  title: string;
  modelValue?: boolean;
  collapsible?: boolean;
  closeable?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  collapsible: true,
  closeable: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const { iconFlipStyles } = useIconFlipper({
  active: toRef(props, "modelValue"),
  initialRotation: "180deg",
});
</script>

<template>
  <div class="collapsible-panel">
    <div class="title-bar">
      <slot name="title-icon" />
      {{ title }}
      <div class="actions">
        <FunctionButton v-if="collapsible" compact>
          <ArrowDropdownIcon
            :style="{ ...iconFlipStyles }"
            @click="emit('update:modelValue', !modelValue)"
          />
        </FunctionButton>

        <FunctionButton v-if="closeable" compact>
          <CloseIcon @click="emit('close')" />
        </FunctionButton>
      </div>
    </div>

    <ExpandTransition :is-expanded="modelValue" speed="0.2s">
      <slot />
    </ExpandTransition>
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.collapsible-panel {
  box-shadow: var(--shadow-elevation-2);
  border-radius: 4px;
  background: var(--knime-white);

  & .title-bar {
    display: flex;
    align-items: center;
    padding: var(--space-8) var(--space-16);
    border-bottom: 1px solid var(--knime-porcelain);
    height: 40px;
    font-size: 13px;
    font-weight: 700;

    & .actions {
      display: flex;
      align-items: center;
      margin-left: auto;
      gap: var(--space-4);
    }
  }
}
</style>
