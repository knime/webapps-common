import{D as S}from"./arrow-dropdown-Bb4gIw7D.js";import{H as B,S as g}from"./star-CYolDs3F.js";import{H as x,L as v}from"./leave-Bbc72o-n.js";import{C as I}from"./CodeExample-BA5rNYjT.js";import{_ as l,c as d,o as b,E as k,C as y,r as n,b as s,d as t,w as e,e as r,t as c,x as i}from"./index-BzdytT3y.js";import{S as m}from"./SubMenu-zEJ0aIxO.js";import"./MenuItems.vue_vue_type_style_index_0_lang-R2JMZgV5.js";import"./arrow-next-QD_4478A.js";import"./useDropdownNavigation-BVupn6R-.js";import"./Checkbox-U6TOI_3a.js";const M={},D={class:"split-button"};function C(u,o){return b(),d("div",D,[k(u.$slots,"default")])}const E=l(M,[["render",C],["__scopeId","data-v-fffb68b1"]]),H="",O=`<script>
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
</style>`,$=[{href:"https://apple.com",text:"Apples",icon:i(B)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:i(g)},{to:"/testing-nuxt-link",text:"Ananas",icon:i(x)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:i(v)}],A={components:{SubMenu:m,CodeExample:I,DropdownIcon:S,Button:y,SplitButton:E},data(){return{SubMenu:m,subMenuItems:$,codeExample:O,code:H}}},L={class:"grid-container"},N={class:"grid-item-12"};function V(u,o,R,T,a,j){const f=n("Button"),_=n("DropdownIcon"),w=n("SubMenu"),h=n("SplitButton",!0),p=n("CodeExample");return b(),d("section",null,[s("div",L,[s("div",N,[o[1]||(o[1]=s("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1)),s("div",null,[t(h,null,{default:e(()=>[t(f,{primary:""},{default:e(()=>o[0]||(o[0]=[r("Split button with submenu",-1)])),_:1,__:[0]}),t(w,{items:a.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:e(()=>[t(_)]),_:1},8,["items"])]),_:1})]),t(p,{summary:"Show usage example"},{default:e(()=>[r(c(a.codeExample),1)]),_:1}),t(p,{summary:"Show SplitButton.vue source code"},{default:e(()=>[r(c(a.code),1)]),_:1})])])])}const X=l(A,[["render",V],["__scopeId","data-v-02400829"]]);export{X as default};
