<script>
import { markRaw } from "vue";
import CodeExample from "./demo/CodeExample.vue";
import { SubMenu, Button, SplitButton } from "@knime/components";
import HelpIcon from "@knime/styles/img/icons/circle-help.svg";
import StarIcon from "@knime/styles/img/icons/star.svg";
import LeaveIcon from "@knime/styles/img/icons/leave.svg";
import HeartIcon from "@knime/styles/img/icons/heart.svg";
import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
// import code from "webapps-common/ui/components/SplitButton.vue?raw";
const code = "";

const codeExample = `<script>
import Button from '~/webapps-common/ui/components/Button.vue';
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import SplitButton from '~/webapps-common/ui/components/SplitButton.vue';
import DropdownIcon from '~/@knime/styles/img/icons/arrow-dropdown.svg';

const subMenuItems = [{
    href: 'https://apple.com',
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
  background-color: var(--knime-yellow);

  &:focus-within,
  &:hover {
    background-color: var(--knime-masala);

    & .submenu-toggle svg {
      stroke: var(--knime-white);
    }
  }
}
</style>`;

const subMenuItems = [
  {
    href: "https://apple.com",
    text: "Apples",
    icon: markRaw(HelpIcon),
  },
  {
    href: "https://en.wikipedia.org/wiki/Orange_(colour)",
    text: "Oranges",
    icon: markRaw(StarIcon),
  },
  {
    to: "/testing-nuxt-link",
    text: "Ananas",
    icon: markRaw(HeartIcon),
  },
  {
    href: "https://www.urbandictionary.com/define.php?term=go%20bananas",
    text: "Bananas",
    icon: markRaw(LeaveIcon),
  },
];

export default {
  components: {
    SubMenu,
    CodeExample,
    DropdownIcon,
    Button,
    SplitButton,
  },
  data() {
    return {
      SubMenu,
      subMenuItems,
      codeExample,
      code,
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          A split button which combines a Button and SubMenu component. Both
          intentionally need to be added via the default slot to have full
          flexibility regarding their props and events.
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
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show SplitButton.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
h4 {
  margin-bottom: 10px;
}

.submenu {
  background-color: var(--knime-yellow);

  &:focus-within,
  &:hover {
    background-color: var(--knime-masala);

    & .submenu-toggle svg {
      stroke: var(--knime-white);
    }
  }
}
</style>
