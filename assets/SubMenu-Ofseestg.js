import{_ as w,m as u,r as p,o as M,c as I,b as e,d as n,w as o,Q as _,R as S,e as f,t as g,p as k,f as C}from"./index-AXHW_TGA.js";import{C as B}from"./CodeExample-uqlLlHR2.js";import{S as x}from"./SubMenu-bM6KWv6z.js";import{H as y,S as m}from"./star-gbOviI1p.js";import{H as O,L as T}from"./heart-rc_VS3pb.js";import{M as W}from"./menu-options-ny4LOltH.js";import"./MenuItems.vue_vue_type_style_index_0_lang-KsN9ejOj.js";import"./Checkbox-22qrndbn.js";import"./arrow-next--yHnwvrx.js";import"./useClickOutside-uhv9kQAQ.js";const A=`<script lang="ts">
import { ref, inject, toRefs, computed } from "vue";
import {
  useFloating,
  type Strategy,
  type Placement,
  shift,
  flip,
  autoUpdate,
} from "@floating-ui/vue";

import FunctionButton from "./FunctionButton.vue";
import MenuItems from "./MenuItems.vue";
import useClickOutside from "../composables/useClickOutside";

import type { MenuItem, Props as MenuItemsProps } from "./MenuItems.vue";
import type { PropType } from "vue";

const orientations = ["right", "top", "left"] as const;

type Orientation = (typeof orientations)[number];

const placementMap: Record<Orientation, Placement> = {
  right: "bottom-end",
  top: "top-end",
  left: "bottom-start",
};

/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
export default {
  components: {
    FunctionButton,
    MenuItems,
  },
  props: {
    /**
     * Items to be listed in the menu.
     * See MenuItems for more details.
     */
    items: {
      type: Array as PropType<Array<MenuItem>>,
      required: true,
    },
    /**
     * Identifier for click handler
     */
    id: {
      type: String,
      default: "",
    },
    /**
     * Button title
     */
    buttonTitle: {
      type: String,
      default: "",
    },
    /**
     * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
     */
    orientation: {
      type: String as PropType<"right" | "top" | "left">,
      default: "right",
      validator(orientation: Orientation = "right") {
        return orientations.includes(orientation);
      },
    },
    /**
     * Disable SubMenu
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Set max-width for the menu and truncate larger text
     */
    maxMenuWidth: {
      type: Number,
      default: null,
    },
    /**
     * Allow overflow of the popover on the main axis regarding the SubMenu Button
     */
    allowOverflowMainAxis: {
      type: Boolean,
      default: false,
    },
    /**
     * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
     * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
     * has a translate css styling).
     * Whenever the menu is expanded, a callback which closes it again is emitted as the event 'toggle'.
     */
    teleportToBody: {
      type: Boolean,
      default: true,
    },
    /**
     * The positioning strategy for the dropdown menu (also called popover)
     */
    positioningStrategy: {
      type: String as PropType<Strategy>,
      default: "fixed",
      validator: (value: string) => ["fixed", "absolute"].includes(value),
    },
    menuItemsProps: {
      type: Object as PropType<Partial<MenuItemsProps>>,
      default: () => ({}) as Partial<MenuItemsProps>,
    },
  },
  emits: ["item-click", "toggle", "open", "close"],
  setup(props) {
    const { positioningStrategy } = toRefs(props);
    const submenu = ref(null);
    const menuItems = ref(null);
    const menuWrapper = ref<HTMLElement | null>(null);
    const expanded = ref(false);
    const shadowRoot = inject<ShadowRoot | null>("shadowRoot", null);

    // @ts-expect-error - force cast shadowRoot into HTMLElement
    const clippingBoundary = computed<HTMLElement>(
      () => shadowRoot || document?.body,
    );

    const closeMenu = () => {
      expanded.value = false;
    };

    useClickOutside(
      { targets: [submenu, menuItems], callback: closeMenu },
      expanded,
    );

    // floating menu
    const placement = computed(() => placementMap[props.orientation]);
    const middleware = computed(() => [
      shift({ mainAxis: props.allowOverflowMainAxis }),
      flip(),
    ]);
    const {
      floatingStyles: menuWrapperFloatingStyles,
      update: updateFloatingMenu,
    } = useFloating(submenu, menuWrapper, {
      placement,
      strategy: positioningStrategy,
      middleware,
      whileElementsMounted: autoUpdate,
    });

    return {
      clippingBoundary,
      menuItems,
      submenu,
      menuWrapper,
      expanded,
      closeMenu,
      updateFloatingMenu,
      menuWrapperFloatingStyles,
      shadowRoot,
    };
  },
  data() {
    return {
      // eslint-disable-next-line no-undefined
      activeDescendant: undefined,
    } as { activeDescendant: string | undefined };
  },
  methods: {
    toggleMenu(event: Event) {
      if (this.disabled) {
        return;
      }
      this.expanded = !this.expanded;

      const toggleCallback = this.expanded
        ? // eslint-disable-next-line brace-style
          () => {
            this.expanded = false;
          }
        : () => {};

      this.$emit("toggle", event, toggleCallback);
      const openOrCloseEvent = this.expanded ? "open" : "close";
      this.$emit(openOrCloseEvent);

      this.updateFloatingMenu();
    },
    onItemClick(event: Event, item: any) {
      this.$emit("item-click", event, item, this.id);
      if (item.checkbox) {
        item.checkbox.setBoolean(!item.checkbox.checked);
        return;
      }
      this.toggleMenu(event);
    },
    onKeydown(event: KeyboardEvent) {
      this.getMenuItems()?.onKeydown(event);
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
    },
  },
};
<\/script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { expanded }, { disabled }]"
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
      @click.stop="toggleMenu"
    >
      <slot :expanded="expanded" />
    </FunctionButton>
    <Teleport :to="shadowRoot || 'body'" :disabled="!teleportToBody">
      <div
        v-show="expanded"
        ref="menuWrapper"
        :style="menuWrapperFloatingStyles"
        :class="['menu-wrapper', { disabled }]"
      >
        <MenuItems
          v-if="expanded"
          :id="id"
          ref="menuItems"
          :class="['menu-items', \`orient-\${orientation}\`]"
          :items="items"
          :max-menu-width="maxMenuWidth"
          :clipping-boundary="clippingBoundary"
          v-bind="menuItemsProps"
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
.menu-wrapper {
  z-index: var(--z-index-common-menu-items-expanded, 57);

  & .menu-items {
    margin: 5px 0;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
`,D=`<script>
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg';

const subMenuItems = [{
    href: 'https://apple.com',
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
`,h=[{href:"https://apple.com",text:"Apples",icon:u(y),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:u(m),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:u(m),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:u(O)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:u(T)},{text:"Item without href/to",icon:u(y),children:[{text:"I am part of a submenu",icon:m},{text:"Woohooo",href:"https://example.com/woohoo"}]},{text:"Item with checkbox",checkbox:{checked:!1,setBoolean:t=>window.alert(`Checkbox item clicked. Sub menu is not closed. Instead the setBoolean method of this item was called with the value: ${t}`)}}],E={components:{SubMenu:x,CodeExample:B,MenuIcon:W},data(){return{SubMenu:x,subMenuItems:h,codeExampleStandalone:D,code:A,teleport:!0}},computed:{subMenuItemsWithSeparator(){return h.map((t,a)=>a===2||a===4?{...t,separator:!0}:t)},subMenuItemsWithoutIcons(){return h.map(({icon:t,hotkeyText:a,...d})=>d)}}},s=t=>(k("data-v-75129ff2"),t=t(),C(),t),P={class:"grid-container"},F={class:"grid-item-12"},R=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),H={class:"submenus"},L={class:"card"},N=s(()=>e("span",{class:"menu-name"},"Normal",-1)),j={class:"card"},z=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),K={class:"card"},U=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),V={class:"card"},q=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),Q={class:"card"},G=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1)),J={class:"scroll-container"},X={class:"card translated"},Y=s(()=>e("span",{class:"menu-name"},"With teleport",-1));function Z(t,a,d,$,i,c){const r=p("MenuIcon"),l=p("SubMenu",!0),b=p("CodeExample");return M(),I("section",null,[e("div",P,[e("div",F,[R,e("div",H,[e("div",L,[N,n(l,{items:c.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",j,[z,n(l,{items:c.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",K,[U,n(l,{items:c.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",V,[q,n(l,{items:i.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",Q,[G,n(l,{items:c.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",J,[e("div",X,[_(e("input",{"onUpdate:modelValue":a[0]||(a[0]=v=>i.teleport=v),type:"checkbox"},null,512),[[S,i.teleport]]),Y,n(l,{"teleport-to-body":i.teleport,items:c.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),n(b,{summary:"Show usage example"},{default:o(()=>[f(g(i.codeExampleStandalone),1)]),_:1}),n(b,{summary:"Show SubMenu.vue source code"},{default:o(()=>[f(g(i.code),1)]),_:1})])])])}const ce=w(E,[["render",Z],["__scopeId","data-v-75129ff2"]]);export{ce as default};
