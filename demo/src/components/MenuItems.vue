<script lang="ts">
import { markRaw } from 'vue';
import CodeExample from './demo/CodeExample.vue';
import MenuItems from 'webapps-common/ui/components/MenuItems.vue';
import HelpIcon from 'webapps-common/ui/assets/img/icons/circle-help.svg';
import StarIcon from 'webapps-common/ui/assets/img/icons/star.svg';
import LeaveIcon from 'webapps-common/ui/assets/img/icons/leave.svg';
import HeartIcon from 'webapps-common/ui/assets/img/icons/heart.svg';
import code from 'webapps-common/ui/components/MenuItems.vue?raw';
import type { MenuItem } from 'webapps-common/ui/components/MenuItemsBase.vue';

const codeExampleStandalone = `<script>
import MenuItems from '~/webapps-common/ui/components/MenuItems.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg';

const items = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: HelpIcon,
    hotkeyText: 'Ctrl + 1'
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon,
    hotkeyText: 'Ctrl + 2',
    separator: true
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
        MenuItems,
        MenuIcon
    },
    data() {
        return {
            items
        };
    },
    methods: {
        onItemClick(event, item, id) {
            console.log(event) // this is the native dom event
            console.log(item) // this is the item object that was clicked on
            console.log(id) // this is the id of the menu whose item was clicked on
        }
    }
};
<\/script>

<template>
    <MenuItems
      :items="items"
      id="the-id-of-my-menu"
      menu-aria-label="This is a menu displaying items"
      @item-click="onItemClick"
    >
</template>
`;

const menuItemsData : MenuItem[] = [{
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
    icon: markRaw(HelpIcon)
}];

export default {
    components: {
        MenuItems,
        CodeExample
    },
    data() {
        return {
            MenuItems,
            menuItemsData,
            codeExampleStandalone,
            code,
            hoveredItem: null
        };
    },
    computed: {
        menuItemsWithoutIcons() {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return menuItemsData.map(({ icon, hotkeyText, ...rest }) => rest);
        },
        menuItemsWithSeparator() {
            return menuItemsData.map((item, index) => {
                // eslint-disable-next-line no-magic-numbers
                const hasSeparator = index === 2 || index === 4;
                return hasSeparator ? { ...item, separator: true } : item;
            });
        },
        menuItemsWithSelectedEntries() {
            return menuItemsData.map((item, index) => {
                // eslint-disable-next-line no-magic-numbers
                const selected = index === 1 || index === 3;
                return selected ? { ...item, selected: true } : item;
            });
        },
        menuItemsWithSections() {
            return [
                { text: 'Round-shaped', sectionHeadline: true, separator: true },
                menuItemsData[0],
                menuItemsData[1],
                { text: 'Different-shaped', sectionHeadline: true, separator: true },
                menuItemsData[3],
                menuItemsData[4]
            ];
        }
    },
    methods: {
        onItemClick(event, item, id) {
            window.alert(`You clicked on menu ${id} on an item with a value of: ${JSON.stringify(item)}`);
        },
        onItemActive(item) {
            this.hoveredItem = item;
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>A component that displays a group of items. Supports keyboard navigation.</p>

        <div class="menu-items">
          <div class="menu-item-wrapper">
            <div class="menu-name">Normal</div>
            <div class="card">
              <MenuItems
                id="NORMAL"
                :items="menuItemsWithoutIcons"
                menu-aria-label="Menu items without icons"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="menu-item-wrapper">
            <div class="menu-name">With icons and hotkeys</div>
            <div class="card">
              <MenuItems
                id="WITH_ICONS_AND_HOTKEYS"
                :items="menuItemsData"
                menu-aria-label="Menu items with icons and hotkeys"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="menu-item-wrapper">
            <div class="menu-name">With separators</div>
            <div class="card">
              <MenuItems
                id="WITH_SEPARATORS"
                :items="menuItemsWithSeparator"
                menu-aria-label="Menu items with separators"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="menu-item-wrapper">
            <div class="menu-name">With selected entries</div>
            <div class="card">
              <MenuItems
                id="WITH_SELECTED_ENTRIES"
                :items="menuItemsWithSelectedEntries"
                menu-aria-label="Menu items with selected entries"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="menu-item-wrapper">
            <div class="menu-name">With sections</div>
            <div class="card">
              <MenuItems
                id="WITH_SECTIONS"
                :items="menuItemsWithSections"
                menu-aria-label="Menu items with sections"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="menu-item-wrapper">
            <div class="menu-name">With keyboard navigation and scrollable content</div>
            <button @keydown="($refs.menuItemsWithNavigation as any).onKeydown($event)">
              Focus me to start navigating
            </button>
            <div class="card">
              <MenuItems
                ref="menuItemsWithNavigation"
                :items="menuItemsData"
                class="menu-items-with-navigation"
                menu-aria-label="Menu items with sections"
                @item-click="onItemClick"
                @item-hovered="onItemActive"
              />
            </div>
          </div>

          <div class="hover-preview">
            <div class="hover-title">
              {{ hoveredItem ? 'Hovered value is:' : 'Hover over an item' }}
            </div>
            <pre class="hover-content">{{ hoveredItem }}</pre>
          </div>
        </div>
        <CodeExample summary="Show usage example">{{ codeExampleStandalone }}</CodeExample>
        <CodeExample summary="Show MenuItems.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
h4 {
  margin-bottom: 10px;
}

.menu-name {
  padding: 10px;
  text-align: center;
}

.card {
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 4px 0 var(--knime-gray-dark-semi);
}

.menu-items-with-navigation {
  max-height: 80px;
  overflow-y: auto;
}

.menu-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;

  & .hover-preview,
  & .menu-item-wrapper {
    flex-direction: column;
  }

  & .hover-preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-self: self-start;
    padding: 10px;

    & .hover-title {
      padding-bottom: 10px;
      text-align: center;
    }

    & .hover-content {
      font-size: 12px;
      overflow: auto;
      max-width: 360px;
      height: 150px;
    }
  }

  & > * {
    margin-right: 20px;

    & svg {
      stroke: var(--knime-dove-gray);
    }
  }
}
</style>
