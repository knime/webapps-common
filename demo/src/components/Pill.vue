<script setup lang="ts">
import { Pill } from "@knime/components";
import ActivityIcon from "@knime/styles/img/icons/activity.svg";
import Success from "@knime/styles/img/icons/circle-check.svg";
import Close from "@knime/styles/img/icons/circle-close.svg";
import CircleWarning from "@knime/styles/img/icons/circle-warning.svg";
import Rocket from "@knime/styles/img/icons/rocket.svg";
import Warning from "@knime/styles/img/icons/sign-warning.svg";
// import pillComponentCode from "webapps-common/ui/components/Pill.vue?raw";
const pillComponentCode = "";

const codeExample = `<Pill>Hello World</Pill>
`;
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>A pill to indicate some special information</p>

        <div class="examples">
          <i class="node">
            The dashed containers are just to make the pill visible
          </i>
          <br />
          <div class="default-wrapper">
            <span>Default style:</span>
            <Pill>Hello World</Pill>
          </div>
          <div class="white">
            <span>With white color variant</span>
            <Pill variant="Muted">Hello White World</Pill>
          </div>
          <div class="default-wrapper">
            <span>The content can be whatever you need:</span>
            <Pill
              ><ActivityIcon /><b>Hello <i>WORLD</i></b></Pill
            >
          </div>
          <div class="default-wrapper">
            <span>Success variant</span>
            <Pill variant="Success"><Success />Success</Pill>
          </div>
          <div class="default-wrapper">
            <span>Info variant</span>
            <Pill variant="Info"
              ><CircleWarning />
              <p>Info</p>
            </Pill>
          </div>
          <div class="default-wrapper">
            <span>Error variant</span>
            <Pill variant="Error"
              ><Close />
              <p>Error</p>
            </Pill>
          </div>
          <div class="default-wrapper">
            <span>Warning variant</span>
            <Pill variant="Warning"><Warning />Warning</Pill>
          </div>
          <div class="default-wrapper">
            <span>Promotion variant</span>
            <Pill variant="Promotion"><Rocket />Promotion</Pill>
          </div>
        </div>

        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show Pill.vue source code">{{
          pillComponentCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
p {
  margin: 0;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 4px;

  & i.note {
    font-size: 12px;
  }

  & .default-wrapper,
  & .white {
    padding: 20px;
    border: 2px dashed var(--knime-silver-sand);

    & span {
      padding-right: 8px;
    }
  }

  & .white {
    background: var(--knime-porcelain);
  }
}
</style>
