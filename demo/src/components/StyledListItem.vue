<script>
import CodeExample from "./demo/CodeExample.vue";
import StyledListItem from "webapps-common/ui/components/StyledListItem.vue";
import code from "webapps-common/ui/components/StyledListItem.vue?raw";

const codeExample = `<ul>
  <StyledListItem
    text="Normal"
  />
  <StyledListItem
    text="Selected"
    selected
  />
  <StyledListItem
    text="Special"
    special
  />
  <StyledListItem
    text="Invalid"
    invalid
  />
  <StyledListItem
    text="Disabled"
    disabled
  />
  <StyledListItem
    text="With line height"
    :line-height="40"
  />
</ul>
`;

export default {
  components: {
    StyledListItem,
    CodeExample,
  },
  data() {
    return {
      code,
      codeExample,
    };
  },
};
</script>

<template>
  <section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>A li element with several styles</p>
          <ul>
            <StyledListItem text="Normal" />
            <StyledListItem text="Selected" selected />
            <StyledListItem text="Special" special />
            <StyledListItem text="Invalid" invalid />
            <StyledListItem text="Disabled" disabled />
            <StyledListItem text="With line height" :line-height="40" />
          </ul>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SubMenu.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="postcss" scoped>
section {
  & :deep(.shadow-wrapper::before) {
    background-image: linear-gradient(
      270deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-white) 100%
    );
  }

  & :deep(.shadow-wrapper::after) {
    background-image: linear-gradient(
      90deg,
      hsl(0deg 0% 100% / 0%) 0%,
      var(--knime-white) 100%
    );
  }
}
</style>
