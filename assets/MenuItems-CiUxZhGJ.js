import{S as d,H as v}from"./star-CNyfViNC.js";import{D as x}from"./cloud-download-tXl0WLid.js";import{L as u,H as _}from"./leave-Cx8Deu2p.js";import{C as b}from"./CodeExample-Cwr_Q9dd.js";import{_ as C}from"./MenuItems.vue_vue_type_style_index_0_lang-iW3RIfQh.js";import{s as i,_ as g,r as k,o as H,c as S,b as e,d as m,e as c,t as l,w}from"./index-DfU7U_XU.js";import"./arrow-next-BKCq6pS4.js";import"./useDropdownNavigation-as_gUHbD.js";import"./Checkbox-CBt-62jc.js";const y="",W=`<script>
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
`,s=[{href:"https://apple.com",text:"Apples",icon:i(v),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:i(d),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:i(d),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:i(_)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:i(u)},{text:"Item without href/to",icon:i(v)},{href:"https://www.knime.com/images/knime-logo.svg",text:"Item with download attribute",download:!0,icon:i(x)},{text:"Item with checkbox",checkbox:{checked:!0,setBoolean:n=>window.alert(`You clicked on a checkbox item calling its callback method with the value: ${n}`)}}],M={components:{MenuItems:C,CodeExample:b},data(){return{menuItemsData:s,codeExampleStandalone:W,code:y,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return s.map(({icon:n,hotkeyText:t,...a})=>a)},menuItemsWithSeparator(){return s.map((n,t)=>t===2||t===4?{...n,separator:!0}:n)},menuItemsWithChildren(){const n={text:"Sub menu",icon:i(u),children:[{text:"I am part of a submenu",href:"https://example.com/woohoo",icon:i(d)},{text:"Another Level",icon:i(u),children:[{text:"Something…",href:"https://example.com/another-thing"},{text:"We need more submenus",href:"https://example.com/woohoo"}]}]},[t,a,h]=s,p={...a,separator:!0,description:"… some long text that explains the action of this item ina way the user can better understand what happens if he click it."};return[{...t,separator:!0},p,h,n]},menuItemsWithSelectedEntries(){return s.map((n,t)=>t===1||t===3?{...n,selected:!0}:n)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},s[0],s[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},s[3],s[4]]}},methods:{onItemClick(n,t,a){window.alert(`You clicked on menu ${a} on an item with a value of: ${JSON.stringify(t)}`)},onItemActive(n){this.hoveredItem=n}}},T={class:"grid-container"},A={class:"grid-item-12"},E={class:"menu-items"},D={class:"menu-item-wrapper"},N={class:"card"},O={class:"menu-item-wrapper"},L={class:"card"},R={class:"menu-item-wrapper"},B={class:"card"},V={class:"menu-item-wrapper"},K={class:"card"},Y={class:"menu-item-wrapper"},j={class:"card"},F={class:"menu-item-wrapper"},J={class:"card"},P={class:"hover-preview"},q={class:"hover-title"},z={class:"hover-content"};function G(n,t,a,h,p,o){const r=k("MenuItems",!0),I=k("CodeExample");return H(),S("section",null,[e("div",T,[e("div",A,[t[7]||(t[7]=e("p",null," A component that displays a group of items. Supports keyboard navigation. ",-1)),e("div",E,[e("div",D,[t[1]||(t[1]=e("div",{class:"menu-name"},"Normal",-1)),e("div",N,[m(r,{id:"NORMAL",items:o.menuItemsWithoutIcons,"menu-aria-label":"Menu items without icons",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",O,[t[2]||(t[2]=e("div",{class:"menu-name"},[c(" With icons, "),e("br"),c("hotkeys and separators ")],-1)),e("div",L,[m(r,{id:"WITH_SEPARATORS",items:o.menuItemsWithSeparator,"menu-aria-label":"Menu items with separators",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",R,[t[3]||(t[3]=e("div",{class:"menu-name"},"With selected entries",-1)),e("div",B,[m(r,{id:"WITH_SELECTED_ENTRIES",items:o.menuItemsWithSelectedEntries,"menu-aria-label":"Menu items with selected entries",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",V,[t[4]||(t[4]=e("div",{class:"menu-name"},"With sections",-1)),e("div",K,[m(r,{id:"WITH_SECTIONS",items:o.menuItemsWithSections,"menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",Y,[t[5]||(t[5]=e("div",{class:"menu-name"},[c(" With keyboard navigation"),e("br"),c(" and scrollable content ")],-1)),e("button",{onKeydown:t[0]||(t[0]=f=>n.$refs.menuItemsWithNavigation.onKeydown(f))}," Focus me to start navigating ",32),e("div",j,[m(r,{ref:"menuItemsWithNavigation",items:n.menuItemsData,class:"menu-items-with-navigation","menu-aria-label":"Menu items with sections",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])]),e("div",F,[t[6]||(t[6]=e("div",{class:"menu-name"}," With submenu (children) and a long description ",-1)),e("div",J,[m(r,{id:"WITH_CHILDREN",items:o.menuItemsWithChildren,"menu-aria-label":"Menu items with children",onItemClick:o.onItemClick,onItemHovered:o.onItemActive},null,8,["items","onItemClick","onItemHovered"])])])]),e("div",P,[e("div",q,l(n.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",z,l(n.hoveredItem),1)]),m(I,{summary:"Show usage example"},{default:w(()=>[c(l(n.codeExampleStandalone),1)]),_:1}),m(I,{summary:"Show MenuItems.vue source code"},{default:w(()=>[c(l(n.code),1)]),_:1})])])])}const ie=g(M,[["render",G],["__scopeId","data-v-b8ddce62"]]);export{ie as default};
