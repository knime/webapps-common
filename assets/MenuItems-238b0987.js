import{C as k}from"./CodeExample-ac577fc1.js";import{_ as h,H as b,L as x}from"./heart-48de73e1.js";import{H as p,S as I}from"./star-5e4fbd97.js";import{m as d,_ as g,o as y,c as A,b as e,d as s,t as l,w as v,e as _,r as f,p as C,f as S}from"./index-69379855.js";const M=`<script setup lang="ts">
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

import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import MenuItemsBase from './MenuItemsBase.vue';
import type { MenuItem } from './MenuItemsBase.vue';
import { ref } from 'vue';

const emit = defineEmits(['close', 'item-click', 'item-focused', 'item-hovered']);

const props = defineProps<{items: MenuItem[], menuAriaLabel: string}>();

const menuItemsBase: any = ref(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
    const listItems = menuItemsBase.value.getEnabledListItems();
    let currentIndexInEnabled = listItems.map(({ index } : {index: number}) => index).indexOf(current);
    if (currentIndexInEnabled === -1 && direction === -1) {
        currentIndexInEnabled = 0;
    }
    const nextIndex = getWrappedAroundIndex(currentIndexInEnabled + direction, listItems.length);
    return listItems[nextIndex];
};

const { currentIndex, onKeydown, resetNavigation } = useDropdownNavigation(
    {
        getNextElement,
        close: () => emit('close')
    }
);
defineExpose({
    onKeydown, resetNavigation
});
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
    @item-focused="(itemId) => $emit('item-focused', itemId)"
  />
</template>
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
`,o=[{href:"http://apple.com",text:"Apples",icon:d(p),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:d(I),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:d(I),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:d(b)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:d(x)},{text:"Item without href/to",icon:d(p)}],W={components:{MenuItems:h,CodeExample:k},data(){return{MenuItems:h,menuItemsData:o,codeExampleStandalone:E,code:M,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return o.map(({icon:n,hotkeyText:i,...m})=>m)},menuItemsWithSeparator(){return o.map((n,i)=>i===2||i===4?{...n,separator:!0}:n)},menuItemsWithSelectedEntries(){return o.map((n,i)=>i===1||i===3?{...n,selected:!0}:n)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},o[0],o[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},o[3],o[4]]}},methods:{onItemClick(n,i,m){window.alert(`You clicked on menu ${m} on an item with a value of: ${JSON.stringify(i)}`)},onItemActive(n){this.hoveredItem=n}}};const a=n=>(C("data-v-e9ebfd6f"),n=n(),S(),n),T={class:"grid-container"},N={class:"grid-item-12"},H=a(()=>e("h2",null,"MenuItems",-1)),D=a(()=>e("p",null,"A component that displays a group of items. Supports keyboard navigation.",-1)),B={class:"menu-items"},O={class:"menu-item-wrapper"},L=a(()=>e("div",{class:"menu-name"},"Normal",-1)),R={class:"card"},K={class:"menu-item-wrapper"},F=a(()=>e("div",{class:"menu-name"},"With icons and hotkeys",-1)),P={class:"card"},V={class:"menu-item-wrapper"},Y=a(()=>e("div",{class:"menu-name"},"With separators",-1)),j={class:"card"},J={class:"menu-item-wrapper"},q=a(()=>e("div",{class:"menu-name"},"With selected entries",-1)),z={class:"card"},G={class:"menu-item-wrapper"},Q=a(()=>e("div",{class:"menu-name"},"With sections",-1)),U={class:"card"},X={class:"menu-item-wrapper"},Z=a(()=>e("div",{class:"menu-name"},"With keyboard navigation",-1)),$={class:"card"},ee={class:"hover-preview"},te={class:"hover-title"},ne={class:"hover-content"};function ie(n,i,m,se,c,t){const r=f("MenuItems",!0),u=f("CodeExample");return y(),A("section",null,[e("div",T,[e("div",N,[H,D,e("div",B,[e("div",O,[L,e("div",R,[s(r,{id:"NORMAL",items:t.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",K,[F,e("div",P,[s(r,{id:"WITH_ICONS_AND_HOTKEYS",items:c.menuItemsData,"menu-aria-label":"Menu items with icons and hotkeys",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",V,[Y,e("div",j,[s(r,{id:"WITH_SEPARATORS",items:t.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",J,[q,e("div",z,[s(r,{id:"WITH_SELECTED_ENTRIES",items:t.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",G,[Q,e("div",U,[s(r,{id:"WITH_SECTIONS",items:t.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",X,[Z,e("button",{onKeydown:i[0]||(i[0]=w=>n.$refs.menuItemsWithNavigation.onKeydown(w))}," Focus me to start navigating ",32),e("div",$,[s(r,{ref:"menuItemsWithNavigation",items:c.menuItemsData,"menu-aria-label":"Menu items with sections",onItemClick:t.onItemClick,onItemActive:t.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",ee,[e("div",te,l(c.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",ne,l(c.hoveredItem),1)])]),s(u,{summary:"Show usage example"},{default:v(()=>[_(l(c.codeExampleStandalone),1)]),_:1}),s(u,{summary:"Show MenuItems.vue source code"},{default:v(()=>[_(l(c.code),1)]),_:1})])])])}const re=g(W,[["render",ie],["__scopeId","data-v-e9ebfd6f"]]);export{re as default};
