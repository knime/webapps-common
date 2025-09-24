import{D as S}from"./arrow-dropdown-C015BmES.js";import{H as B,S as g}from"./star-D2GRyBRZ.js";import{H as x,L as v}from"./leave-B6EvHvmg.js";import{C as I}from"./CodeExample-La__JCd8.js";import{_ as l,c as d,o as b,E as k,C as y,r as n,b as s,d as t,w as e,e as r,t as c,x as a}from"./index-CdRYFHYy.js";import{S as m}from"./SubMenu-TEKhtWfn.js";import"./MenuItems.vue_vue_type_style_index_0_lang-BkRDszS1.js";import"./arrow-next-B6_CVf18.js";import"./useDropdownNavigation-VYHcMCB7.js";import"./Checkbox-DDjjyswv.js";const M={},D={class:"split-button"};function C(u,o){return b(),d("div",D,[k(u.$slots,"default")])}const E=l(M,[["render",C],["__scopeId","data-v-6a058c48"]]),H="",O=`<script>
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
</style>`,$=[{href:"https://apple.com",text:"Apples",icon:a(B)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:a(g)},{to:"/testing-nuxt-link",text:"Ananas",icon:a(x)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:a(v)}],A={components:{SubMenu:m,CodeExample:I,DropdownIcon:S,Button:y,SplitButton:E},data(){return{SubMenu:m,subMenuItems:$,codeExample:O,code:H}}},L={class:"grid-container"},N={class:"grid-item-12"};function V(u,o,R,T,i,j){const f=n("Button"),_=n("DropdownIcon"),w=n("SubMenu"),h=n("SplitButton",!0),p=n("CodeExample");return b(),d("section",null,[s("div",L,[s("div",N,[o[1]||(o[1]=s("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1)),s("div",null,[t(h,null,{default:e(()=>[t(f,{primary:""},{default:e(()=>o[0]||(o[0]=[r("Split button with submenu",-1)])),_:1,__:[0]}),t(w,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:e(()=>[t(_)]),_:1},8,["items"])]),_:1})]),t(p,{summary:"Show usage example"},{default:e(()=>[r(c(i.codeExample),1)]),_:1}),t(p,{summary:"Show SplitButton.vue source code"},{default:e(()=>[r(c(i.code),1)]),_:1})])])])}const X=l(A,[["render",V],["__scopeId","data-v-02400829"]]);export{X as default};
