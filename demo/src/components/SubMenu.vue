<script>
import { markRaw } from 'vue';
import CodeExample from './demo/CodeExample.vue';
import SubMenu from 'webapps-common/ui/components/SubMenu.vue';
import HelpIcon from 'webapps-common/ui/assets/img/icons/circle-help.svg';
import StarIcon from 'webapps-common/ui/assets/img/icons/star.svg';
import LeaveIcon from 'webapps-common/ui/assets/img/icons/leave.svg';
import HeartIcon from 'webapps-common/ui/assets/img/icons/heart.svg';
import MenuIcon from 'webapps-common/ui/assets/img/icons/menu-options.svg';
import code from 'webapps-common/ui/components/SubMenu.vue?raw';

const codeExampleStandalone = `<script>
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg';

const subMenuItems = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: HelpIcon,
    hotkeyText: 'Ctrl + 1'
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon,
    hotkeyText: 'Ctrl + 2'
}, {
    href: 'about:blank',
    text: 'Disabled Item',
    disabled: true,
    icon: StarIcon,
    hotkeyText: 'Ctrl + 3'
}, {
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

  & :deep(.submenu-toggle:hover),
  & :deep(.submenu-toggle:focus),
  &:focus-within :deep(.submenu-toggle) {
    color: var(--knime-white);
    background-color: var(--knime-masala);

    & svg {
      stroke: var(--knime-white);
    }
  }
}
</style>
`;

const subMenuItems = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: markRaw(HelpIcon),
    hotkeyText: 'Ctrl + 1'
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: markRaw(StarIcon),
    hotkeyText: 'Ctrl + 2'
}, {
    href: 'about:blank',
    text: 'Disabled Item',
    disabled: true,
    icon: markRaw(StarIcon),
    hotkeyText: 'Ctrl + 3'
}, {
    to: '/testing-nuxt-link',
    text: 'Ananas',
    icon: markRaw(HeartIcon)
}, {
    href: 'https://www.urbandictionary.com/define.php?term=go%20bananas',
    text: 'Bananas',
    icon: markRaw(LeaveIcon)
}, {
    text: 'Item without href/to',
    icon: markRaw(HelpIcon),
    children: [
        {
            text: 'I am part of a submenu',
            icon: StarIcon
        },
        {
            text: 'Woohooo',
            href: 'https://example.com/woohoo'
        }
    ]
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
            code,
            teleport: true
        };
    },
    computed: {
        subMenuItemsWithSeparator() {
            return subMenuItems.map((item, index) => {
                // eslint-disable-next-line no-magic-numbers
                const hasSeparator = index === 2 || index === 4;
                return hasSeparator ? { ...item, separator: true } : item;
            });
        },
        subMenuItemsWithoutIcons() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return subMenuItems.map(({ icon, hotkeyText, ...rest }) => rest);
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>SubMenu</h2>
        <p>
          A button that opens a dropdown menu containing clickable items. The menu will be positioned based on
          the orientation prop but will readjust automatically depending on available space. Resize window and/or
          scroll to try it out
        </p>

        <div class="submenus">
          <div class="card">
            <span class="menu-name">Normal</span>
            <SubMenu
              :items="subMenuItemsWithSeparator"
              button-title="Open my submenu"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Orientation left</span>
            <SubMenu
              :items="subMenuItemsWithSeparator"
              orientation="left"
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Orientation top</span>
            <SubMenu
              :items="subMenuItemsWithSeparator"
              orientation="top"
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Disabled submenu</span>
            <SubMenu
              :items="subMenuItems"
              disabled
              button-title="Open my submenu with icons"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="card">
            <span class="menu-name">Normal (reduced width)</span>
            <SubMenu
              :items="subMenuItemsWithoutIcons"
              :max-menu-width="100"
              button-title="Open my submenu"
            >
              <MenuIcon class="open-icon" />
            </SubMenu>
          </div>

          <div class="scroll-container">
            <div class="card translated">
              <input
                v-model="teleport"
                type="checkbox"
              >
              <span class="menu-name">With teleport</span>
              <SubMenu
                :teleport-to-body="teleport"
                :items="subMenuItemsWithSeparator"
                button-title="Open my submenu"
              >
                <MenuIcon class="open-icon" />
              </SubMenu>
            </div>
          </div>
        </div>
        <CodeExample summary="Show usage example">{{ codeExampleStandalone }}</CodeExample>
        <CodeExample summary="Show SubMenu.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
h4 {
  margin-bottom: 10px;
}

.open-icon {
  width: 25px;
  height: 50px;
  margin: auto;
}

.menu-name {
  padding: 10px;
}

.card {
  display: flex;
  align-items: center;
  box-shadow: 1px 1px 4px 0 var(--knime-gray-dark-semi);
}

.submenus {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;

  & > * {
    margin-right: 20px;

    & svg {
      stroke: var(--knime-dove-gray);
    }
  }

  & .submenu {
    align-self: stretch;
  }

  & :deep(.submenu-toggle) {
    height: 100%;
    border-radius: 0;
  }
}

.scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  height: 50px;
}

.translated {
  transform: translateX(0);
}
</style>
