<script>
import CodeExample from './demo/CodeExample';
import SubMenu from '../../ui/components/SubMenu';
import HelpIcon from '../../ui/assets/img/icons/circle-help.svg?inline';
import StarIcon from '../../ui/assets/img/icons/star.svg?inline';
import LeaveIcon from '../../ui/assets/img/icons/leave.svg?inline';
import HeartIcon from '../../ui/assets/img/icons/heart.svg?inline';
import DropdownIcon from '../../ui/assets/img/icons/arrow-dropdown.svg?inline';
import Button from '../../ui/components/Button';
import SplitButton from '../../ui/components/SplitButton';
import code from '!!raw-loader!../../ui/components/SplitButton';

const codeExample = `<script>
import Button from '~/webapps-common/ui/components/Button';
import SubMenu from '~/webapps-common/ui/components/SubMenu';
import SplitButton from '~/webapps-common/ui/components/SplitButton';
import DropdownIcon from '~/webapps-common/ui/assets/img/icons/arrow-dropdown.svg?inline';

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
        SubMenu,
        SplitButton,
        DropdownIcon
    },
    data() {
        return {
            subMenuItems
        };
    }
};
<\/script>

<template>
  <SplitButton>
    <Button primary>Split button with submenu</Button>
    <SubMenu
      :items="subMenuItems"
      class="submenu"
      button-title="Open my submenu with icons"
      orientation="left"
    >
      <DropdownIcon />
    </SubMenu>
  </SplitButton>
</template>

<style lang="postcss" scoped>
.submenu {
  background-color: var(--theme-color-yellow);

  &:focus-within,
  &:hover {
    background-color: var(--theme-color-masala);

    & button svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>`;

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
        SubMenu,
        CodeExample,
        DropdownIcon,
        Button,
        SplitButton
    },
    data() {
        return {
            SubMenu,
            subMenuItems,
            codeExample,
            code
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>SplitButton</h2>
        <p>
          A split button which combines a Button and SubMenu component. Both intentionally need to be added via the
          default slot to have full flexibility regarding their props and events.
        </p>
        <div>
          <SplitButton>
            <Button primary>Split button with submenu</Button>
            <SubMenu
              :items="subMenuItems"
              class="submenu"
              button-title="Open my submenu with icons"
              orientation="left"
            >
              <DropdownIcon />
            </SubMenu>
          </SplitButton>
        </div>
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show SplitButton.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

h4 {
  margin-bottom: 10px;
}

.submenu {
  background-color: var(--theme-color-yellow);

  &:focus-within,
  &:hover {
    background-color: var(--theme-color-masala);

    & button svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>
