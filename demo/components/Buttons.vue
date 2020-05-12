<script>
import CodeExample from './demo/CodeExample';
import Button from '../../ui/components/Button';
import buttonCode from '!!raw-loader!../../ui/components/Button';
import baseButtonCode from '!!raw-loader!../../ui/components/BaseButton';
import PlayIcon from '../../ui/assets/img/icons/circle-play.svg?inline';

const codeExample = `<Button>Button</Button>
<Button with-border>Button with border</Button>
<Button with-border on-dark>Button with border on dark</Button>
<Button primary>Primary button</Button>
<Button primary on-dark>Primary button on dark</Button>

<Button compact>Button compact</Button>
<Button><PlayIcon />Button with icon</Button>
<Button disabled>Button disabled</Button>`;

export default {
    components: {
        Button,
        PlayIcon,
        CodeExample
    },
    data() {
        return {
            buttonCode,
            baseButtonCode,
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
          <div class="background">
            <Button
              with-border
              on-dark
            >
              Button with border on dark
            </Button>
          </div>
          <Button primary>Primary button</Button>
          <div class="background">
            <Button
              primary
              on-dark
            >
              Primary button on dark
            </Button>
          </div>
        </div>

        <!-- with icon -->
        <div class="align-horizontal">
          <Button><PlayIcon />Button</Button>
          <Button with-border><PlayIcon />Button with border</Button>
          <div class="background">
            <Button
              with-border
              on-dark
            >
              <PlayIcon />Button with border on dark
            </Button>
          </div>
          <Button primary><PlayIcon />Primary button</Button>
          <div class="background">
            <Button
              primary
              on-dark
            >
              <PlayIcon />Primary button on dark
            </Button>
          </div>
        </div>

        <!-- compact -->
        <div class="align-horizontal">
          <Button compact>Button compact</Button>
          <Button
            with-border
            compact
          >
            Button compact with border
          </Button>
          <div class="background">
            <Button
              with-border
              on-dark
              compact
            >
              Button compact with border on dark
            </Button>
          </div>
          <Button
            primary
            compact
          >
            Primary button compact
          </Button>
          <div class="background">
            <Button
              primary
              on-dark
              compact
            >
              Primary button compact on dark
            </Button>
          </div>
        </div>

        <!-- compact with icon -->
        <div class="align-horizontal">
          <Button compact><PlayIcon />Button compact</Button>
          <Button
            with-border
            compact
          >
            <PlayIcon />Button compact with border
          </Button>
          <div class="background">
            <Button
              with-border
              on-dark
              compact
            >
              <PlayIcon />Button compact with border on dark
            </Button>
          </div>
          <Button
            primary
            compact
          >
            <PlayIcon />Primary button compact
          </Button>
          <div class="background">
            <Button
              primary
              on-dark
              compact
            >
              <PlayIcon />Primary button compact on dark
            </Button>
          </div>
        </div>

        <!-- disabled -->
        <div class="align-horizontal">
          <Button disabled>Button disabled</Button>
          <Button
            with-border
            disabled
          >
            Button disabled with border
          </Button>
          <div class="background">
            <Button
              with-border
              on-dark
              disabled
            >
              Button disabled with border on dark
            </Button>
          </div>
          <Button
            primary
            disabled
          >
            Primary button disabled
          </Button>
          <div class="background">
            <Button
              primary
              on-dark
              disabled
            >
              Primary button disabled on dark
            </Button>
          </div>
        </div>

        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Button.vue source code">{{ buttonCode }}</CodeExample>
        <CodeExample summary="Show BaseButton.vue source code">{{ baseButtonCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.align-horizontal {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > * {
    margin-right: 20px;
  }
}

.background {
  padding: 10px 10px;
  background: var(--theme-color-masala);
}
</style>
