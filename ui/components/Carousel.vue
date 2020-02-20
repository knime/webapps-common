<script>
/**
 * Displays a carousel where the user can scroll/swipe horizontally
 * with shadow borders indicating if there is content on the left or right which is scrollable
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
}

.carousel {
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* needed to hide scroll bar in edge */
  scrollbar-width: none; /* for firefox */

  &::-webkit-scrollbar {
    display: none;
  }
}

@media only screen and (max-width: 1180px) and (min-width: 901px) {
  .carousel {
    margin-left: -10px;
  }
}
</style>
