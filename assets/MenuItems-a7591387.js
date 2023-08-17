import{C as x}from"./CodeExample-f3d2112a.js";import{_ as w}from"./MenuItems.vue_vue_type_style_index_0_lang-c1fb8125.js";import{H as I,S as u}from"./star-883bb2b6.js";import{H as g,L as h}from"./heart-26e3c3c7.js";import{m as s,_ as k,r as v,o as y,c as _,b as e,d as a,t as l,w as b,e as c,p as C,f as M}from"./index-4d0db3cf.js";import"./lodash-6914c63d.js";import"./arrow-next-6320b51e.js";const S=`<script setup lang="ts">
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
`,E=`<script>
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
`,o=[{href:"http://apple.com",text:"Apples",icon:s(I),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(u),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:s(u),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:s(g)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(h)},{text:"Item without href/to",icon:s(I)}],T={components:{MenuItems:w,CodeExample:x},data(){return{menuItemsData:o,codeExampleStandalone:E,code:S,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return o.map(({icon:n,hotkeyText:i,...r})=>r)},menuItemsWithSeparator(){return o.map((n,i)=>i===2||i===4?{...n,separator:!0}:n)},menuItemsWithChildren(){return o.slice().concat({text:"Sub menu",icon:s(h),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:s(u)},{text:"Another Level",icon:s(h),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]})},menuItemsWithSelectedEntries(){return o.map((n,i)=>i===1||i===3?{...n,selected:!0}:n)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},o[0],o[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},o[3],o[4]]}},methods:{onItemClick(n,i,r){window.alert(`You clicked on menu ${r} on an item with a value of: ${JSON.stringify(i)}`)},onItemActive(n){this.hoveredItem=n}}};const m=n=>(C("data-v-3f18dc8f"),n=n(),M(),n),A={class:"grid-container"},H={class:"grid-item-12"},W=m(()=>e("p",null," A component that displays a group of items. Supports keyboard navigation. ",-1)),N={class:"menu-items"},K={class:"menu-item-wrapper"},O=m(()=>e("div",{class:"menu-name"},"Normal",-1)),B={class:"card"},D={class:"menu-item-wrapper"},L=m(()=>e("div",{class:"menu-name"},[c(" With icons, "),e("br"),c("hotkeys and separators ")],-1)),R={class:"card"},F={class:"menu-item-wrapper"},P=m(()=>e("div",{class:"menu-name"},"With selected entries",-1)),V={class:"card"},z={class:"menu-item-wrapper"},G=m(()=>e("div",{class:"menu-name"},"With sections",-1)),j={class:"card"},J={class:"menu-item-wrapper"},U=m(()=>e("div",{class:"menu-name"},[c(" With keyboard navigation"),e("br"),c(" and scrollable content ")],-1)),Y={class:"card"},$={class:"menu-item-wrapper"},q=m(()=>e("div",{class:"menu-name"},"With submenu (children)",-1)),Q={class:"card"},X={class:"hover-preview"},Z={class:"hover-title"},ee={class:"hover-content"};function ne(n,i,r,te,ie,t){const d=v("MenuItems",!0),p=v("CodeExample");return y(),_("section",null,[e("div",A,[e("div",H,[W,e("div",N,[e("div",K,[O,e("div",B,[a(d,{id:"NORMAL",items:t.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",D,[L,e("div",R,[a(d,{id:"WITH_SEPARATORS",items:t.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",F,[P,e("div",V,[a(d,{id:"WITH_SELECTED_ENTRIES",items:t.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",z,[G,e("div",j,[a(d,{id:"WITH_SECTIONS",items:t.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",J,[U,e("button",{onKeydown:i[0]||(i[0]=f=>n.$refs.menuItemsWithNavigation.onKeydown(f))}," Focus me to start navigating ",32),e("div",Y,[a(d,{ref:"menuItemsWithNavigation",items:n.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",$,[q,e("div",Q,[a(d,{id:"WITH_CHILDREN",items:t.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",X,[e("div",Z,l(n.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",ee,l(n.hoveredItem),1)]),a(p,{summary:"Show usage example"},{default:b(()=>[c(l(n.codeExampleStandalone),1)]),_:1}),a(p,{summary:"Show MenuItems.vue source code"},{default:b(()=>[c(l(n.code),1)]),_:1})])])])}const le=k(T,[["render",ne],["__scopeId","data-v-3f18dc8f"]]);export{le as default};
