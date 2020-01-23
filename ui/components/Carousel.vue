<script>
/**
 * ***ATTENTION*** Carousel only for responsive design
*/
export default {
    props: {
        shadowColor: {
            type: String,
            default: 'porcelain'
        }
    },
    data() {
        return {
            shadow: {
                right: false,
                left: false
            }
        };
    },
    computed: {
        shadowStyle() {
            return `background-image: linear-gradient(90deg, transparent 0%,\
            var(--theme-color-${this.shadowColor}) 100%);`;
        }
    },
    mounted() {
        this.toggleShadow();
    },
    methods: {
        toggleShadow(event) {
            let hasHorizontalScrollbar =
              this.$refs.scrollContainer.clientWidth < this.$refs.scrollContainer.scrollWidth;
            let scrolledFromLeft = this.$refs.scrollContainer.offsetWidth + this.$refs.scrollContainer.scrollLeft;
            let scrolledToRight = scrolledFromLeft >= this.$refs.scrollContainer.scrollWidth;
            let scrolledToLeft = this.$refs.scrollContainer.scrollLeft === 0;

            this.shadow.right = hasHorizontalScrollbar && !scrolledToRight;
            this.shadow.left = hasHorizontalScrollbar && !scrolledToLeft;
        }
    }
};
</script>

<template>
  <div class="shadow-wrapper">
    <span
      :class="[{ 'active': shadow.right }, 'shadow-right']"
      :style="shadowStyle"
    />
    <span
      :class="[{ 'active': shadow.left }, 'shadow-left']"
      :style="shadowStyle"
    />
    <div
      ref="scrollContainer"
      class="carousel"
      @scroll.passive="toggleShadow"
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

.shadow-left,
.shadow-right {
  transition: opacity 0.4s;
}

@media only screen and (max-width: 1180px) {
  .carousel {
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none; /* needed to hide scroll bar in edge */
    scrollbar-width: none; /* for firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .carousel > >>> .wrapper {
    position: unset;
  }

  .shadow-wrapper {
    & .shadow-right,
    & .shadow-left {
      position: absolute;
      pointer-events: none;
      top: 0;
      bottom: 0;
      width: 20px;
      z-index: 2;
      opacity: 0;
    }

    & .shadow-right {
      right: 0;
    }

    & .shadow-left {
      left: 0;
      transform: rotate(180deg);
    }

    & .active {
      opacity: 1;
    }
  }
}
</style>
