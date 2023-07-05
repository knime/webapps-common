<script>
/*
 * Expandable sideDrawer component displaying arbitrary components as content.
 */

export default {
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <Transition name="slide">
    <div v-if="isExpanded" class="side-drawer">
      <div class="content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(
    calc(100% + 10px)
  ); /* extra 10px to hide box shadow when collapsed */
}

.side-drawer {
  position: fixed;
  top: 0;
  width: 500px;
  right: 0;
  bottom: 0;
  box-shadow: -3px 0 7px 0 var(--knime-gray-dark-semi);
  background: var(--knime-porcelain);
  z-index: var(--z-index-common-side-drawer, 60);

  @media only screen and (width <= 900px) {
    z-index: var(--z-index-common-mobile-side-drawer, 60);
  }

  & .content {
    height: 100%;
  }

  @media only screen and (width <= 900px) {
    width: 100%;
  }
}
</style>
