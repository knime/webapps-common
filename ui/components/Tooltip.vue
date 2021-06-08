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
    <span class="text">{{ text }}</span>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.text {
  position: absolute;
  top: -12px; /* the height of the arrow */
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  visibility: hidden;
  opacity: 0;
  background-color: var(--knime-masala);
  white-space: nowrap;
  color: var(--knime-white);
  padding: 6px 10px;
  box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  border-radius: 1px;
  font-size: 13px;

  &::after {
    width: 12px;
    height: 12px;
    content: '';
    position: absolute;
    z-index: -1;
    left: 50%;
    background-color: var(--knime-masala);
    bottom: 2px;
    transform: translate(-50%, 50%) rotate(135deg);
  }
}

.tooltip {
  position: relative;
}

@media (hover: hover) {
  .tooltip:hover .text {
    visibility: visible;
    opacity: 1;
    transition: all 250ms cubic-bezier(0.215, 0.61, 0.355, 1) 150ms;
  }

  .tooltip:focus-within .text {
    transition-delay: 0ms;
    opacity: 0;
    visibility: hidden;
  }
}


</style>
