import{C as v}from"./CodeExample-df25da9e.js";import{S as p}from"./SubMenu-dd9b3a5f.js";import{H as g,S as x}from"./star-edb2bd01.js";import{H as S,L as y}from"./heart-ce356a47.js";import{A as B}from"./arrow-dropdown-7870615e.js";import{B as I}from"./Button-dc398ea0.js";import{_ as l,o as d,c as m,u as k,m as s,r as e,b as r,d as n,w as o,e as i,t as c,p as M,f as A}from"./index-a200f5df.js";import"./MenuItems.vue_vue_type_style_index_0_lang-42f5247f.js";import"./Checkbox-3d30082a.js";import"./arrow-next-1a0a9b55.js";const D={},C={class:"split-button"};function E(t,b){return d(),m("div",C,[k(t.$slots,"default")])}const H=l(D,[["render",E],["__scopeId","data-v-326e711b"]]),O=`<template>
  <div class="split-button">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.split-button {
  display: inline-flex;
  border-radius: var(
    --theme-button-split-border-radius
  ); /* needed for correct :hover style trigger below */

  & :slotted(.button.primary) {
    position: relative;
    margin-bottom: 0;

    /* best way to ensure flexible 1/4 corners */
    border-radius: var(--theme-button-split-border-radius) 0 0
      var(--theme-button-split-border-radius);

    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 1px;
      height: calc(100% - 10px);
      right: 0;
      top: 5px;
      background-color: var(--theme-button-split-divider-color);
    }
  }

  & :slotted(.button.primary.compact) {
    /* best way to ensure flexible 1/4 corners also for a button in compact mode */
    border-radius: var(--theme-button-split-border-radius) 0 0
      var(--theme-button-split-border-radius);
  }

  &:hover,
  &:focus-within {
    & :slotted(.button) {
      &::after {
        display: none;
      }
    }
  }

  & :slotted(.submenu) {
    display: inline-flex;

    /* best way to ensure flexible 1/4 corners */
    border-radius: 0 var(--theme-button-split-border-radius)
      var(--theme-button-split-border-radius) 0;

    & .submenu-toggle {
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active,
      &:hover,
      &:focus {
        background-color: transparent;
      }

      & svg {
        padding: 0;
        width: 14px;
        height: 14px;
        stroke-width: calc(32px / 14);
        stroke: var(--theme-button-split-foreground-color);
      }
    }
  }
}
</style>
`;const $=`<script>
import Button from '~/webapps-common/ui/components/Button.vue';
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import SplitButton from '~/webapps-common/ui/components/SplitButton.vue';
import DropdownIcon from '~/webapps-common/ui/assets/img/icons/arrow-dropdown.svg';

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
</style>`,L=[{href:"https://apple.com",text:"Apples",icon:s(g)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(x)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(S)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(y)}],N={components:{SubMenu:p,CodeExample:v,DropdownIcon:B,Button:I,SplitButton:H},data(){return{SubMenu:p,subMenuItems:L,codeExample:$,code:O}}},V=t=>(M("data-v-1e6a51a5"),t=t(),A(),t),j={class:"grid-container"},R={class:"grid-item-12"},T=V(()=>r("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,b,z,F,a,G){const _=e("Button"),h=e("DropdownIcon"),f=e("SubMenu"),w=e("SplitButton",!0),u=e("CodeExample");return d(),m("section",null,[r("div",j,[r("div",R,[T,r("div",null,[n(w,null,{default:o(()=>[n(_,{primary:""},{default:o(()=>[i("Split button with submenu")]),_:1}),n(f,{items:a.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:o(()=>[n(h)]),_:1},8,["items"])]),_:1})]),n(u,{summary:"Show usage example"},{default:o(()=>[i(c(a.codeExample),1)]),_:1}),n(u,{summary:"Show SplitButton.vue source code"},{default:o(()=>[i(c(a.code),1)]),_:1})])])])}const nt=l(N,[["render",q],["__scopeId","data-v-1e6a51a5"]]);export{nt as default};
