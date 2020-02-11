<script>
/**
 * Displays shadows on both sides of a carousel
 * indicate content beeing hidden which can be scrolled to
*/
export default {
    props: {
        /**
       * Switches the color of the shadows on the sides
       * should match background color of parent
       *
       * currently possible values: porcelain(default), white
       */
        backgroundColor: {
            type: String,
            default: 'porcelain',
            validator(backgroundColor = 'porcelain') {
                return ['porcelain', 'white'].includes(backgroundColor);
            }
        }
    }
};
</script>

<template>
  <section :class="{'white': backgroundColor==='white'}">
    <slot />
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

@media only screen and (max-width: 1180px) {
  section {
    position: relative;
    padding: 0 var(--grid-gap-width);
    background: var(--theme-color-porcelain);
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      display: block;
      height: 100%;
      width: 12px;
      left: calc(var(--grid-gap-width) - 10px);
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
      right: var(--grid-gap-width);
      top: 0;
      z-index: 2;
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-porcelain) 100%);
    }
  }

  .white {
    background: var(--theme-color-white);

    &::before {
      background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-white) 100%);
    }

    &::after {
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--theme-color-white) 100%);
    }
  }
}

@media only screen and (max-width: 900px) {
  section {
    padding: 0;

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
}
</style>
