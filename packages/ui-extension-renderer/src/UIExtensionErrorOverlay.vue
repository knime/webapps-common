<script setup lang="ts">
import CloseIcon from "@knime/styles/img/icons/close.svg";
import type { ErrorAlert } from "@knime/ui-extension-service";

import Popover from "./Popover.vue";

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
    width: 40px;
    height: 40px;
    padding: 8px;
    border-radius: 50%;
    z-index: 2;
    overflow: visible;
    position: absolute;
    left: calc(50% - 20px);
    bottom: calc(50% - 20px);
    background-color: var(--theme-color-error);
    box-shadow: 0 0 10px 0 var(--knime-gray-dark-semi);
    cursor: pointer;

    & .icon {
      stroke-width: 4;
      stroke: white;
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
