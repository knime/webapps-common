<script>
import { createPopper } from '@popperjs/core';

const availablePositions = [
    'top-start', 'top', 'top-end',
    'right-start', 'right', 'right-end',
    'bottom-start', 'bottom', 'bottom-end',
    'left-start', 'left', 'left-end'
];
const popperPadding = 8;
const popperOffset = 12;

export default {
    props: {
        text: {
            type: String,
            required: true
        },
        placement: {
            type: String,
            default: 'top',
            validator(value) {
                return availablePositions.includes(value);
            }
        }
    },
    methods: {
        initPopper() {
            createPopper(this.$refs.slot, this.$refs.text, {
                placement: this.placement,
                modifiers: [{
                    name: 'preventOverflow',
                    options: {
                        padding: popperPadding
                    }
                }, {
                    name: 'offset',
                    options: {
                        offset: [0, popperOffset]
                    }
                }]
            });
        }
    }
};
</script>

<template>
  <div
    class="tooltip"
    @mouseenter="initPopper"
  >
    <div ref="slot">
      <slot />
    </div>
    <div
      ref="text"
      class="text"
    >
      {{ text }}
      <div
        id="arrow"
        data-popper-arrow
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tooltip {
  position: relative;
}

.text {
  --arrow-size: 12px;

  /* hide visually */
  height: 1px;
  width: 1px;
  visibility: hidden;
  overflow: hidden;

  /* positioning and styling */
  position: absolute;
  opacity: 0;
  background-color: var(--theme-tooltip-background-color);
  white-space: nowrap;
  color: var(--theme-tooltip-foreground-color);
  padding: 6px 10px;
  box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  border-radius: 1px;
  font-size: 13px;
  pointer-events: none;

  /* arrow */
  & #arrow,
  & #arrow::before {
    position: absolute;
    width: var(--arrow-size);
    height: var(--arrow-size);
    z-index: -1;
    background-color: var(--theme-tooltip-background-color);
  }

  & #arrow {
    visibility: hidden;
  }

  & #arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: calc(var(--arrow-size) * -.5);
  }

  &[data-popper-placement^='bottom'] > #arrow {
    top: calc(var(--arrow-size) * -.5);
  }

  &[data-popper-placement^='left'] > #arrow {
    right: calc(var(--arrow-size) * -.5);
  }

  &[data-popper-placement^='right'] > #arrow {
    left: calc(var(--arrow-size) * -.5);
  }
}

@media (hover: hover) {
  .tooltip:hover > .text {
    /* show */
    height: auto;
    width: auto;
    visibility: visible;
    overflow: initial;

    /* other styles */
    opacity: 1;
    transition: opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1) 150ms;
  }

  .expanded:focus-within + .text {
    /* hide the tooltip when the container has the 'expanded' class, e.g. for popovers */
    transition: opacity 150ms ease;
    opacity: 0;
  }
}
</style>
