<script lang="ts">
import { defineComponent } from "vue";
/**
 * Displays shadows on both sides of a carousel
 * indicate content being hidden which can be scrolled to
 */
const scrollThreshold = 5; // to prevent clicks not being bubbled to child by accident
let startX: number, scrollLeft: number, slider: HTMLDivElement;

export default defineComponent({
  props: {
    tabindex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isMouseDown: false,
      wasDragged: false,
    };
  },
  /**
   * following methods allow dragging via mouse
   */
  methods: {
    onMouseDown(e: MouseEvent) {
      slider = this.$refs.carousel as HTMLDivElement;
      this.isMouseDown = true;
      this.wasDragged = false;
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    },
    onMouseEnd(e: MouseEvent) {
      if (this.wasDragged) {
        e.preventDefault();
      }
      this.isMouseDown = false;
    },
    onMouseMove(e: MouseEvent) {
      if (!this.isMouseDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX;
      const walk = x - startX;
      if (this.wasDragged || Math.abs(walk) > scrollThreshold) {
        this.wasDragged = true;
        slider.scrollLeft = scrollLeft - walk;
      }
    },
    onDragStart(e: MouseEvent) {
      e.preventDefault();
    },
  },
});
</script>

<template>
  <div class="shadow-wrapper">
    <div
      ref="carousel"
      class="carousel"
      :class="{ 'is-mouse-down': isMouseDown }"
      :tabindex="tabindex"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseEnd"
      @click.capture="onMouseEnd"
      @mouseleave="onMouseEnd"
      @dragstart="onDragStart"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.shadow-wrapper {
  position: relative;
  isolation: isolate;
  margin-left: calc(var(--grid-gap-width) * -1);
  margin-right: calc(var(--grid-gap-width) * -1);

  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    height: 100%;
    width: 12px;
    top: 0;
    z-index: 2; /* shadows should be on top of the content */
  }

  &::before {
    left: 0;
    background-image: linear-gradient(
      270deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-porcelain) 100%
    );
  }

  &::after {
    right: 0;
    background-image: linear-gradient(
      90deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-porcelain) 100%
    );
  }
}

.carousel {
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none; /* needed to hide scroll bar in edge */
  scrollbar-width: none; /* for firefox */
  padding-left: var(--grid-gap-width);
  padding-right: var(--grid-gap-width);
  user-select: none;

  &.is-mouse-down {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
