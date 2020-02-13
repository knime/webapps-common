<script>
/**
 * Displays a carousel where the user can scroll/swipe horizontally
 * with shadow borders indicating if there is content on the left or right which is scrollable
*/
let isDown = false;
let wasDragged = false;
const scrollValueOffset = 5; // to prevent clicks not beeing bubbled to child by accident
let startX, scrollLeft, slider;

export default {
  /**
   * following methods allow dragging via mouse
   */
    methods: {
        onMouseDown(e) {
            slider = this.$el.querySelector('.carousel');
            isDown = true;
            wasDragged = false;
            startX = e.pageX;
            scrollLeft = slider.scrollLeft;
        },
        onMouseEnd(e) {
            if (wasDragged) {
                e.preventDefault();
            }
            isDown = false;
        },
        onMouseMove(e) {
            if (!isDown) { return; }
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            if (Math.abs(walk) > scrollValueOffset || wasDragged) {
                wasDragged = true;
                slider.scrollLeft = scrollLeft - walk;
            }


        }
    }
};
</script>

<template>
  <div class="shadow-wrapper">
    <div
      class="carousel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @click.capture="onMouseEnd"
      @mouseleave="onMouseEnd"
    >
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
