<script>
import CodeExample from './demo/CodeExample';
import Button from '../../ui/components/Button';
import buttonCode from '!!raw-loader!../../ui/components/Button';
import MenuOptionsIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import LensIcon from '../../ui/assets/img/icons/lens.svg?inline';
import DropdownIcon from '../../ui/assets/img/icons/arrow-dropdown.svg?inline';
import PopupController from '../../ui/components/PopupController';
import Menu from '../../ui/components/Menu';
import HelpIcon from '../../ui/assets/img/icons/circle-help.svg?inline';
import StarIcon from '../../ui/assets/img/icons/star.svg?inline';
import LeaveIcon from '../../ui/assets/img/icons/leave.svg?inline';
import HeartIcon from '../../ui/assets/img/icons/heart.svg?inline';

const codeExample = `<Button>Button</Button>
<Button with-border>Button with border</Button>
<Button with-border on-dark>Button with border on dark</Button>
<Button primary>Primary button</Button>
<Button primary on-dark>Primary button on dark</Button>

<Button compact>Button compact</Button>
<Button><PlayIcon />Button with icon</Button>
<Button disabled>Button disabled</Button>`;

const subMenuItems = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: HelpIcon
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon
},  {
    to: '/testing-nuxt-link',
    text: 'Ananas',
    icon: HeartIcon
}, {
    href: 'https://www.urbandictionary.com/define.php?term=go%20bananas',
    text: 'Bananas',
    icon: LeaveIcon
}];

export default {
    components: {
        Button,
        MenuOptionsIcon,
        LensIcon,
        DropdownIcon,
        CodeExample,
        PopupController,
        Menu
    },
    data() {
        return {
            buttonCode,
            codeExample,
            subMenuItems
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
          
          <PopupController
            orientation="left"
          >
            <template #toggle>
              <Button
                function
                class="toggle-active"
              >
                Function Menu
                <DropdownIcon class="toggle-icon" />
              </Button>
            </template>
            <template #popup>
              <Menu :items="subMenuItems" />
            </template>
          </PopupController>

          <PopupController
            orientation="right"
          >
            <template #toggle>
              <Button
                function
                without-text
                class="toggle-active"
              >
                <MenuOptionsIcon />
              </Button>
            </template>
            <template #popup>
              <Menu :items="subMenuItems" />
            </template>
          </PopupController>
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
            class="toggle-active"
          >
            Function Menu
            <DropdownIcon class="toggle-icon" />
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
