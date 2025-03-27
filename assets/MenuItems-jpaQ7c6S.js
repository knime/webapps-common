import{S as h,H as _}from"./star-3FlHBvPb.js";import{D as x}from"./cloud-download-FvJAT1RV.js";import{L as u,H as b}from"./leave-xonl5z1T.js";import{C}from"./CodeExample-I3gU61C0.js";import{_ as g}from"./MenuItems.vue_vue_type_style_index_0_lang-Cm1BPEDS.js";import{x as s,_ as S,r as w,o as H,c as y,b as e,d as m,t as l,w as k,e as d,p as W,f as M}from"./index-CPQ6JZIw.js";import"./arrow-next-CoFPsu6-.js";import"./useDropdownNavigation-DEKc5UjP.js";import"./Checkbox-COLavphM.js";const T="",A=`<script>
import MenuItems from '~/webapps-common/ui/components/MenuItems.vue';
import MenuIcon from '~/@knime/styles/img/icons/menu-options.svg';

const items = [{
    href: 'https://apple.com',
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
`,i=[{href:"https://apple.com",text:"Apples",icon:s(_),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(h),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:s(h),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:s(b)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(u)},{text:"Item without href/to",icon:s(_)},{href:"https://www.knime.com/images/knime-logo.svg",text:"Item with download attribute",download:!0,icon:s(x)},{text:"Item with checkbox",checkbox:{checked:!0,setBoolean:t=>window.alert(`You clicked on a checkbox item calling its callback method with the value: ${t}`)}}],E={components:{MenuItems:g,CodeExample:C},data(){return{menuItemsData:i,codeExampleStandalone:A,code:T,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return i.map(({icon:t,hotkeyText:n,...a})=>a)},menuItemsWithSeparator(){return i.map((t,n)=>n===2||n===4?{...t,separator:!0}:t)},menuItemsWithChildren(){const t={text:"Sub menu",icon:s(u),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:s(h)},{text:"Another Level",icon:s(u),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]},[n,a,p]=i,I={...a,separator:!0,description:"… some long text that explains the action of this item ina way the user can better understand what happens if he click it."};return[{...n,separator:!0},I,p,t]},menuItemsWithSelectedEntries(){return i.map((t,n)=>n===1||n===3?{...t,selected:!0}:t)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},i[0],i[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},i[3],i[4]]}},methods:{onItemClick(t,n,a){window.alert(`You clicked on menu ${a} on an item with a value of: ${JSON.stringify(n)}`)},onItemActive(t){this.hoveredItem=t}}},c=t=>(W("data-v-b8ddce62"),t=t(),M(),t),D={class:"grid-container"},N={class:"grid-item-12"},O=c(()=>e("p",null," A component that displays a group of items. Supports keyboard navigation. ",-1)),L={class:"menu-items"},R={class:"menu-item-wrapper"},B=c(()=>e("div",{class:"menu-name"},"Normal",-1)),V={class:"card"},K={class:"menu-item-wrapper"},Y=c(()=>e("div",{class:"menu-name"},[d(" With icons, "),e("br"),d("hotkeys and separators ")],-1)),j={class:"card"},F={class:"menu-item-wrapper"},J=c(()=>e("div",{class:"menu-name"},"With selected entries",-1)),P={class:"card"},q={class:"menu-item-wrapper"},z=c(()=>e("div",{class:"menu-name"},"With sections",-1)),G={class:"card"},Q={class:"menu-item-wrapper"},U=c(()=>e("div",{class:"menu-name"},[d(" With keyboard navigation"),e("br"),d(" and scrollable content ")],-1)),X={class:"card"},Z={class:"menu-item-wrapper"},$=c(()=>e("div",{class:"menu-name"}," With submenu (children) and a long description ",-1)),ee={class:"card"},te={class:"hover-preview"},oe={class:"hover-title"},ne={class:"hover-content"};function se(t,n,a,p,I,o){const r=w("MenuItems",!0),v=w("CodeExample");return H(),y("section",null,[e("div",D,[e("div",N,[O,e("div",L,[e("div",R,[B,e("div",V,[m(r,{id:"NORMAL",items:o.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",K,[Y,e("div",j,[m(r,{id:"WITH_SEPARATORS",items:o.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",F,[J,e("div",P,[m(r,{id:"WITH_SELECTED_ENTRIES",items:o.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",q,[z,e("div",G,[m(r,{id:"WITH_SECTIONS",items:o.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",Q,[U,e("button",{onKeydown:n[0]||(n[0]=f=>t.$refs.menuItemsWithNavigation.onKeydown(f))}," Focus me to start navigating ",32),e("div",X,[m(r,{ref:"menuItemsWithNavigation",items:t.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",Z,[$,e("div",ee,[m(r,{id:"WITH_CHILDREN",items:o.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",te,[e("div",oe,l(t.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",ne,l(t.hoveredItem),1)]),m(v,{summary:"Show usage example"},{default:k(()=>[d(l(t.codeExampleStandalone),1)]),_:1}),m(v,{summary:"Show MenuItems.vue source code"},{default:k(()=>[d(l(t.code),1)]),_:1})])])])}const pe=S(E,[["render",se],["__scopeId","data-v-b8ddce62"]]);export{pe as default};
