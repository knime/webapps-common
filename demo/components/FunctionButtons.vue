<script>
import CodeExample from './demo/CodeExample';
import Button from '../../ui/components/Button';
import buttonCode from '!!raw-loader!../../ui/components/Button';
import MenuOptionsIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import LensIcon from '../../ui/assets/img/icons/lens.svg?inline';
import SplitButton from '../../ui/components/SplitButton';
import SubMenu from '../../ui/components/SubMenu';


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
        MenuOptionsIcon,
        LensIcon,
        SubMenu,
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
        <h2>Function Buttons</h2>
        
        <!-- function buttons -->
        <div class="align-horizontal">
          <Button
            function
            without-text
          >
            <MenuOptionsIcon />
          </Button>

          <Button function><LensIcon />Function</Button>
          
          <Button function>Function Menu</Button>
        </div>

        <!-- active function buttons -->
        <div class="align-horizontal">
          <Button
            function
            without-text
            active
          >
            <MenuOptionsIcon />
          </Button>

          <Button
            function
            active
          >
            <LensIcon />Function
          </Button>
          
          <Button
            function
            active
          >
            Function Menu
          </Button>
        </div>

        <!-- compact function buttons -->
        <div class="align-horizontal">
          <Button
            compact
            function
            without-text
          >
            <MenuOptionsIcon />
          </Button>

          <Button
            compact
            function
          >
            <LensIcon />Function
          </Button>
          
          <Button
            compact
            function
          >
            Function Menu
          </Button>
        </div>

        <!-- active compact function buttons -->
        <div class="align-horizontal">
          <Button
            active
            compact
            function
            without-text
          >
            <MenuOptionsIcon />
          </Button>

          <Button
            active
            compact
            function
          >
            <LensIcon />Function
          </Button>
          
          <Button
            active
            compact
            function
          >
            Function Menu
          </Button>
        </div>

        <!-- <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show Button.vue source code">{{ buttonCode }}</CodeExample> -->
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
