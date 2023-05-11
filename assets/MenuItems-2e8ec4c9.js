import{C as g}from"./CodeExample-6943b8d5.js";import{_ as v,H as _,L as h}from"./heart-90160fc9.js";import{H as b,S as p}from"./star-cbd5e2dc.js";import{m as s,_ as k,o as y,c as M,b as e,d as a,t as u,w as x,e as c,r as f,p as C,f as S}from"./index-1d96568f.js";import"./arrow-next-99507fc3.js";const E=`<script setup lang="ts">/**
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
 * Use the selector \`:deep(.menu-items-sub-level)\` to style the sub menus (e. g. box-shadow).
 *
 */
import { type FunctionalComponent, nextTick, ref, type Ref, type SVGAttributes } from 'vue';
import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import BaseMenuItems from './BaseMenuItems.vue';
import BaseMenuItem from './BaseMenuItem.vue';
import ArrowNextIcon from '../assets/img/icons/arrow-next.svg';

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
  children?: Array<MenuItem>
}

type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean,
    registerKeydown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disableSpaceToClick: false,
    registerKeydown: false
});

interface Emits {
    (e: 'close'): void
    (e: 'item-click', event: MouseEvent, item: MenuItem, menuId: string): void
    (e: 'item-focused', itemId: string|null, item: MenuItem|null): void
    (e: 'item-hovered', item: MenuItem|null, menuId: string, index: number): void
    (e: 'close-submenu'): void
}

const emit = defineEmits<Emits>();
const baseMenuItems: Ref<InstanceType<typeof BaseMenuItems> | null> = ref(null);
const openSubmenuItemIndex = ref(-1);
const subLevelItems = ref<any>(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
    if (!baseMenuItems.value) {
        return {
            onClick: () => {
            },
            index: -1
        };
    }

    const listItems = baseMenuItems.value.getEnabledListItems();
    let currentIndexInEnabled = listItems
        .map<number | null>(({ index }) => index)
        .indexOf(current);

    if (currentIndexInEnabled === -1 && direction === -1) {
        currentIndexInEnabled = 0;
    }
    const nextIndex = getWrappedAroundIndex(currentIndexInEnabled + direction, listItems.length);

    const { element, index, onClick } = listItems[nextIndex];
    baseMenuItems.value.scrollTo(element);

    return { index, onClick };
};

const { currentIndex, onKeydown: onDropdownNavigationKeydown, resetNavigation } = useDropdownNavigation({
    disableSpaceToClick: props.disableSpaceToClick,
    getNextElement,
    close: () => emit('close')
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
        case 'ArrowLeft':
            emit('close-submenu');
            break;
        case 'ArrowRight':
            setOpenSubmenuIndex(currentIndex.value ?? 0);
            nextTick(() => {
                subLevelItems.value?.focusIndex();
            });
            break;
    }
    onDropdownNavigationKeydown(event);
};

const onItemHovered = (item: MenuItem|null, id: string, index: number) => {
    if (item !== null) {
        setOpenSubmenuIndex(index);
    }
    emit('item-hovered', item, id, index);
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
    <template #item="{ item, menuId, menuItemId, index, maxMenuWidth, focusedItemIndex }">
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
`,T=`<script>
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
`,o=[{href:"http://apple.com",text:"Apples",icon:s(b),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(p),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:s(p),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:s(_)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(h)},{text:"Item without href/to",icon:s(b)}],A={components:{MenuItems:v,CodeExample:g},data(){return{MenuItems:v,menuItemsData:o,codeExampleStandalone:T,code:E,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return o.map(({icon:t,hotkeyText:i,...r})=>r)},menuItemsWithSeparator(){return o.map((t,i)=>i===2||i===4?{...t,separator:!0}:t)},menuItemsWithChildren(){return o.slice().concat({text:"Sub menu",icon:s(h),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:s(p)},{text:"Another Level",icon:s(h),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]})},menuItemsWithSelectedEntries(){return o.map((t,i)=>i===1||i===3?{...t,selected:!0}:t)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},o[0],o[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},o[3],o[4]]}},methods:{onItemClick(t,i,r){window.alert(`You clicked on menu ${r} on an item with a value of: ${JSON.stringify(i)}`)},onItemActive(t){this.hoveredItem=t}}};const m=t=>(C("data-v-67ab3dc0"),t=t(),S(),t),H={class:"grid-container"},W={class:"grid-item-12"},N=m(()=>e("h2",null,"MenuItems",-1)),K=m(()=>e("p",null,"A component that displays a group of items. Supports keyboard navigation.",-1)),O={class:"menu-items"},B={class:"menu-item-wrapper"},D=m(()=>e("div",{class:"menu-name"},"Normal",-1)),L={class:"card"},R={class:"menu-item-wrapper"},F=m(()=>e("div",{class:"menu-name"},[c("With icons, "),e("br"),c("hotkeys and separators")],-1)),P={class:"card"},V={class:"menu-item-wrapper"},z=m(()=>e("div",{class:"menu-name"},"With selected entries",-1)),G={class:"card"},j={class:"menu-item-wrapper"},J=m(()=>e("div",{class:"menu-name"},"With sections",-1)),U={class:"card"},Y={class:"menu-item-wrapper"},q=m(()=>e("div",{class:"menu-name"},[c("With keyboard navigation"),e("br"),c(" and scrollable content")],-1)),Q={class:"card"},X={class:"menu-item-wrapper"},Z=m(()=>e("div",{class:"menu-name"},"With submenu (children)",-1)),$={class:"card"},ee={class:"hover-preview"},ne={class:"hover-title"},te={class:"hover-content"};function ie(t,i,r,oe,l,n){const d=f("MenuItems",!0),I=f("CodeExample");return y(),M("section",null,[e("div",H,[e("div",W,[N,K,e("div",O,[e("div",B,[D,e("div",L,[a(d,{id:"NORMAL",items:n.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",R,[F,e("div",P,[a(d,{id:"WITH_SEPARATORS",items:n.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",V,[z,e("div",G,[a(d,{id:"WITH_SELECTED_ENTRIES",items:n.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",j,[J,e("div",U,[a(d,{id:"WITH_SECTIONS",items:n.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",Y,[q,e("button",{onKeydown:i[0]||(i[0]=w=>t.$refs.menuItemsWithNavigation.onKeydown(w))}," Focus me to start navigating ",32),e("div",Q,[a(d,{ref:"menuItemsWithNavigation",items:l.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",X,[Z,e("div",$,[a(d,{id:"WITH_CHILDREN",items:n.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:n.onItemClick,onItemHovered:n.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",ee,[e("div",ne,u(l.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",te,u(l.hoveredItem),1)]),a(I,{summary:"Show usage example"},{default:x(()=>[c(u(l.codeExampleStandalone),1)]),_:1}),a(I,{summary:"Show MenuItems.vue source code"},{default:x(()=>[c(u(l.code),1)]),_:1})])])])}const ce=k(A,[["render",ie],["__scopeId","data-v-67ab3dc0"]]);export{ce as default};
