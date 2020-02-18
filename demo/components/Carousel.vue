<script>
import CodeExample from './demo/CodeExample';
import Carousel from '../../ui/components/Carousel';
import CarouselSection from '../../ui/components/CarouselSection';
import carouselCode from '!!raw-loader!../../ui/components/Carousel';
import carouselSectionCode from '!!raw-loader!../../ui/components/CarouselSection';

const codeExample = `<CarouselSection background-color="white">
  <Carousel>
      <Statistics class="wrapper" />
  </Carousel>
</CarouselSection>

<style>
  .wrapper {
    display: inline-flex; // or inline-block
    padding-left: 20px;
    margin-left: -20px; // values might need to be adjusted according to content
</style>`;

export default {
    components: {
        Carousel,
        CarouselSection,
        CodeExample
    },
    data() {
        return {
            carouselCode,
            carouselSectionCode,
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Carousel & CarouselSection</h2>
        <p>
          The carousel can fit items of any size and combined with a CarouselSection wrapped around creates shadows on
          each side of the viewport to indicate that scrolling is possible. When one side of the items inside of the
          carousel is reached the shadow should disappear.
        </p>
        <p>
          The color of the shadow can be adjusted to the background
          by using the "backgroundColor"-prop. Currently the supported colors are: white and porcelain(default).
        </p>
        <p>
          See usage example for CSS adjustments.
        </p>
        <CarouselSection background-color="white">
          <Carousel>
            <div class="wrapper">
              <div class="card card1" />
              <div class="card card2" />
              <div class="card card3" />
              <div class="card card1" />
              <div class="card card2" />
              <div class="card card3" />
            </div>
          </Carousel>
        </CarouselSection>
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Carousel.vue source code">{{ carouselCode }}</CodeExample>
        <CodeExample summary="Show CarouselSection.vue source code">{{ carouselSectionCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  display: inline-flex;
  flex-wrap: nowrap;
  margin-left: -20px;
  padding-left: 20px;

  & div:last-child {
    margin-right: 22px;
  }
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
