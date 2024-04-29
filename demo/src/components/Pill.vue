<script setup lang="ts">
import CodeExample from "./demo/CodeExample.vue";
import Pill from "webapps-common/ui/components/Pill.vue";
import ActivityIcon from "webapps-common/ui/assets/img/icons/activity.svg";
import pillComponentCode from "webapps-common/ui/components/Pill.vue?raw";

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
          <div class="default">
            <span>Default style:</span>
            <Pill>Hello World</Pill>
          </div>
          <div class="white">
            <span>With white color variant</span>
            <Pill color="white">Hello White World</Pill>
          </div>
          <div class="default">
            <span>The content can be whatever you need:</span>
            <Pill
              ><ActivityIcon /><b>Hello <i>WORLD</i></b></Pill
            >
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

  & .default,
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
