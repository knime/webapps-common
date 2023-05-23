<script>
import CodeExample from "./demo/CodeExample.vue";

const codeExample = `<h1>Headline 1</h1>
<h2>Headline 2</h2>
<h3>Headline 3</h3>
<h4>Headline 4</h4>
<h5>Headline 5</h5>
<h6>Headline 6</h6>
<!-- HTML does not know a h7 element, but we can use the following;
cf. https://www.w3.org/WAI/GL/wiki/Using_role%3Dheading#Example_2 -->
<div
  class="h7"
  role="heading"
  aria-level="7"
>
  Headline 7
</div>
`;

export default {
  components: {
    CodeExample,
  },
  data() {
    return {
      codeExample,
    };
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>There are seven pre-defined headline sizes. There is no need to use dedicated components.</p>
        </div>
      </div>
    </section>
    <section class="demo">
      <div class="grid-container">
        <div class="grid-item-12">
          <h1>Headline 1</h1>
          <h2>Headline 2</h2>
          <h3>Headline 3</h3>
          <h4>Headline 4</h4>
          <h5>Headline 5</h5>
          <h6>Headline 6</h6>
          <div class="h7" role="heading" aria-level="7">Headline 7</div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.demo {
  background: var(--knime-porcelain);

  & .grid-item-12 {
    padding-bottom: 2em;
  }
}
</style>
