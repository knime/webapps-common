<script>
export default {
  name: "Tooltip",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="tooltip">
    <slot />
    <span v-if="text" class="text">{{ text }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.tooltip {
  position: relative;
}

.text {
  --arrow-size: 12px;

  /* positioning and styling */
  position: absolute;
  top: calc(var(--arrow-size) * -1);
  left: 50%;
  visibility: hidden;
  width: 1px;

  /* hide visually */
  height: 1px;
  padding: 6px 10px;
  overflow: hidden;
  font-size: 13px;
  color: var(--theme-tooltip-foreground-color);
  white-space: nowrap;
  pointer-events: none;
  background-color: var(--theme-tooltip-background-color);
  border-radius: 1px;
  box-shadow: var(--shadow-elevation-2);
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);

  /* arrow */
  &::after {
    position: absolute;
    bottom: 2px;
    left: 50%;
    z-index: -1;
    width: var(--arrow-size);
    height: var(--arrow-size);
    content: "";
    background-color: var(--theme-tooltip-background-color);
    transform: translate(-50%, 50%) rotate(135deg);
  }
}

@media (hover: hover) {
  .tooltip:hover > .text {
    visibility: visible;
    width: auto;

    /* show */
    height: auto;
    overflow: initial;

    /* other styles */
    opacity: 1;
    transition: opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1) 150ms;
  }

  .expanded:focus-within + .text {
    opacity: 0;

    /* hide the tooltip when the container has the 'expanded' class, e.g. for popovers */
    transition: opacity 150ms ease;
  }
}
</style>
