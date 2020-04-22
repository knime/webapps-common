<script>
import CodeExample from './demo/CodeExample';
import Button from '../../ui/components/Button';
import buttonCode from '!!raw-loader!../../ui/components/Button';
import MenuOptionsIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import LensIcon from '../../ui/assets/img/icons/lens.svg?inline';
import DropdownIcon from '../../ui/assets/img/icons/arrow-dropdown.svg?inline';

const codeExample =
`<Button function without-text><MenuOptionsIcon /></Button>
<Button function><LensIcon />Function</Button>
<Button function>Function Menu<DropdownIcon class="toggle-icon" /></Button>

<Button compact function without-text><MenuOptionsIcon /></Button>
<Button compact function><LensIcon />Compact function</Button>
<Button compact function>Compact function menu<DropdownIcon class="toggle-icon" /></Button>`;

export default {
    components: {
        Button,
        MenuOptionsIcon,
        LensIcon,
        DropdownIcon,
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
          
          
          <Button
            function
          >
            Function Menu
            <DropdownIcon class="toggle-icon" />
          </Button>

          <Button
            function
            class="toggle-active"
          >
            Opened Menu
            <DropdownIcon class="toggle-icon" />
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
            <LensIcon />Compact function
          </Button>
          
          <Button
            compact
            function
          >
            compact function menu
            <DropdownIcon class="toggle-icon" />
          </Button>

          <Button
            compact
            function
            class="toggle-active"
          >
            opened compact menu
            <DropdownIcon class="toggle-icon" />
          </Button>
        </div>

        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
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

.toggle-active,
.button.toggle-active:hover {
  color: var(--theme-color-white);
  background-color: var(--theme-color-masala);

  & svg {
    stroke: var(--theme-color-white);

    &.toggle-icon {
      transform: scaleY(-1);
    }
  }
}
</style>
