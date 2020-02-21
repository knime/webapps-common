<script>
/**
 * Displays shadows on both sides of a carousel
 * indicate content beeing hidden which can be scrolled to
*/
export default {
};
</script>

<template>
  <div class="shadow-wrapper">
    <div class="carousel">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.shadow-wrapper {
  position: relative;
  margin-left: calc(var(--grid-gap-width) * -1);
  margin-right: calc(var(--grid-gap-width) * -1);

  &::before {
    content: "";
    position: absolute;
    display: block;
    height: 100%;
    width: 12px;
    left: 0;
    top: 0;
    z-index: 2;
    background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-porcelain) 100%);
  }

  &::after {
    content: "";
    position: absolute;
    display: block;
    height: 100%;
    width: 12px;
    right: 0;
    top: 0;
    z-index: 2;
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-porcelain) 100%);
  }
}

.carousel {
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* needed to hide scroll bar in edge */
  scrollbar-width: none; /* for firefox */
  padding-left: var(--grid-gap-width);
  padding-right: var(--grid-gap-width);

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
