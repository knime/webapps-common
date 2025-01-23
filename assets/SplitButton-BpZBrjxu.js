import{D as S}from"./arrow-dropdown-Ac9LiBJ5.js";import{H as B,S as g}from"./star-BDny0Tij.js";import{H as x,L as I}from"./leave-B5qE9xBT.js";import{C as v}from"./CodeExample-Cs6hbHZ4.js";import{_ as m,o as l,c as d,H as k,x as s,G as y,r as e,b as a,d as o,w as n,e as r,t as c,p as M,f as D}from"./index-XXE_N_V5.js";import{S as u}from"./SubMenu-CUF5qZkb.js";import"./useClickOutside-D52uKvhM.js";import"./MenuItems.vue_vue_type_style_index_0_lang-YoW-PBLb.js";import"./arrow-next-DWiTqMgc.js";import"./useDropdownNavigation-Bq5IM3Uv.js";import"./Checkbox-BS27V3IV.js";const H={},C={class:"split-button"};function E(t,_){return l(),d("div",C,[k(t.$slots,"default")])}const O=m(H,[["render",E],["__scopeId","data-v-fffb68b1"]]),$="",A=`<script>
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
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(B)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(g)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(x)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(I)}],N={components:{SubMenu:u,CodeExample:v,DropdownIcon:S,Button:y,SplitButton:O},data(){return{SubMenu:u,subMenuItems:L,codeExample:A,code:$}}},V=t=>(M("data-v-02400829"),t=t(),D(),t),G={class:"grid-container"},R={class:"grid-item-12"},T=V(()=>a("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function j(t,_,q,z,i,F){const b=e("Button"),f=e("DropdownIcon"),h=e("SubMenu"),w=e("SplitButton",!0),p=e("CodeExample");return l(),d("section",null,[a("div",G,[a("div",R,[T,a("div",null,[o(w,null,{default:n(()=>[o(b,{primary:""},{default:n(()=>[r("Split button with submenu")]),_:1}),o(h,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:n(()=>[o(f)]),_:1},8,["items"])]),_:1})]),o(p,{summary:"Show usage example"},{default:n(()=>[r(c(i.codeExample),1)]),_:1}),o(p,{summary:"Show SplitButton.vue source code"},{default:n(()=>[r(c(i.code),1)]),_:1})])])])}const et=m(N,[["render",j],["__scopeId","data-v-02400829"]]);export{et as default};
