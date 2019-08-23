<script>
import CodeExample from './demo/CodeExample';
import Button from 'webapps-common/ui/components/Button.vue';
import buttonCode from '!!raw-loader!webapps-common/ui/components/Button.vue';

export default {
    components: {
        Button,
        CodeExample
    },
    computed: {
        buttonCode() {
            return buttonCode;
        }
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
          <Button on-dark>Button on dark</Button>
          <Button compact>Button compact</Button>
        </div>
        <CodeExample summary="Show Button.vue code">{{ buttonCode }}</CodeExample>
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
