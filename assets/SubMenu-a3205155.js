import{_ as w,m as l,o as y,c as M,b as e,d as n,w as o,O as I,P as k,e as b,t as f,r as d,p as S,f as O}from"./index-376170fd.js";import{C}from"./CodeExample-e13e6dfe.js";import{S as g}from"./SubMenu-1e3b5584.js";import{H as v,S as x}from"./star-2ca11754.js";import{H as B,L as T}from"./heart-5473d043.js";import{M as A}from"./menu-options-0a3f8a74.js";const W=`<script lang="ts">
import { ref, toRefs, computed, unref, watch } from 'vue';

import FunctionButton from './FunctionButton.vue';
import MenuItems from './MenuItems.vue';
import usePopper from '../composables/usePopper';
import useClickOutside from '../composables/useClickOutside';

import type { MenuItem } from './MenuItemsBase.vue';
import type { PropType } from 'vue';
import type { Placement } from '@popperjs/core';

const orientations = ['right', 'top', 'left'] as const;

type Orientation = typeof orientations[number];

const placementMap: Record<Orientation, Placement> = {
    right: 'bottom-end',
    top: 'top-end',
    left: 'bottom-start'
};

/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
export default {
    components: {
        FunctionButton,
        MenuItems
    },
    props: {
        /**
         * Items to be listed in the menu.
         * See MenuItems for more details.
         */
        items: {
            type: Array as PropType<Array<MenuItem>>,
            required: true
        },
        /**
         * Identifier for click handler
         */
        id: {
            type: String,
            default: ''
        },
        /**
         * Button title
         */
        buttonTitle: {
            type: String,
            default: ''
        },
        /**
         * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
         */
        orientation: {
            type: String as PropType<'right' | 'top' | 'left'>,
            default: 'right',
            validator(orientation: Orientation = 'right') {
                return orientations.includes(orientation);
            }
        },
        /**
         * Disable SubMenu
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Set max-width for the menu and truncate larger text
         */
        maxMenuWidth: {
            type: Number,
            default: null
        },
        /**
         * Allow overflow of the popper on the main axis regarding the SubMenu Button
         */
        allowOverflowMainAxis: {
            type: Boolean,
            default: false
        },
        /**
         * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
         * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
         * has a translate css styling).
         * Whenever themenu is expanded, a callback which closes it again is emitted as the event 'toggle'.
         */
        teleportToBody: {
            type: Boolean,
            default: true
        }
    },
    emits: ['item-click', 'toggle'],
    setup(props) {
        const { allowOverflowMainAxis, orientation } = toRefs(props);
        const submenu = ref(null);
        const menuItems = ref(null);
        const menuWrapper = ref(null);
        const expanded = ref(false);
        const closeMenu = () => {
            expanded.value = false;
        };

        useClickOutside({ targets: [submenu, menuItems], callback: closeMenu }, expanded);

        const { popperInstance, updatePopper } = usePopper(
            {
                popperTarget: menuWrapper,
                referenceEl: submenu
            },
            computed(() => ({
                placement: placementMap[unref(orientation)],
                strategy: 'fixed',
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            mainAxis: unref(allowOverflowMainAxis)
                        }
                    }
                ]
            }))
        );

        watch(orientation, (value) => {
            const popper = unref(popperInstance);
            if (!popper) {
                return;
            }
            popper.setOptions({
                placement: placementMap[value]
            });
        });

        return {
            menuItems,
            submenu,
            menuWrapper,
            expanded,
            updatePopper,
            closeMenu
        };
    },
    data() {
        return {
            // eslint-disable-next-line no-undefined
            activeDescendant: undefined
        } as {activeDescendant: string | undefined};
    },
    methods: {
        toggleMenu(event: Event) {
            if (this.disabled) {
                return;
            }
            this.expanded = !this.expanded;

            const toggleCallback = this.expanded
                // eslint-disable-next-line brace-style
                ? () => { this.expanded = false; }
                : () => {};

            this.$emit('toggle', event, toggleCallback);

            this.getMenuItems().resetNavigation();
            this.updatePopper();
        },
        onItemClick(event: Event, item: any) {
            this.$emit('item-click', event, item, this.id);
            this.toggleMenu(event);
        },
        onKeydown(event: KeyboardEvent) {
            this.getMenuItems().onKeydown(event);
        },
        getMenuItems() {
            return this.$refs.menuItems as any;
        },
        setActiveDescendant(id: string | null) {
            if (id === null) {
                // eslint-disable-next-line no-undefined
                this.activeDescendant = undefined;
            } else {
                this.activeDescendant = id;
            }
        }
    }
};
<\/script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { disabled }]"
    :aria-owns="activeDescendant"
    :aria-activedescendant="activeDescendant"
    @keydown="onKeydown"
  >
    <FunctionButton
      ref="submenu-toggle"
      aria-haspopup="true"
      type="button"
      :title="buttonTitle"
      :class="['submenu-toggle', { expanded }]"
      :aria-expanded="String(expanded)"
      :disabled="disabled"
      :active="expanded"
      @click="toggleMenu"
    >
      <slot :expanded="expanded" />
    </FunctionButton>
    <Teleport
      to="body"
      :disabled="!teleportToBody"
    >
      <div
        v-show="expanded"
        ref="menuWrapper"
        :class="['menu-wrapper', { disabled } ]"
      >
        <MenuItems
          :id="id"
          ref="menuItems"
          :class="['menu-items', \`orient-\${orientation}\`]"
          :items="items"
          :max-menu-width="maxMenuWidth"
          menu-aria-label="sub menu"
          @item-click="onItemClick"
          @close="closeMenu"
          @item-focused="setActiveDescendant"
        />
      </div>
    </Teleport>
  </div>
</template>

<style lang="postcss" scoped>
.menu-items {
  box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
}

.menu-wrapper {
  z-index: var(--z-index-common-menu-items-expanded, 57);

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
`;const D=`<script>
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
`,m=[{href:"http://apple.com",text:"Apples",icon:l(v),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:l(x),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:l(x),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:l(B)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:l(T)},{text:"Item without href/to",icon:l(v)}],P={components:{SubMenu:g,CodeExample:C,MenuIcon:A},data(){return{SubMenu:g,subMenuItems:m,codeExampleStandalone:D,code:W,teleport:!0}},computed:{subMenuItemsWithSeparator(){return m.map((t,a)=>a===2||a===4?{...t,separator:!0}:t)},subMenuItemsWithoutIcons(){return m.map(({icon:t,hotkeyText:a,...c})=>c)}}},s=t=>(S("data-v-8c1acf12"),t=t(),O(),t),E={class:"grid-container"},H={class:"grid-item-12"},N=s(()=>e("h2",null,"SubMenu",-1)),F=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),R={class:"submenus"},z={class:"card"},K=s(()=>e("span",{class:"menu-name"},"Normal",-1)),V={class:"card"},L=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),j={class:"card"},U=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),q={class:"card"},G=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),J={class:"card"},Q=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1)),X={class:"scroll-container"},Y={class:"card translated"},Z=s(()=>e("span",{class:"menu-name"},"With teleport",-1));function $(t,a,c,ee,i,p){const r=d("MenuIcon"),u=d("SubMenu",!0),h=d("CodeExample");return y(),M("section",null,[e("div",E,[e("div",H,[N,F,e("div",R,[e("div",z,[K,n(u,{items:p.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",V,[L,n(u,{items:p.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",j,[U,n(u,{items:p.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",q,[G,n(u,{items:i.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",J,[Q,n(u,{items:p.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",X,[e("div",Y,[I(e("input",{"onUpdate:modelValue":a[0]||(a[0]=_=>i.teleport=_),type:"checkbox"},null,512),[[k,i.teleport]]),Z,n(u,{"teleport-to-body":i.teleport,items:p.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),n(h,{summary:"Show usage example"},{default:o(()=>[b(f(i.codeExampleStandalone),1)]),_:1}),n(h,{summary:"Show SubMenu.vue source code"},{default:o(()=>[b(f(i.code),1)]),_:1})])])])}const re=w(P,[["render",$],["__scopeId","data-v-8c1acf12"]]);export{re as default};
