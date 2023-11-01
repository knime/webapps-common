import{_ as w,m as l,r as d,o as _,c as I,b as e,d as n,w as o,P as M,Q as k,e as f,t as g,p as S,f as C}from"./index-0dfc83cb.js";import{C as O}from"./CodeExample-ba2cb043.js";import{S as v}from"./SubMenu-d5eb4025.js";import{H as x,S as m}from"./star-b0199cb2.js";import{H as B,L as T}from"./heart-9a08f23b.js";import{M as W}from"./menu-options-768a6192.js";import"./MenuItems.vue_vue_type_style_index_0_lang-9e8d6b8d.js";import"./Checkbox-6dc7cea1.js";import"./arrow-next-e13e21a3.js";const A=`<script lang="ts">
import { ref, toRefs, computed, unref, watch } from "vue";

import FunctionButton from "./FunctionButton.vue";
import MenuItems from "./MenuItems.vue";
import usePopper from "../composables/usePopper";
import useClickOutside from "../composables/useClickOutside";

import type { MenuItem } from "./MenuItems.vue";
import type { PropType } from "vue";
import type { Placement, PositioningStrategy } from "@popperjs/core";

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
     * Allow overflow of the popper on the main axis regarding the SubMenu Button
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
     * see: https://popper.js.org/docs/v2/constructors/#strategy
     */
    positioningStrategy: {
      type: String as PropType<PositioningStrategy>,
      default: "fixed",
      validator: (value: string) => ["fixed", "absolute"].includes(value),
    },
  },
  emits: ["item-click", "toggle", "open", "close"],
  setup(props) {
    const { orientation } = toRefs(props);
    const submenu = ref(null);
    const menuItems = ref(null);
    const menuWrapper = ref(null);
    const expanded = ref(false);
    const closeMenu = () => {
      expanded.value = false;
    };

    useClickOutside(
      { targets: [submenu, menuItems], callback: closeMenu },
      expanded,
    );

    const { popperInstance, updatePopper } = usePopper(
      {
        popperTarget: menuWrapper,
        referenceEl: submenu,
      },
      computed(() => ({
        placement: placementMap[props.orientation],
        strategy: props.positioningStrategy,
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              mainAxis: props.allowOverflowMainAxis,
            },
          },
        ],
      })),
    );

    watch(orientation, (value) => {
      const popper = unref(popperInstance);
      if (!popper) {
        return;
      }
      popper.setOptions({
        placement: placementMap[value],
      });
    });

    return {
      menuItems,
      submenu,
      menuWrapper,
      expanded,
      updatePopper,
      closeMenu,
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

      this.updatePopper();
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
    <Teleport to="body" :disabled="!teleportToBody">
      <div
        v-show="expanded"
        ref="menuWrapper"
        :class="['menu-wrapper', { disabled }]"
      >
        <MenuItems
          v-if="expanded"
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
`,h=[{href:"http://apple.com",text:"Apples",icon:l(x),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:l(m),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:l(m),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:l(B)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:l(T)},{text:"Item without href/to",icon:l(x),children:[{text:"I am part of a submenu",icon:m},{text:"Woohooo",href:"https://example.com/woohoo"}]},{text:"Item with checkbox",checkbox:{checked:!1,setBoolean:t=>window.alert(`Checkbox item clicked. Sub menu is not closed. Instead the setBoolean method of this item was called with the value: ${t}`)}}],P={components:{SubMenu:v,CodeExample:O,MenuIcon:W},data(){return{SubMenu:v,subMenuItems:h,codeExampleStandalone:D,code:A,teleport:!0}},computed:{subMenuItemsWithSeparator(){return h.map((t,a)=>a===2||a===4?{...t,separator:!0}:t)},subMenuItemsWithoutIcons(){return h.map(({icon:t,hotkeyText:a,...c})=>c)}}},s=t=>(S("data-v-cb33a3b3"),t=t(),C(),t),E={class:"grid-container"},H={class:"grid-item-12"},N=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),F={class:"submenus"},R={class:"card"},z=s(()=>e("span",{class:"menu-name"},"Normal",-1)),K={class:"card"},V=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),j={class:"card"},L=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),U={class:"card"},q=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),Q={class:"card"},G=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1)),J={class:"scroll-container"},X={class:"card translated"},Y=s(()=>e("span",{class:"menu-name"},"With teleport",-1));function Z(t,a,c,$,i,p){const r=d("MenuIcon"),u=d("SubMenu",!0),b=d("CodeExample");return _(),I("section",null,[e("div",E,[e("div",H,[N,e("div",F,[e("div",R,[z,n(u,{items:p.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",K,[V,n(u,{items:p.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",j,[L,n(u,{items:p.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",U,[q,n(u,{items:i.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",Q,[G,n(u,{items:p.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",J,[e("div",X,[M(e("input",{"onUpdate:modelValue":a[0]||(a[0]=y=>i.teleport=y),type:"checkbox"},null,512),[[k,i.teleport]]),Y,n(u,{"teleport-to-body":i.teleport,items:p.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),n(b,{summary:"Show usage example"},{default:o(()=>[f(g(i.codeExampleStandalone),1)]),_:1}),n(b,{summary:"Show SubMenu.vue source code"},{default:o(()=>[f(g(i.code),1)]),_:1})])])])}const le=w(P,[["render",Z],["__scopeId","data-v-cb33a3b3"]]);export{le as default};
