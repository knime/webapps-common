import{S as h,H as _}from"./star-Iqldyan1.js";import{o as f,c as x,b as e,x as s,_ as g,r as w,d as m,t as l,w as k,e as d,p as C,f as S}from"./index-LDr8wY-6.js";import{L as u,H}from"./leave-wP4q_Iwn.js";import{C as y}from"./CodeExample-Bckx9qRZ.js";import{_ as W}from"./MenuItems.vue_vue_type_style_index_0_lang-DtJZwqy5.js";import"./arrow-next-aSwv9pi-.js";import"./useDropdownNavigation-DP02yRlV.js";import"./Checkbox-BjCpjq3L.js";const M={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},T=e("path",{d:"M23.3 22.7c3.6-.4 6.4-3.5 6.4-7.2 0-4-3.3-7.3-7.3-7.3h-.5c-1.1-3.2-4.1-5.5-7.7-5.5C9.7 2.8 6 6.4 6 10.9c0 .4 0 .8.1 1.2-2.2.7-3.7 2.8-3.7 5.2 0 3 2.4 5.5 5.5 5.5h.9m7.2-6v12.4m4-4-4 4-4-4"},null,-1),A=[T];function E(t,n){return f(),x("svg",M,[...A])}const N={render:E},D="",O=`<script>
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
`,i=[{href:"https://apple.com",text:"Apples",icon:s(_),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(h),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:s(h),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:s(H)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(u)},{text:"Item without href/to",icon:s(_)},{href:"https://www.knime.com/images/knime-logo.svg",text:"Item with download attribute",download:!0,icon:s(N)},{text:"Item with checkbox",checkbox:{checked:!0,setBoolean:t=>window.alert(`You clicked on a checkbox item calling its callback method with the value: ${t}`)}}],B={components:{MenuItems:W,CodeExample:y},data(){return{menuItemsData:i,codeExampleStandalone:O,code:D,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return i.map(({icon:t,hotkeyText:n,...a})=>a)},menuItemsWithSeparator(){return i.map((t,n)=>n===2||n===4?{...t,separator:!0}:t)},menuItemsWithChildren(){const t={text:"Sub menu",icon:s(u),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:s(h)},{text:"Another Level",icon:s(u),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]},[n,a,p]=i,I={...a,separator:!0,description:"… some long text that explains the action of this item ina way the user can better understand what happens if he click it."};return[{...n,separator:!0},I,p,t]},menuItemsWithSelectedEntries(){return i.map((t,n)=>n===1||n===3?{...t,selected:!0}:t)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},i[0],i[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},i[3],i[4]]}},methods:{onItemClick(t,n,a){window.alert(`You clicked on menu ${a} on an item with a value of: ${JSON.stringify(n)}`)},onItemActive(t){this.hoveredItem=t}}},c=t=>(C("data-v-b8ddce62"),t=t(),S(),t),L={class:"grid-container"},R={class:"grid-item-12"},V=c(()=>e("p",null," A component that displays a group of items. Supports keyboard navigation. ",-1)),j={class:"menu-items"},K={class:"menu-item-wrapper"},Y=c(()=>e("div",{class:"menu-name"},"Normal",-1)),F={class:"card"},J={class:"menu-item-wrapper"},P=c(()=>e("div",{class:"menu-name"},[d(" With icons, "),e("br"),d("hotkeys and separators ")],-1)),q={class:"card"},z={class:"menu-item-wrapper"},G=c(()=>e("div",{class:"menu-name"},"With selected entries",-1)),Q={class:"card"},U={class:"menu-item-wrapper"},X=c(()=>e("div",{class:"menu-name"},"With sections",-1)),Z={class:"card"},$={class:"menu-item-wrapper"},ee=c(()=>e("div",{class:"menu-name"},[d(" With keyboard navigation"),e("br"),d(" and scrollable content ")],-1)),te={class:"card"},oe={class:"menu-item-wrapper"},ne=c(()=>e("div",{class:"menu-name"}," With submenu (children) and a long description ",-1)),se={class:"card"},ie={class:"hover-preview"},ae={class:"hover-title"},me={class:"hover-content"};function ce(t,n,a,p,I,o){const r=w("MenuItems",!0),v=w("CodeExample");return f(),x("section",null,[e("div",L,[e("div",R,[V,e("div",j,[e("div",K,[Y,e("div",F,[m(r,{id:"NORMAL",items:o.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",J,[P,e("div",q,[m(r,{id:"WITH_SEPARATORS",items:o.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",z,[G,e("div",Q,[m(r,{id:"WITH_SELECTED_ENTRIES",items:o.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",U,[X,e("div",Z,[m(r,{id:"WITH_SECTIONS",items:o.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",$,[ee,e("button",{onKeydown:n[0]||(n[0]=b=>t.$refs.menuItemsWithNavigation.onKeydown(b))}," Focus me to start navigating ",32),e("div",te,[m(r,{ref:"menuItemsWithNavigation",items:t.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",oe,[ne,e("div",se,[m(r,{id:"WITH_CHILDREN",items:o.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",ie,[e("div",ae,l(t.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",me,l(t.hoveredItem),1)]),m(v,{summary:"Show usage example"},{default:k(()=>[d(l(t.codeExampleStandalone),1)]),_:1}),m(v,{summary:"Show MenuItems.vue source code"},{default:k(()=>[d(l(t.code),1)]),_:1})])])])}const _e=g(B,[["render",ce],["__scopeId","data-v-b8ddce62"]]);export{_e as default};
