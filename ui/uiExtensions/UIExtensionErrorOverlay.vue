<script setup lang="ts">
import Popover from "./Popover.vue";
import CloseIcon from "../assets/img/icons/close.svg";

/**
 * This is the local alert/error management component created for use with the NodeViewIFrame. Its main use is to
 * replace the native browser `alert`. It is composed of a full screen overlay which blocks mouse events and an
 * icon with a tooltip to show more details. When active, this component uses a @see Popover to cover 100% of the
 * parent container. If parent container lacks dimensions, you must assign a min-width/height conditionally when
 * this component is active for proper display.
 */

type Props = {
  active?: boolean;
};

withDefaults(defineProps<Props>(), {
  active: false,
});

const emit = defineEmits<{
  showError: [];
}>();
</script>

<template>
  <Popover
    :active="active"
    :class="['node-popover', { active }]"
    :type="'error'"
  >
    <template #popoverContent>
      <div
        class="error-wrapper"
        title="Click to see more details."
        @click="emit('showError')"
      >
        <CloseIcon class="icon" />
      </div>
    </template>
  </Popover>
</template>

<style lang="postcss" scoped>
.node-popover {
  pointer-events: none;

  &.active {
    pointer-events: all;
  }

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
