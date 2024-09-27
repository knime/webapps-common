import{C as S}from"./CodeExample-gaZ3omaZ.js";import{H as B,S as g}from"./star-CZ9PXBE0.js";import{H as I,L as v}from"./heart-CWTXtiC9.js";import{D as x}from"./arrow-dropdown-DnBgMxmf.js";import{_ as m,o as l,c as d,z as k,s,r as e,b as a,d as o,w as n,e as r,t as c,p as y,f as M}from"./index-BLrOIlO2.js";import{S as u}from"./SubMenu-j_GABR9C.js";import{B as D}from"./Button-BXRtrf2F.js";import"./MenuItems.vue_vue_type_style_index_0_lang-_QkYpaWy.js";import"./Checkbox-BQtQJEYP.js";import"./arrow-next-Cq0s_5Nc.js";import"./useClickOutside-BjCxkKyQ.js";const C={},E={class:"split-button"};function H(t,f){return l(),d("div",E,[k(t.$slots,"default")])}const O=m(C,[["render",H],["__scopeId","data-v-fffb68b1"]]),$="",A=`<script>
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
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(B)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(g)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(I)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(v)}],N={components:{SubMenu:u,CodeExample:S,DropdownIcon:x,Button:D,SplitButton:O},data(){return{SubMenu:u,subMenuItems:L,codeExample:A,code:$}}},V=t=>(y("data-v-3714d245"),t=t(),M(),t),z={class:"grid-container"},R={class:"grid-item-12"},T=V(()=>a("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function j(t,f,q,F,i,G){const _=e("Button"),b=e("DropdownIcon"),h=e("SubMenu"),w=e("SplitButton",!0),p=e("CodeExample");return l(),d("section",null,[a("div",z,[a("div",R,[T,a("div",null,[o(w,null,{default:n(()=>[o(_,{primary:""},{default:n(()=>[r("Split button with submenu")]),_:1}),o(h,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:n(()=>[o(b)]),_:1},8,["items"])]),_:1})]),o(p,{summary:"Show usage example"},{default:n(()=>[r(c(i.codeExample),1)]),_:1}),o(p,{summary:"Show SplitButton.vue source code"},{default:n(()=>[r(c(i.code),1)]),_:1})])])])}const et=m(N,[["render",j],["__scopeId","data-v-3714d245"]]);export{et as default};
