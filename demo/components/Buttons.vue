<script>
import CodeExample from './demo/CodeExample';
import Button from 'webapps-common/ui/components/Button.vue';
import buttonCode from '!!raw-loader!webapps-common/ui/components/Button.vue';

const codeExample = `<Button>Button</Button>
<Button with-border>Button with border</Button>
<Button on-dark>Button on dark</Button>  <\!-- different hover style -->
<Button compact>Button compact</Button>
`;

export default {
    components: {
        Button,
        CodeExample
    },
    data() {
        return {
            buttonCode,
            codeExample
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Buttons</h2>
        <div class="align-horizontal">
          <Button>Button</Button>
          <Button with-border>Button with border</Button>
          <div style="background: var(--theme-color-4); padding: 10px 10px 0;">
            <Button on-dark>Button on dark</Button>
          </div>
          <Button compact>Button compact</Button>
        </div>
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Button.vue source code">{{ buttonCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.align-horizontal {
  display: flex;
  align-items: flex-end;

  & > * {
    margin-right: 20px;
  }
}
</style>
