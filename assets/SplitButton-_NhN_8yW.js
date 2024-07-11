import{C as S}from"./CodeExample-CEMuTgcl.js";import{_ as m,o as l,c as d,x as B,s,r as e,b as a,d as o,w as n,e as r,t as c,p as g,f as x}from"./index-C9vqjUQ1.js";import{B as I}from"./Button-BDGZ-sSG.js";import{D as v}from"./arrow-dropdown-CseSplwP.js";import{S as u}from"./SubMenu-CzJMRayX.js";import{H as k,S as y}from"./star-DI0Gu_d1.js";import{H as M,L as D}from"./heart-DxjmCevE.js";import"./MenuItems.vue_vue_type_script_setup_true_lang-hsolBkxc.js";import"./Checkbox-BfgAW5hu.js";import"./arrow-next-DUOdSYwJ.js";import"./useClickOutside-Fww3O3mT.js";const C={},E={class:"split-button"};function H(t,f){return l(),d("div",E,[B(t.$slots,"default")])}const O=m(C,[["render",H],["__scopeId","data-v-fffb68b1"]]),$="",A=`<script>
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
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(k)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(y)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(M)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(D)}],N={components:{SubMenu:u,CodeExample:S,DropdownIcon:v,Button:I,SplitButton:O},data(){return{SubMenu:u,subMenuItems:L,codeExample:A,code:$}}},V=t=>(g("data-v-3714d245"),t=t(),x(),t),R={class:"grid-container"},T={class:"grid-item-12"},j=V(()=>a("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,f,z,F,i,G){const _=e("Button"),b=e("DropdownIcon"),h=e("SubMenu"),w=e("SplitButton",!0),p=e("CodeExample");return l(),d("section",null,[a("div",R,[a("div",T,[j,a("div",null,[o(w,null,{default:n(()=>[o(_,{primary:""},{default:n(()=>[r("Split button with submenu")]),_:1}),o(h,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:n(()=>[o(b)]),_:1},8,["items"])]),_:1})]),o(p,{summary:"Show usage example"},{default:n(()=>[r(c(i.codeExample),1)]),_:1}),o(p,{summary:"Show SplitButton.vue source code"},{default:n(()=>[r(c(i.code),1)]),_:1})])])])}const et=m(N,[["render",q],["__scopeId","data-v-3714d245"]]);export{et as default};
