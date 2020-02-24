<script>
/**
 * Displays a carousel where the user can scroll/swipe horizontally
 * with shadow borders indicating if there is content on the left or right which is scrollable
*/
let isMouseDown = false;
let wasDragged = false;
const scrollValueOffset = 5; // to prevent clicks not beeing bubbled to child by accident
let startX, scrollLeft, slider;

export default {
    data() {
        return {
            isMouseDown,
            wasDragged,
            scrollValueOffset,
            startX,
            scrollLeft,
            slider
        };
    },
    /**
   * following methods allow dragging via mouse
   */
    methods: {
        onMouseDown(e) {
            slider = this.$refs.carousel;
            isMouseDown = true;
            wasDragged = false;
            startX = e.pageX;
            scrollLeft = slider.scrollLeft;
        },
        onMouseEnd(e) {
            if (wasDragged) {
                e.preventDefault();
            }
            isMouseDown = false;
        },
        onMouseMove(e) {
            if (!isMouseDown) { return; }
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;
            if (Math.abs(walk) > scrollValueOffset || wasDragged) {
                wasDragged = true;
                slider.scrollLeft = scrollLeft - walk;
            }
        },
        onDragStart(e) {
            e.preventDefault();
        }
    }
};
</script>

<template>
  <div class="shadow-wrapper">
    <div
      ref="carousel"
      class="carousel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @click.capture="onMouseEnd"
      @mouseleave="onMouseEnd"
      @dragstart="onDragStart"
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
