<script>
import CodeExample from './demo/CodeExample';
import SubMenu from '../../ui/components/SubMenu';
import HelpIcon from '../../ui/assets/img/icons/circle-help.svg?inline';
import StarIcon from '../../ui/assets/img/icons/star.svg?inline';
import LeaveIcon from '../../ui/assets/img/icons/leave.svg?inline';
import HeartIcon from '../../ui/assets/img/icons/heart.svg?inline';
import MenuIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import code from '!!raw-loader!../../ui/components/SubMenu';

const codeExampleStandalone = `<script>
import SubMenu from '~/webapps-common/ui/components/SubMenu';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg?inline';

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
}, {
    text: 'Item without href/to',
    icon: HelpIcon
}];

export default {
    components: {
        SubMenu,
        MenuIcon
    },
    data() {
        return {
            subMenuItems
        };
    }
};
<\/script>

<template>
  <nav>
    <SubMenu
      :items="subMenuItems"
      orientation="left"
      button-title="Open my submenu with icons"
    >
  </nav>
</template>

<style lang="postcss" scoped>
nav {
  display: flex;

  & >>> .submenu-toggle:hover,
  & >>> .submenu-toggle:focus,
  &:focus-within >>> .submenu-toggle {
    color: var(--theme-color-white);
    background-color: var(--theme-color-masala);

    & svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>
`;

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
}, {
    text: 'Item without href/to',
    icon: HelpIcon
}];

export default {
    components: {
        SubMenu,
        CodeExample,
        MenuIcon
    },
    data() {
        return {
            SubMenu,
            subMenuItems,
            codeExampleStandalone,
            code
        };
    },
    computed: {
        subMenuItemsWithoutIcons() {
            return subMenuItems.map(item => {
                const newItem = JSON.parse(JSON.stringify(item));
                delete newItem.icon;
                return newItem;
            });
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>SubMenu</h2>
        <p>A button that opens a dropdown menu containing clickable items.</p>

        <div class="submenus">
          <div class="card">
            <span class="menu-name">Normal</span>
            <SubMenu
              :items="subMenuItemsWithoutIcons"
              button-title="Open my submenu"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">With icons</span>
            <SubMenu
              :items="subMenuItems"
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Orientation left</span>
            <SubMenu
              :items="subMenuItems"
              orientation="left"
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Orientation top</span>
            <SubMenu
              :items="subMenuItems"
              orientation="top"
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>
        </div>
        <CodeExample summary="Show usage example">{{ codeExampleStandalone }}</CodeExample>
        <CodeExample summary="Show SubMenu.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

h4 {
  margin-bottom: 10px;
}

.open-icon {
  width: 25px;
  height: 50px;
}

.menu-name {
  padding: 10px;
}

.card {
  display: flex;
  align-items: center;
  box-shadow: 1px 1px 4px 0 var(--theme-color-gray-dark-semi);
}

.submenus {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > * {
    margin-right: 20px;

    & svg {
      stroke: var(--theme-color-dove-gray);
    }
  }

  & .submenu {
    align-self: stretch;
  }

  & >>> .submenu-toggle {
    height: 100%;
    border-radius: 0;
  }
}
</style>
