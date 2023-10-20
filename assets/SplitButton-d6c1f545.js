import{C as w}from"./CodeExample-63ce1427.js";import{S as p}from"./SubMenu-e519f378.js";import{H as g,S as x}from"./star-cc9d829d.js";import{H as S,L as y}from"./heart-25ee9abf.js";import{D as B}from"./arrow-dropdown-c1760ed1.js";import{B as I}from"./Button-39e2b11d.js";import{_ as l,o as d,c as m,u as k,m as s,r as e,b as r,d as n,w as o,e as a,t as c,p as M,f as D}from"./index-0c667c3d.js";import"./MenuItems.vue_vue_type_style_index_0_lang-706c119b.js";import"./Checkbox-ce252be6.js";import"./arrow-next-e190bc87.js";const C={},E={class:"split-button"};function H(t,b){return d(),m("div",E,[k(t.$slots,"default")])}const O=l(C,[["render",H],["__scopeId","data-v-326e711b"]]),$=`<template>
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
`;const A=`<script>
import Button from '~/webapps-common/ui/components/Button.vue';
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import SplitButton from '~/webapps-common/ui/components/SplitButton.vue';
import DropdownIcon from '~/webapps-common/ui/assets/img/icons/arrow-dropdown.svg';

const subMenuItems = [{
    href: 'http://apple.com',
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
</style>`,L=[{href:"http://apple.com",text:"Apples",icon:s(g)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(x)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(S)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(y)}],N={components:{SubMenu:p,CodeExample:w,DropdownIcon:B,Button:I,SplitButton:O},data(){return{SubMenu:p,subMenuItems:L,codeExample:A,code:$}}},V=t=>(M("data-v-f18111b3"),t=t(),D(),t),j={class:"grid-container"},R={class:"grid-item-12"},T=V(()=>r("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,b,z,F,i,G){const _=e("Button"),h=e("DropdownIcon"),f=e("SubMenu"),v=e("SplitButton",!0),u=e("CodeExample");return d(),m("section",null,[r("div",j,[r("div",R,[T,r("div",null,[n(v,null,{default:o(()=>[n(_,{primary:""},{default:o(()=>[a("Split button with submenu")]),_:1}),n(f,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:o(()=>[n(h)]),_:1},8,["items"])]),_:1})]),n(u,{summary:"Show usage example"},{default:o(()=>[a(c(i.codeExample),1)]),_:1}),n(u,{summary:"Show SplitButton.vue source code"},{default:o(()=>[a(c(i.code),1)]),_:1})])])])}const nt=l(N,[["render",q],["__scopeId","data-v-f18111b3"]]);export{nt as default};
