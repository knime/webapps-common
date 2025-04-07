<script lang="ts">
/**
 * Expandable sideDrawer component displaying arbitrary components as content.
 */
export default {};

export type StyleOverrides = {
  position: "fixed" | "absolute";
  width: string;
  backgroundColor: string;
};

const DEFAULT_STYLES = {
  position: "fixed",
  width: "500px",
  backgroundColor: "var(--knime-porcelain)",
} as const;
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isExpanded?: boolean;
    styleOverrides?: Partial<StyleOverrides>;
  }>(),
  {
    isExpanded: false,
    styleOverrides: () => ({
      ...DEFAULT_STYLES,
    }),
  },
);
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isExpanded"
      class="side-drawer"
      :style="{
        '--position-common-side-drawer':
          styleOverrides.position ?? DEFAULT_STYLES.position,
        '--width-common-side-drawer':
          styleOverrides.width ?? DEFAULT_STYLES.width,
        '--background-color-common-side-drawer':
          styleOverrides.backgroundColor ?? DEFAULT_STYLES.backgroundColor,
      }"
    >
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
  position: var(--position-common-side-drawer, fixed);
  top: 0;
  width: var(--width-common-side-drawer, 500px);
  right: 0;
  bottom: 0;
  box-shadow: -3px 0 7px 0 var(--knime-gray-dark-semi);
  background: var(
    --background-color-common-side-drawer,
    var(--knime-porcelain)
  );
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
