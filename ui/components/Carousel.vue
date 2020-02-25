<script>
/**
 * Displays shadows on both sides of a carousel
 * indicate content beeing hidden which can be scrolled to
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
