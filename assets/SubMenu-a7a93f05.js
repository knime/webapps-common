import{_,m as p,o as w,c as I,b as e,d as n,w as o,O as M,P as S,e as f,t as g,r as d,p as k,f as O}from"./index-e9c1b4e4.js";import{C}from"./CodeExample-e0323447.js";import{S as v}from"./SubMenu-02aa03da.js";import{S as m,H as x}from"./star-a9a4f9a9.js";import{H as T,L as B}from"./heart-6bf0dd15.js";import{M as W}from"./menu-options-d07508b4.js";import"./arrow-next-8bba71e1.js";const A=`<script lang="ts">
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
  emits: ["item-click", "toggle"],
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
      expanded
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
      }))
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

      this.updatePopper();
    },
    onItemClick(event: Event, item: any) {
      this.$emit("item-click", event, item, this.id);
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
.menu-items,
:deep(.menu-items-sub-level) {
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
`,h=[{href:"http://apple.com",text:"Apples",icon:p(x),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:p(m),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:p(m),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:p(T)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:p(B)},{text:"Item without href/to",icon:p(x),children:[{text:"I am part of a submenu",icon:m},{text:"Woohooo",href:"https://example.com/woohoo"}]}],P={components:{SubMenu:v,CodeExample:C,MenuIcon:W},data(){return{SubMenu:v,subMenuItems:h,codeExampleStandalone:D,code:A,teleport:!0}},computed:{subMenuItemsWithSeparator(){return h.map((t,a)=>a===2||a===4?{...t,separator:!0}:t)},subMenuItemsWithoutIcons(){return h.map(({icon:t,hotkeyText:a,...c})=>c)}}},s=t=>(k("data-v-64437761"),t=t(),O(),t),E={class:"grid-container"},H={class:"grid-item-12"},N=s(()=>e("h2",null,"SubMenu",-1)),F=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),R={class:"submenus"},z={class:"card"},K=s(()=>e("span",{class:"menu-name"},"Normal",-1)),V={class:"card"},j=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),L={class:"card"},U=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),q={class:"card"},G=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),J={class:"card"},Q=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1)),X={class:"scroll-container"},Y={class:"card translated"},Z=s(()=>e("span",{class:"menu-name"},"With teleport",-1));function $(t,a,c,ee,i,l){const r=d("MenuIcon"),u=d("SubMenu",!0),b=d("CodeExample");return w(),I("section",null,[e("div",E,[e("div",H,[N,F,e("div",R,[e("div",z,[K,n(u,{items:l.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",V,[j,n(u,{items:l.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",L,[U,n(u,{items:l.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",q,[G,n(u,{items:i.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",J,[Q,n(u,{items:l.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["items"])]),e("div",X,[e("div",Y,[M(e("input",{"onUpdate:modelValue":a[0]||(a[0]=y=>i.teleport=y),type:"checkbox"},null,512),[[S,i.teleport]]),Z,n(u,{"teleport-to-body":i.teleport,items:l.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(r,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),n(b,{summary:"Show usage example"},{default:o(()=>[f(g(i.codeExampleStandalone),1)]),_:1}),n(b,{summary:"Show SubMenu.vue source code"},{default:o(()=>[f(g(i.code),1)]),_:1})])])])}const ue=_(P,[["render",$],["__scopeId","data-v-64437761"]]);export{ue as default};
