import{C as S}from"./CodeExample-YSv4f2QH.js";import{B}from"./Button-CoT7Amob.js";import{_ as m,o as l,c as d,x as g,s,y as x,r as e,b as a,d as o,w as n,e as r,t as p,p as I,f as v}from"./index-DQX5xbrx.js";import{S as u}from"./SubMenu-Da9eW1p2.js";import{H as k,S as y}from"./star-BKD682ik.js";import{H as M,L as D}from"./heart-DxQ_lfdZ.js";import"./MenuItems.vue_vue_type_script_setup_true_lang-B_2pBH_N.js";import"./Checkbox-BQxXwa3I.js";import"./arrow-next-BUdfKJUQ.js";import"./useClickOutside-BUZDjwaO.js";const C={},E={class:"split-button"};function H(t,_){return l(),d("div",E,[g(t.$slots,"default")])}const O=m(C,[["render",H],["__scopeId","data-v-fffb68b1"]]),$="",A=`<script>
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
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(k)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(y)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(M)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(D)}],N={components:{SubMenu:u,CodeExample:S,DropdownIcon:x,Button:B,SplitButton:O},data(){return{SubMenu:u,subMenuItems:L,codeExample:A,code:$}}},V=t=>(I("data-v-3714d245"),t=t(),v(),t),R={class:"grid-container"},T={class:"grid-item-12"},j=V(()=>a("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,_,z,F,i,G){const b=e("Button"),f=e("DropdownIcon"),h=e("SubMenu"),w=e("SplitButton",!0),c=e("CodeExample");return l(),d("section",null,[a("div",R,[a("div",T,[j,a("div",null,[o(w,null,{default:n(()=>[o(b,{primary:""},{default:n(()=>[r("Split button with submenu")]),_:1}),o(h,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:n(()=>[o(f)]),_:1},8,["items"])]),_:1})]),o(c,{summary:"Show usage example"},{default:n(()=>[r(p(i.codeExample),1)]),_:1}),o(c,{summary:"Show SplitButton.vue source code"},{default:n(()=>[r(p(i.code),1)]),_:1})])])])}const ot=m(N,[["render",q],["__scopeId","data-v-3714d245"]]);export{ot as default};
