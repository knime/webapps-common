import{_ as k,s as u,r as c,o as M,c as _,b as t,d as o,w as n,v,Q as S,e as h,t as f}from"./index-CZy0S33y.js";import{H as x,S as p}from"./star-BzTtYFxX.js";import{H as y,L as g}from"./leave-BpxPeSei.js";import{M as C}from"./menu-options-CdNpAaG1.js";import{C as O}from"./CodeExample-CO0OY_WG.js";import{S as w}from"./SubMenu--432lBCX.js";import"./MenuItems.vue_vue_type_style_index_0_lang-DWssi49A.js";import"./arrow-next-B5NZMH3G.js";import"./useDropdownNavigation-ayaIQ7wF.js";import"./Checkbox-C-SjSk5L.js";const T="",W=`<script>
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
`,d=[{href:"https://apple.com",text:"Apples",icon:u(x),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:u(p),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:u(p),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:u(y)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:u(g)},{text:"Item without href/to",icon:u(x),children:[{text:"I am part of a submenu",icon:p},{text:"Woohooo",href:"https://example.com/woohoo"}]},{text:"Item with checkbox",checkbox:{checked:!1,setBoolean:s=>window.alert(`Checkbox item clicked. Sub menu is not closed. Instead the setBoolean method of this item was called with the value: ${s}`)}}],B={components:{SubMenu:w,CodeExample:O,MenuIcon:C},data(){return{SubMenu:w,subMenuItems:d,codeExampleStandalone:W,code:T,teleport:!0}},computed:{subMenuItemsWithSeparator(){return d.map((s,e)=>e===2||e===4?{...s,separator:!0}:s)},subMenuItemsWithoutIcons(){return d.map(({icon:s,hotkeyText:e,...m})=>m)}}},H={class:"grid-container"},A={class:"grid-item-12"},E={class:"submenus"},D={class:"card"},N={class:"card"},V={class:"card"},L={class:"card"},R={class:"card"},j={class:"scroll-container"},z={class:"card translated"};function Q(s,e,m,U,a,l){const i=c("MenuIcon"),r=c("SubMenu",!0),b=c("CodeExample");return M(),_("section",null,[t("div",H,[t("div",A,[e[7]||(e[7]=t("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),t("div",E,[t("div",D,[e[1]||(e[1]=t("span",{class:"menu-name"},"Normal",-1)),o(r,{items:l.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["items"])]),t("div",N,[e[2]||(e[2]=t("span",{class:"menu-name"},"Orientation left",-1)),o(r,{items:l.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["items"])]),t("div",V,[e[3]||(e[3]=t("span",{class:"menu-name"},"Orientation top",-1)),o(r,{items:l.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["items"])]),t("div",L,[e[4]||(e[4]=t("span",{class:"menu-name"},"Disabled submenu",-1)),o(r,{items:a.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["items"])]),t("div",R,[e[5]||(e[5]=t("span",{class:"menu-name"},"Normal (reduced width)",-1)),o(r,{items:l.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["items"])]),t("div",j,[t("div",z,[v(t("input",{"onUpdate:modelValue":e[0]||(e[0]=I=>a.teleport=I),type:"checkbox"},null,512),[[S,a.teleport]]),e[6]||(e[6]=t("span",{class:"menu-name"},"With teleport",-1)),o(r,{"teleport-to-body":a.teleport,items:l.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:n(()=>[o(i,{class:"open-icon"})]),_:1},8,["teleport-to-body","items"])])])]),o(b,{summary:"Show usage example"},{default:n(()=>[h(f(a.codeExampleStandalone),1)]),_:1}),o(b,{summary:"Show SubMenu.vue source code"},{default:n(()=>[h(f(a.code),1)]),_:1})])])])}const ee=k(B,[["render",Q],["__scopeId","data-v-ab5df574"]]);export{ee as default};
