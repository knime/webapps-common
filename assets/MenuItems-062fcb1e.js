import{C as g}from"./CodeExample-8ae518f2.js";import{_ as k}from"./MenuItems.vue_vue_type_style_index_0_lang-f2a80968.js";import{H as I,S as u}from"./star-329952ab.js";import{o as f,c as w,b as e,m as i,_,r as v,d as a,t as l,w as b,e as c,p as y,f as C}from"./index-568482c4.js";import{H as M,L as h}from"./heart-fe992a5e.js";import"./lodash-012086a1.js";import"./arrow-next-1051c262.js";const S={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},E=e("path",{d:"M23.3 22.7c3.6-.4 6.4-3.5 6.4-7.2 0-4-3.3-7.3-7.3-7.3h-.5c-1.1-3.2-4.1-5.5-7.7-5.5C9.7 2.8 6 6.4 6 10.9c0 .4 0 .8.1 1.2-2.2.7-3.7 2.8-3.7 5.2 0 3 2.4 5.5 5.5 5.5h.9m7.2-6v12.4m4-4-4 4-4-4"},null,-1),T=[E];function A(n,o){return f(),w("svg",S,T)}const H={render:A},W=`<script setup lang="ts">
/**
 * MenuItems component with (optional) hotkey text and icons
 * Can be used to create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * The elements of the menu are not focusable.
 * Instead, the component exposes a onKeydown method, which can be taken as a listener for keydown events on a focused
 * element in a parent component. When doing so, the elements in the menu are marked via keyboard navigation.
 * For accessibility, the focused outside element which listens to keydown events needs to have an aria-activedescendant
 * label set to the id of the visually focused element and additionally an aria-owns label with the same id if the menu items are
 * not DOM-descendants of this element (see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
 * This id is emitted via the \`@item-focused\` event whenever the visually focused item changes. This emit also yields null whenever no element
 * is visually focused.
 *
 * For some keydown events, a \`@close\` event is emitted.
 *
 * There is a prop called \`registerKeydown\` if its true the component is registering the onKeydown method to
 * the @keydown event on its own. This is handy if you don't need to have any control over it
 * (like keeping the focus anywhere).
 *
 * A click or activation by keyboard (enter and space) emits \`@item-click\`.
 * If the data has a \`to\` attribute the used tag will be \`nuxt-link\` if it has a \`href\` attribute it will be a \`a\` tag
 * otherwise we use the generic \`button\` and leave the handling of the action to the wrapping component that reacts
 * to \`item-click\` and calls any action.
 *
 * Hovering an item emits \`@item-hovered\`.
 *
 * There is support for sub menus with the \`children\` key in items. The sublevel menus are recursive and create
 * another MenuItems instance. The keyboard navigation is delegated to the submenu and open/close is handled.
 * Use the selector \`:deep(.menu-items-sub-level)\` to style the sub menus
 */
import {
  type FunctionalComponent,
  nextTick,
  ref,
  type Ref,
  type SVGAttributes,
} from "vue";
import useDropdownNavigation from "../composables/useDropdownNavigation";
import getWrappedAroundIndex from "../util/getWrappedAroundIndex";
import BaseMenuItems from "./BaseMenuItems.vue";
import BaseMenuItem from "./BaseMenuItem.vue";
import ArrowNextIcon from "../assets/img/icons/arrow-next.svg";

export interface MenuItem {
  text: string;
  icon?: FunctionalComponent<SVGAttributes>;
  disabled?: boolean;
  /** shown on menu items on hover */
  title?: string;
  /** for router-links */
  to?: string;
  /** for standard (e.g. external) links */
  href?: string;
  /** adds another styling to the item-font by reducing size and brightening color */
  sectionHeadline?: boolean;
  /** visually emphasizes an item by inverting the color of the item */
  selected?: boolean;
  /** adds a download indicator property for file links */
  download?: boolean | string;
  /** show a separator below the item if it's not the last in the list */
  separator?: boolean;
  /** shown aligned right besides the text */
  hotkeyText?: string;
  /** sub menu */
  children?: Array<MenuItem>;
  /** any typed field that can be used to put any data in the item by users of this component */
  metadata?: any;
}

type Props = {
  items: MenuItem[];
  menuAriaLabel: string;
  disableSpaceToClick?: boolean;
  registerKeydown?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  disableSpaceToClick: false,
  registerKeydown: false,
});

interface Emits {
  (e: "close"): void;
  (e: "item-click", event: MouseEvent, item: MenuItem, menuId: string): void;
  (e: "item-focused", itemId: string | null, item: MenuItem | null): void;
  (
    e: "item-hovered",
    item: MenuItem | null,
    menuId: string,
    index: number,
  ): void;
  (e: "close-submenu"): void;
}

const emit = defineEmits<Emits>();
const baseMenuItems: Ref<InstanceType<typeof BaseMenuItems> | null> = ref(null);
const openSubmenuItemIndex = ref(-1);
const subLevelItems = ref<any>(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
  if (!baseMenuItems.value) {
    return {
      onClick: () => {},
      index: -1,
    };
  }

  const listItems = baseMenuItems.value.getEnabledListItems();
  let currentIndexInEnabled = listItems
    .map<number | null>(({ index }) => index)
    .indexOf(current);

  if (currentIndexInEnabled === -1 && direction === -1) {
    currentIndexInEnabled = 0;
  }
  const nextIndex = getWrappedAroundIndex(
    currentIndexInEnabled + direction,
    listItems.length,
  );

  const { element, index, onClick } = listItems[nextIndex];
  baseMenuItems.value.scrollTo(element);

  return { index, onClick };
};

const {
  currentIndex,
  onKeydown: onDropdownNavigationKeydown,
  resetNavigation,
} = useDropdownNavigation({
  disableSpaceToClick: props.disableSpaceToClick,
  getNextElement,
  close: () => emit("close"),
});

const focusIndex = (index: number = 0) => {
  currentIndex.value = index;
};

const setOpenSubmenuIndex = (index: number) => {
  const item = props.items[index];
  const isEnabledSubmenuItem = item && !item.disabled && item.children?.length;

  openSubmenuItemIndex.value = isEnabledSubmenuItem ? index : -1;
};

const onKeydownWithOpenCloseSubMenu = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowLeft":
      emit("close-submenu");
      break;
    case "ArrowRight":
      setOpenSubmenuIndex(currentIndex.value ?? 0);
      nextTick(() => {
        subLevelItems.value?.focusIndex();
      });
      break;
  }
  onDropdownNavigationKeydown(event);
};

const onItemHovered = (item: MenuItem | null, id: string, index: number) => {
  if (item !== null) {
    setOpenSubmenuIndex(index);
  }
  emit("item-hovered", item, id, index);
};

const onKeydown = (event: KeyboardEvent) => {
  const isSubmenuOpen = openSubmenuItemIndex.value !== -1;
  if (isSubmenuOpen) {
    subLevelItems.value?.onKeydown(event);
  } else {
    onKeydownWithOpenCloseSubMenu(event);
  }
};

defineExpose({ onKeydown, resetNavigation, focusIndex });
<\/script>

<template>
  <BaseMenuItems
    ref="baseMenuItems"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    @keydown="props.registerKeydown && onKeydown($event)"
    @item-click="(event, item, id) => $emit('item-click', event, item, id)"
    @item-hovered="(item, id, index) => onItemHovered(item, id, index)"
    @item-focused="(...args) => $emit('item-focused', ...args)"
  >
    <template
      #item="{
        item,
        menuId,
        menuItemId,
        index,
        maxMenuWidth,
        focusedItemIndex,
      }"
    >
      <BaseMenuItem
        :id="menuItemId(index)"
        :item="item"
        :index="index"
        :use-max-menu-width="Boolean(maxMenuWidth)"
        :has-focus="index === focusedItemIndex"
      >
        <template #submenu="{ itemElement }">
          <span
            v-if="item.children && item.children.length"
            class="sub-menu-indicator"
          >
            <ArrowNextIcon class="icon" />
            <MenuItems
              v-if="openSubmenuItemIndex === index"
              :id="\`\${menuId}__sub\${index}\`"
              ref="subLevelItems"
              class="menu-items-sub-level"
              :menu-aria-label="\`\${item.text} sub menu\`"
              :items="item.children"
              :max-menu-width="maxMenuWidth"
              :position-relative-to-element="itemElement"
              register-keydown
              @close-submenu="openSubmenuItemIndex = -1"
              @item-click="(...args) => $emit('item-click', ...args)"
              @item-hovered="(...args) => $emit('item-hovered', ...args)"
              @item-focused="(...args) => $emit('item-focused', ...args)"
            />
          </span>
        </template>
      </BaseMenuItem>
    </template>
  </BaseMenuItems>
</template>

<style>
.sub-menu-indicator {
  & .icon {
    width: 12px;
    height: 12px;
    stroke-width: calc(32px / 12);
    pointer-events: none;
    stroke: var(--theme-dropdown-foreground-color);
    vertical-align: middle;
  }
}
</style>
`,N=`<script>
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
`,s=[{href:"http://apple.com",text:"Apples",icon:i(I),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:i(u),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:i(u),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:i(M)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:i(h)},{text:"Item without href/to",icon:i(I)},{href:"https://www.knime.com/images/knime-logo.svg",text:"Item with download attribute",download:!0,icon:i(H)}],K={components:{MenuItems:k,CodeExample:g},data(){return{menuItemsData:s,codeExampleStandalone:N,code:W,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return s.map(({icon:n,hotkeyText:o,...r})=>r)},menuItemsWithSeparator(){return s.map((n,o)=>o===2||o===4?{...n,separator:!0}:n)},menuItemsWithChildren(){return s.slice().concat({text:"Sub menu",icon:i(h),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:i(u)},{text:"Another Level",icon:i(h),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]})},menuItemsWithSelectedEntries(){return s.map((n,o)=>o===1||o===3?{...n,selected:!0}:n)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},s[0],s[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},s[3],s[4]]}},methods:{onItemClick(n,o,r){window.alert(`You clicked on menu ${r} on an item with a value of: ${JSON.stringify(o)}`)},onItemActive(n){this.hoveredItem=n}}};const m=n=>(y("data-v-5592189f"),n=n(),C(),n),O={class:"grid-container"},B={class:"grid-item-12"},D=m(()=>e("p",null," A component that displays a group of items. Supports keyboard navigation. ",-1)),L={class:"menu-items"},R={class:"menu-item-wrapper"},F=m(()=>e("div",{class:"menu-name"},"Normal",-1)),P={class:"card"},V={class:"menu-item-wrapper"},$=m(()=>e("div",{class:"menu-name"},[c(" With icons, "),e("br"),c("hotkeys and separators ")],-1)),j={class:"card"},z={class:"menu-item-wrapper"},G=m(()=>e("div",{class:"menu-name"},"With selected entries",-1)),J={class:"card"},U={class:"menu-item-wrapper"},Y=m(()=>e("div",{class:"menu-name"},"With sections",-1)),q={class:"card"},Q={class:"menu-item-wrapper"},X=m(()=>e("div",{class:"menu-name"},[c(" With keyboard navigation"),e("br"),c(" and scrollable content ")],-1)),Z={class:"card"},ee={class:"menu-item-wrapper"},ne=m(()=>e("div",{class:"menu-name"},"With submenu (children)",-1)),te={class:"card"},oe={class:"hover-preview"},ie={class:"hover-title"},se={class:"hover-content"};function ae(n,o,r,me,re,t){const d=v("MenuItems",!0),p=v("CodeExample");return f(),w("section",null,[e("div",O,[e("div",B,[D,e("div",L,[e("div",R,[F,e("div",P,[a(d,{id:"NORMAL",items:t.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",V,[$,e("div",j,[a(d,{id:"WITH_SEPARATORS",items:t.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",z,[G,e("div",J,[a(d,{id:"WITH_SELECTED_ENTRIES",items:t.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",U,[Y,e("div",q,[a(d,{id:"WITH_SECTIONS",items:t.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",Q,[X,e("button",{onKeydown:o[0]||(o[0]=x=>n.$refs.menuItemsWithNavigation.onKeydown(x))}," Focus me to start navigating ",32),e("div",Z,[a(d,{ref:"menuItemsWithNavigation",items:n.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",ee,[ne,e("div",te,[a(d,{id:"WITH_CHILDREN",items:t.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",oe,[e("div",ie,l(n.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",se,l(n.hoveredItem),1)]),a(p,{summary:"Show usage example"},{default:b(()=>[c(l(n.codeExampleStandalone),1)]),_:1}),a(p,{summary:"Show MenuItems.vue source code"},{default:b(()=>[c(l(n.code),1)]),_:1})])])])}const ve=_(K,[["render",ae],["__scopeId","data-v-5592189f"]]);export{ve as default};
