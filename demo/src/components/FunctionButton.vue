<script>
import CodeExample from "./demo/CodeExample.vue";
import { FunctionButton } from "@knime/components";
// import functionButtonCode from "webapps-common/ui/components/FunctionButton.vue?raw";
const functionButtonCode = "";
// import baseButtonCode from "webapps-common/ui/components/BaseButton.vue?raw";
const baseButtonCode = "";
import MenuOptionsIcon from "@knime/styles/img/icons/menu-options.svg";
import LensIcon from "@knime/styles/img/icons/lens.svg";
import SorterIcon from "@knime/styles/img/icons/arrows-order.svg";

const codeExample = `
  <FunctionButton :active="active1">
    <LensIcon />
    <span>Function</span>
  </FunctionButton>

  <FunctionButton :active="active2">
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton :active="active3">
    <span>Sorter</span>
    <SorterIcon />
  </FunctionButton>

  <FunctionButton primary>
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton disabled>
    <span>Disabled Function</span>
    <SorterIcon />
  </FunctionButton>
`;

export default {
  components: {
    FunctionButton,
    MenuOptionsIcon,
    LensIcon,
    SorterIcon,
    CodeExample,
  },
  data() {
    return {
      functionButtonCode,
      baseButtonCode,
      codeExample,
      active1: false,
      active2: false,
      active3: false,
      subMenuItems: [
        {
          href: "https://apple.com",
          text: "Apples",
        },
        {
          href: "https://en.wikipedia.org/wiki/Orange_(colour)",
          text: "Oranges",
        },
        {
          to: "/testing-nuxt-link",
          text: "Ananas",
        },
      ],
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          The function button is a button with an optional active state, e.g.
          when a dropdown menu is expanded and can also be disabled.
        </p>
        <p>
          Its primary use is together with the SubMenu component where it is
          included, but can also be used standalone. Works with an icon &amp;
          text combination or a single icon.
        </p>
        <div class="align-horizontal">
          <FunctionButton :active="active1" @click="active1 = !active1">
            <LensIcon />
            <span>Function</span>
          </FunctionButton>

          <FunctionButton :active="active2" @click="active2 = !active2">
            <MenuOptionsIcon />
          </FunctionButton>

          <FunctionButton :active="active3" @click="active3 = !active3">
            <span>Function</span>
            <SorterIcon />
          </FunctionButton>
          <FunctionButton primary>
            <MenuOptionsIcon />
          </FunctionButton>
          <FunctionButton disabled>
            <span>Disabled Function</span>
            <SorterIcon />
          </FunctionButton>
        </div>

        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show FunctionButton.vue source code">{{
          functionButtonCode
        }}</CodeExample>
        <CodeExample summary="Show BaseButton.vue source code">{{
          baseButtonCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.align-horizontal {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
