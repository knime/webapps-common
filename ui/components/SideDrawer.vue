<script>
/*
 * Expandable sideDrawer component displaying arbitrary components as content.
 */

export default {
    props: {
        isExpanded: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
  <transition name="slide">
    <div
      v-if="isExpanded"
      class="sideDrawer"
    >
      <div class="content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<style lang="postcss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease-in-out;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(calc(100% + 10px)); /* extra 10px to hide box shadow when collapsed */
}

.sideDrawer {
  position: fixed;
  top: 0;
  width: 500px;
  right: 0;
  bottom: 0;
  box-shadow: -3px 0 7px 0 var(--knime-gray-dark-semi);
  background: var(--knime-porcelain);
  z-index: var(--z-index-common-side-drawer, 60);

  @media only screen and (max-width: 900px) {
    z-index: var(--z-index-common-mobile-side-drawer, 60);
  }

  & .content {
    height: 100%;
  }

  @media only screen and (max-width: 900px) {
    width: 100%;
  }
}
</style>
