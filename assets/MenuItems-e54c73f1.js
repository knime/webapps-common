import{C as w}from"./CodeExample-1122a323.js";import{_ as h,H as b,L as x}from"./heart-6c1db8cb.js";import{H as p,S as I}from"./star-9ec69e60.js";import{m as l,_ as g,o as y,c as C,b as e,d as s,t as d,w as v,e as _,r as f,p as S,f as M}from"./index-c99bab3b.js";const H=`<script setup lang="ts">
/**
 * MenuItems component with (optional) hotkey text and icons
 * Can be used to create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * The elements of the menu are not focusable.
 * Instead the component exposes a onKeydown method, which can be taken as a listener for keydown events on a focused
 * element in a parent component. When doing so, the elements in the menu are maked via keyboard navigation.
 * For accessibility, the focused outside element which listens to keydown events needs to have an aria-activedescendant
 * label set to the id of the visually focused element and additionally an aria-owns label with the same id if the menu items are
 * not DOM-descendants of this element (see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
 * This id is emitted via the \`@item-focused\` event whenever the visually focused item changes. This emit also yields null whenever no element
 * is visually focused.
 *
 * For some keydown events, a \`@close\` event is emitted.
 *
 * A click or activation by keyboard (enter and space) emits \`@item-click\`.
 * If the data has a \`to\` attribute the used tag will be \`nuxt-link\` if it has a \`href\` attribute it will be a \`a\` tag
 * otherwise we use the generic \`button\` and leave the handling of the action to the wrapping component that reacts
 * to \`item-click\` and calls any action.
 *
 * Hovering an item emits \`@item-hovered\`.
 */

import { ref, type Ref } from 'vue';
import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import MenuItemsBase from './MenuItemsBase.vue';
import type { MenuItem } from './MenuItemsBase.vue';

type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean
}

const props = withDefaults(defineProps<Props>(), { disableSpaceToClick: false });

const emit = defineEmits(['close', 'item-click', 'item-focused', 'item-hovered']);
const menuItemsBase: Ref<InstanceType<typeof MenuItemsBase> | null> = ref(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
    if (!menuItemsBase.value) {
        return { onClick: () => {}, index: -1 };
    }

    const listItems = menuItemsBase.value.getEnabledListItems();
    let currentIndexInEnabled = listItems
        .map<number | null>(({ index }) => index)
        .indexOf(current);

    if (currentIndexInEnabled === -1 && direction === -1) {
        currentIndexInEnabled = 0;
    }
    const nextIndex = getWrappedAroundIndex(currentIndexInEnabled + direction, listItems.length);

    const { element, index, onClick } = listItems[nextIndex];
    menuItemsBase.value.scrollTo(element);

    return { index, onClick };
};

const { currentIndex, onKeydown, resetNavigation } = useDropdownNavigation({
    disableSpaceToClick: props.disableSpaceToClick,
    getNextElement,
    close: () => emit('close')
});

defineExpose({ onKeydown, resetNavigation });
<\/script>

<template>
  <MenuItemsBase
    ref="menuItemsBase"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    @item-click="(event, item, id) => $emit('item-click', event, item, id)"
    @item-hovered="(item, id) => $emit('item-hovered', item, id)"
    @item-focused="(...args) => $emit('item-focused', ...args)"
  />
</template>
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
`,i=[{href:"http://apple.com",text:"Apples",icon:l(p),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:l(I),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:l(I),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:l(b)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:l(x)},{text:"Item without href/to",icon:l(p)}],A={components:{MenuItems:h,CodeExample:w},data(){return{MenuItems:h,menuItemsData:i,codeExampleStandalone:T,code:H,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return i.map(({icon:n,hotkeyText:o,...m})=>m)},menuItemsWithSeparator(){return i.map((n,o)=>o===2||o===4?{...n,separator:!0}:n)},menuItemsWithSelectedEntries(){return i.map((n,o)=>o===1||o===3?{...n,selected:!0}:n)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},i[0],i[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},i[3],i[4]]}},methods:{onItemClick(n,o,m){window.alert(`You clicked on menu ${m} on an item with a value of: ${JSON.stringify(o)}`)},onItemActive(n){this.hoveredItem=n}}};const a=n=>(S("data-v-882f1dc9"),n=n(),M(),n),E={class:"grid-container"},W={class:"grid-item-12"},N=a(()=>e("h2",null,"MenuItems",-1)),B=a(()=>e("p",null,"A component that displays a group of items. Supports keyboard navigation.",-1)),D={class:"menu-items"},O={class:"menu-item-wrapper"},R=a(()=>e("div",{class:"menu-name"},"Normal",-1)),L={class:"card"},K={class:"menu-item-wrapper"},P=a(()=>e("div",{class:"menu-name"},"With icons and hotkeys",-1)),F={class:"card"},V={class:"menu-item-wrapper"},Y=a(()=>e("div",{class:"menu-name"},"With separators",-1)),j={class:"card"},J={class:"menu-item-wrapper"},q=a(()=>e("div",{class:"menu-name"},"With selected entries",-1)),z={class:"card"},G={class:"menu-item-wrapper"},Q=a(()=>e("div",{class:"menu-name"},"With sections",-1)),U={class:"card"},X={class:"menu-item-wrapper"},Z=a(()=>e("div",{class:"menu-name"},"With keyboard navigation and scrollable content",-1)),$={class:"card"},ee={class:"hover-preview"},te={class:"hover-title"},ne={class:"hover-content"};function oe(n,o,m,se,c,t){const r=f("MenuItems",!0),u=f("CodeExample");return y(),C("section",null,[e("div",E,[e("div",W,[N,B,e("div",D,[e("div",O,[R,e("div",L,[s(r,{id:"NORMAL",items:t.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",K,[P,e("div",F,[s(r,{id:"WITH_ICONS_AND_HOTKEYS",items:c.menuItemsData,"menu-aria-label":"Menu items with icons and hotkeys",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",V,[Y,e("div",j,[s(r,{id:"WITH_SEPARATORS",items:t.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",J,[q,e("div",z,[s(r,{id:"WITH_SELECTED_ENTRIES",items:t.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",G,[Q,e("div",U,[s(r,{id:"WITH_SECTIONS",items:t.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",X,[Z,e("button",{onKeydown:o[0]||(o[0]=k=>n.$refs.menuItemsWithNavigation.onKeydown(k))}," Focus me to start navigating ",32),e("div",$,[s(r,{ref:"menuItemsWithNavigation",items:c.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemHovered:t.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",ee,[e("div",te,d(c.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",ne,d(c.hoveredItem),1)])]),s(u,{summary:"Show usage example"},{default:v(()=>[_(d(c.codeExampleStandalone),1)]),_:1}),s(u,{summary:"Show MenuItems.vue source code"},{default:v(()=>[_(d(c.code),1)]),_:1})])])])}const re=g(A,[["render",oe],["__scopeId","data-v-882f1dc9"]]);export{re as default};
