<script>
import CodeExample from "./demo/CodeExample.vue";
import PlusButton from "webapps-common/ui/components/PlusButton.vue";
import PlusButtonCode from "webapps-common/ui/components/PlusButton.vue?raw";
import buttonCode from "webapps-common/ui/components/Button.vue?raw";

const codeExample = `
  <PlusButton title="Plus button"/>

  <PlusButton
    title="Plus button on dark"
    on-dark
    with-border
  />

  <PlusButton
    title="Primary plus button"
    primary
  />

  <PlusButton
    title="Primary plus button on dark"
    primary
    on-dark
  />

  <PlusButton
    title="Disabled plus button"
    primary
    disabled
  />
`;

export default {
  components: {
    PlusButton,
    CodeExample,
  },
  data() {
    return {
      PlusButtonCode,
      buttonCode,
      codeExample,
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div class="wrapper">
          <PlusButton title="Plus button" />
          <div class="background">
            <PlusButton
              title="Plus button on dark"
              :on-dark="true"
              with-border
            />
          </div>
          <PlusButton title="Primary plus button" primary />
          <div class="background">
            <PlusButton
              title="Primary plus button on dark"
              primary
              :on-dark="true"
            />
          </div>
          <PlusButton title="Disabled plus button" primary disabled />
        </div>
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show PlusButton.vue source code">{{
          PlusButtonCode
        }}</CodeExample>
        <CodeExample summary="Show Button.vue source code">{{
          buttonCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(5, max-content);
  gap: 20px;
  max-width: 100%;
  align-items: center;
  justify-items: center;

  @media only screen and (max-width: 900px) {
    grid-template-columns: repeat(1, max-content);
  }
}

.background {
  padding: 10px;
  background: var(--knime-masala);
}
</style>
