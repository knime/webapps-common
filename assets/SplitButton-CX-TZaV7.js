import{C as S}from"./CodeExample-BqRBfa2O.js";import{H as B,S as g}from"./star-XXuBxmft.js";import{H as I,L as v}from"./heart-BDZcky2-.js";import{D as x}from"./arrow-dropdown-Dcvwohdd.js";import{_ as m,o as l,c as d,B as k,s,r as e,b as a,d as o,w as n,e as r,t as c,p as y,f as M}from"./index-CKYtHaYD.js";import{S as u}from"./SubMenu-DrMrmCiP.js";import{B as D}from"./Button-B4AEce-H.js";import"./MenuItems.vue_vue_type_style_index_0_lang-CNR1lnYL.js";import"./Checkbox-BdjluAj4.js";import"./arrow-next-Cdnfg6n8.js";import"./useClickOutside-C_6bhAoN.js";const C={},E={class:"split-button"};function H(t,f){return l(),d("div",E,[k(t.$slots,"default")])}const O=m(C,[["render",H],["__scopeId","data-v-fffb68b1"]]),$="",A=`<script>
import Button from '~/webapps-common/ui/components/Button.vue';
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import SplitButton from '~/webapps-common/ui/components/SplitButton.vue';
import DropdownIcon from '~/@knime/styles/img/icons/arrow-dropdown.svg';

const subMenuItems = [{
    href: 'https://apple.com',
    text: 'Apples',
    icon: HelpIcon
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon
},  {
    to: '/testing-nuxt-link',
    text: 'Ananas',
    icon: HeartIcon
}, {
    href: 'https://www.urbandictionary.com/define.php?term=go%20bananas',
    text: 'Bananas',
    icon: LeaveIcon
}];

export default {
    components: {
        Button,
        SubMenu,
        SplitButton,
        DropdownIcon
    },
    data() {
        return {
            subMenuItems
        };
    }
};
<\/script>

<template>
  <SplitButton>
    <Button primary>Split button with submenu</Button>
    <SubMenu
      :items="subMenuItems"
      class="submenu"
      button-title="Open my submenu with icons"
      orientation="left"
    >
      <DropdownIcon />
    </SubMenu>
  </SplitButton>
</template>

<style lang="postcss" scoped>
.submenu {
  background-color: var(--knime-yellow);

  &:focus-within,
  &:hover {
    background-color: var(--knime-masala);

    & .submenu-toggle svg {
      stroke: var(--knime-white);
    }
  }
}
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(B)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(g)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(I)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(v)}],N={components:{SubMenu:u,CodeExample:S,DropdownIcon:x,Button:D,SplitButton:O},data(){return{SubMenu:u,subMenuItems:L,codeExample:A,code:$}}},V=t=>(y("data-v-3714d245"),t=t(),M(),t),R={class:"grid-container"},T={class:"grid-item-12"},j=V(()=>a("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,f,z,F,i,G){const _=e("Button"),b=e("DropdownIcon"),h=e("SubMenu"),w=e("SplitButton",!0),p=e("CodeExample");return l(),d("section",null,[a("div",R,[a("div",T,[j,a("div",null,[o(w,null,{default:n(()=>[o(_,{primary:""},{default:n(()=>[r("Split button with submenu")]),_:1}),o(h,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:n(()=>[o(b)]),_:1},8,["items"])]),_:1})]),o(p,{summary:"Show usage example"},{default:n(()=>[r(c(i.codeExample),1)]),_:1}),o(p,{summary:"Show SplitButton.vue source code"},{default:n(()=>[r(c(i.code),1)]),_:1})])])])}const et=m(N,[["render",q],["__scopeId","data-v-3714d245"]]);export{et as default};
