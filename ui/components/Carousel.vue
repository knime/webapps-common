<script>
/**
 * ***Disclaimer*** Carousel only for responsive design
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
    mounted() {
        this.toggleShadow();

        let debounce = function (func, wait, immediate, ...args) {
            let timeout;
            return function () {
                let later = function () {
                    timeout = null;
                    /* eslint-disable-next-line no-invalid-this */
                    if (!immediate) { func.apply(this, args); }
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                /* eslint-disable-next-line no-invalid-this */
                if (callNow) { func.apply(this, args); }
            };
        };
        /* eslint-disable-next-line no-magic-numbers */
        window.addEventListener('resize', debounce(this.toggleShadow, 250, true));
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
      :class="[{ 'active': shadow.right }, 'shadow-right', {'white': shadowColor==='white'}]"
    />
    <span
      :class="[{ 'active': shadow.left }, 'shadow-left', {'white': shadowColor==='white'}]"
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
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-porcelain) 100%);
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

    & .white {
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-white) 100%);
    }
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

  .carousel > >>> .wrapper {
    position: unset;
  }
}
</style>
