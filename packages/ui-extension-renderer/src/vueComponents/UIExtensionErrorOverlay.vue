<script setup lang="ts">
import CloseIcon from "@knime/styles/img/icons/close.svg";

import Popover from "./Popover.vue";
import type { ErrorAlert } from "./types";

/**
 * This is the local alert/error management component created for use with the NodeViewIFrame. Its main use is to
 * replace the native browser `alert`. It is composed of a full screen overlay which blocks mouse events and an
 * icon with a tooltip to show more details. When active, this component uses a @see Popover to cover 100% of the
 * parent container. If parent container lacks dimensions, you must assign a min-width/height conditionally when
 * this component is active for proper display.
 */

type Props = {
  alert: ErrorAlert | null;
};

defineProps<Props>();

const emit = defineEmits<{
  display: [ErrorAlert];
}>();
</script>

<template>
  <Popover
    v-if="alert"
    active
    :class="['node-popover', { active: alert }]"
    :type="'error'"
  >
    <template #popoverContent>
      <div
        class="error-wrapper"
        title="Click to see more details."
        @click="emit('display', alert)"
      >
        <CloseIcon class="icon" />
      </div>
    </template>
  </Popover>
</template>

<style lang="postcss" scoped>
.node-popover {
  & .error-wrapper {
    position: absolute;
    bottom: calc(50% - 20px);
    left: calc(50% - 20px);
    z-index: 2;
    width: 40px;
    height: 40px;
    padding: 8px;
    overflow: visible;
    cursor: pointer;
    background-color: var(--theme-color-error);
    border-radius: 50%;
    box-shadow: 0 0 10px 0 var(--knime-gray-dark-semi);

    & .icon {
      stroke: white;
      stroke-width: 4;
    }

    &:hover {
      background-color: white;

      & .icon {
        stroke: var(--theme-color-error);
      }
    }

    &:focus {
      background-color: white;
    }
  }
}
</style>
