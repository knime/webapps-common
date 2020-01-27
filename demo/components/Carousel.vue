<script>
import CodeExample from './demo/CodeExample';
import Carousel from '../../ui/components/Carousel';
import carouselCode from '!!raw-loader!../../ui/components/Carousel';

const codeExample = `<Carousel shadow-color="white">
    <Statistics />
</Carousel>`;

export default {
    components: {
        Carousel,
        CodeExample
    },
    data() {
        return {
            carouselCode,
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Carousel</h2>
        <p>**DISCLAIMER** Only intended to work for smaller devices or viewports!</p>
        <p>
          The carousel can fit items of any size and creates shadows on each side of the viewport to
          indicate that scrolling is possible.
        </p>
        <p>
          When one side of the items inside of the carousel is reached
          the shadow will disappear.
        </p>
        <p>
          The color of the shadow can be adjusted to the background
          by using the "shadowColor"-prop. Currently the supported colors are: white and porcelain.
        </p>
        <p>The default value of the "shadowColor"-prop is 'porcelain'.</p>
        <Carousel shadow-color="white">
          <div class="wrapper">
            <div class="card card1" />
            <div class="card card2" />
            <div class="card card3" />
          </div>
        </Carousel>
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Carousel.vue source code">{{ carouselCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  display: flex;
  flex-wrap: nowrap;
}

.card {
  min-width: 350px;
  height: 200px;
  margin: 10px;
}

.card1 {
  background-color: var(--theme-color-dove-gray);
}

.card2 {
  background-color: var(--theme-color-gray-dark-semi);
}

.card3 {
  background-color: var(--theme-color-masala);
}
</style>
