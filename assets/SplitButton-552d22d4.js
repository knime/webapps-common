import{C as w}from"./CodeExample-67cdb25b.js";import{S as p}from"./SubMenu-108f0759.js";import{H as g,S as x}from"./star-af0ac42a.js";import{H as S,L as y}from"./heart-63ab33cc.js";import{D as B}from"./arrow-dropdown-d2b6b8d8.js";import{B as I}from"./Button-9ea92b8e.js";import{_ as l,o as d,c as m,u as k,m as s,r as e,b as r,d as n,w as o,e as i,t as c,p as M,f as D}from"./index-c196bca3.js";import"./MenuItems.vue_vue_type_style_index_0_lang-41213c4f.js";import"./lodash-c5dfabc4.js";import"./arrow-next-c18ba1d0.js";const C={};function E(t,b){return d(),m("div",null,[k(t.$slots,"default",{},void 0,!0)])}const H=l(C,[["render",E],["__scopeId","data-v-a764fcbd"]]),O=`<template>
  <div>
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
div {
  display: inline-flex;
  border-radius: var(
    --theme-button-split-border-radius
  ); /* needed for correct :hover style trigger below */

  & :deep(.button.primary) {
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

  & :deep(.button.primary.compact) {
    /* best way to ensure flexible 1/4 corners also for a button in compact mode */
    border-radius: var(--theme-button-split-border-radius) 0 0
      var(--theme-button-split-border-radius);
  }

  &:hover,
  &:focus-within {
    & :deep(.button) {
      &::after {
        display: none;
      }
    }
  }

  & :deep(.submenu) {
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

    & button svg {
      stroke: var(--knime-white);
    }
  }
}
</style>`,$=[{href:"http://apple.com",text:"Apples",icon:s(g)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:s(x)},{to:"/testing-nuxt-link",text:"Ananas",icon:s(S)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:s(y)}],L={components:{SubMenu:p,CodeExample:w,DropdownIcon:B,Button:I,SplitButton:H},data(){return{SubMenu:p,subMenuItems:$,codeExample:A,code:O}}},N=t=>(M("data-v-e1af6251"),t=t(),D(),t),V={class:"grid-container"},j={class:"grid-item-12"},R=N(()=>r("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function T(t,b,q,z,a,F){const f=e("Button"),_=e("DropdownIcon"),h=e("SubMenu"),v=e("SplitButton",!0),u=e("CodeExample");return d(),m("section",null,[r("div",V,[r("div",j,[R,r("div",null,[n(v,null,{default:o(()=>[n(f,{primary:""},{default:o(()=>[i("Split button with submenu")]),_:1}),n(h,{items:a.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:o(()=>[n(_)]),_:1},8,["items"])]),_:1})]),n(u,{summary:"Show usage example"},{default:o(()=>[i(c(a.codeExample),1)]),_:1}),n(u,{summary:"Show SplitButton.vue source code"},{default:o(()=>[i(c(a.code),1)]),_:1})])])])}const tt=l(L,[["render",T],["__scopeId","data-v-e1af6251"]]);export{tt as default};
