<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }
};
</script>

<template>
  <div class="tooltip">
    <slot />
    <span
      v-if="text"
      class="text"
    >{{ text }}</span>
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
  top: calc(var(--arrow-size) * -1);
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
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
  &::after {
    width: var(--arrow-size);
    height: var(--arrow-size);
    content: "";
    position: absolute;
    z-index: -1;
    left: 50%;
    background-color: var(--theme-tooltip-background-color);
    bottom: 2px;
    transform: translate(-50%, 50%) rotate(135deg);
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
