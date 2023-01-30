<script>
import CodeExample from './demo/CodeExample.vue';
import StyledListItem from '../../ui/components/StyledListItem.vue';
import code from '!!raw-loader!../../ui/components/StyledListItem';

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
        CodeExample
    },
    data() {
        return {
            code,
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>StyledListItem</h2>
          <p>
            A li element with several styles
          </p>
          <ul>
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
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show SubMenu.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="postcss" scoped>
section {
  & >>> .shadow-wrapper::before {
    background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
  }

  & >>> .shadow-wrapper::after {
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-white) 100%);
  }
}
</style>
