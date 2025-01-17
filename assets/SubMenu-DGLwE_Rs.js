import{_ as S,x as u,r as p,o as k,c as M,b as e,d as t,w as n,y as v,S as y,e as _,t as f,p as g,f as C}from"./index-Dj2AlS1B.js";import{H as x,S as d}from"./star-Pko6hvle.js";import{H as O,L as T}from"./leave-COFGuQ1d.js";import{M as W}from"./menu-options-Bv7M-cPS.js";import{C as B}from"./CodeExample-CCeogOWm.js";import{S as I}from"./SubMenu-DqZavyvf.js";import"./useClickOutside-DFGdzLTb.js";import"./MenuItems.vue_vue_type_style_index_0_lang-CIQ-0sCZ.js";import"./arrow-next-QpG-7bOh.js";import"./useDropdownNavigation-C2qSnUIA.js";import"./Checkbox-DzkHQyz3.js";const H="",A=`<script>
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import MenuIcon from '~/@knime/styles/img/icons/menu-options.svg';

const subMenuItems = [{
    href: 'https://apple.com',
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
`,h=[{href:"https://apple.com",text:"Apples",icon:u(x),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:u(d),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:u(d),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:u(O)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:u(T)},{text:"Item without href/to",icon:u(x),children:[{text:"I am part of a submenu",icon:d},{text:"Woohooo",href:"https://example.com/woohoo"}]},{text:"Item with checkbox",checkbox:{checked:!1,setBoolean:o=>window.alert(`Checkbox item clicked. Sub menu is not closed. Instead the setBoolean method of this item was called with the value: ${o}`)}}],E={components:{SubMenu:I,CodeExample:B,MenuIcon:W},data(){return{SubMenu:I,subMenuItems:h,codeExampleStandalone:A,code:H,teleport:!0}},computed:{subMenuItemsWithSeparator(){return h.map((o,a)=>a===2||a===4?{...o,separator:!0}:o)},subMenuItemsWithoutIcons(){return h.map(({icon:o,hotkeyText:a,...l})=>l)}}},s=o=>(g("data-v-ab5df574"),o=o(),C(),o),D={class:"grid-container"},N={class:"grid-item-12"},V=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),L={class:"submenus"},R={class:"card"},j=s(()=>e("span",{class:"menu-name"},"Normal",-1)),z={class:"card"},U=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),q={class:"card"},F=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),G={class:"card"},J=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),K={class:"card"},P=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1)),Q={class:"scroll-container"},X={class:"card translated"},Y=s(()=>e("span",{class:"menu-name"},"With teleport",-1));function Z(o,a,l,$,i,m){const c=p("MenuIcon"),r=p("SubMenu",!0),b=p("CodeExample");return k(),M("section",null,[e("div",D,[e("div",N,[V,e("div",L,[e("div",R,[j,t(r,{items:m.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["items"])]),e("div",z,[U,t(r,{items:m.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["items"])]),e("div",q,[F,t(r,{items:m.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["items"])]),e("div",G,[J,t(r,{items:i.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["items"])]),e("div",K,[P,t(r,{items:m.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["items"])]),e("div",Q,[e("div",X,[v(e("input",{"onUpdate:modelValue":a[0]||(a[0]=w=>i.teleport=w),type:"checkbox"},null,512),[[y,i.teleport]]),Y,t(r,{"teleport-to-body":i.teleport,items:m.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:n(()=>[t(c,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),t(b,{summary:"Show usage example"},{default:n(()=>[_(f(i.codeExampleStandalone),1)]),_:1}),t(b,{summary:"Show SubMenu.vue source code"},{default:n(()=>[_(f(i.code),1)]),_:1})])])])}const le=S(E,[["render",Z],["__scopeId","data-v-ab5df574"]]);export{le as default};
