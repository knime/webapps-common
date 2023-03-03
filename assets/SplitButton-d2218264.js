import{C as g}from"./CodeExample-334ef8e4.js";import{S as p}from"./SubMenu-7c335855.js";import{H as x,S}from"./star-367d052e.js";import{H as y,L as B}from"./heart-6bb234eb.js";import{D as I}from"./arrow-dropdown-7c794ae7.js";import{B as k}from"./Button-6369a6ec.js";import{_ as l,o as d,c as m,u as M,m as r,b as s,d as n,w as e,e as a,t as c,r as o,p as D,f as C}from"./index-16ba5cb9.js";const E={};function H(t,_){return d(),m("div",null,[M(t.$slots,"default",{},void 0,!0)])}const O=l(E,[["render",H],["__scopeId","data-v-368cac1b"]]),A=`<template>
  <div>
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
div {
  display: inline-flex;
  border-radius: var(--theme-button-split-border-radius); /* needed for correct :hover style trigger below */

  & :deep(.button.primary) {
    position: relative;
    margin-bottom: 0;

    /* best way to ensure flexible 1/4 corners */
    border-radius: var(--theme-button-split-border-radius) 0 0 var(--theme-button-split-border-radius);

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
    border-radius: 0 var(--theme-button-split-border-radius) var(--theme-button-split-border-radius) 0;

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
</style>`,L=[{href:"http://apple.com",text:"Apples",icon:r(x)},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:r(S)},{to:"/testing-nuxt-link",text:"Ananas",icon:r(y)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:r(B)}],N={components:{SubMenu:p,CodeExample:g,DropdownIcon:I,Button:k,SplitButton:O},data(){return{SubMenu:p,subMenuItems:L,codeExample:$,code:A}}},b=t=>(D("data-v-d821d563"),t=t(),C(),t),V={class:"grid-container"},j={class:"grid-item-12"},R=b(()=>s("h2",null,"SplitButton",-1)),T=b(()=>s("p",null," A split button which combines a Button and SubMenu component. Both intentionally need to be added via the default slot to have full flexibility regarding their props and events. ",-1));function q(t,_,z,F,i,G){const h=o("Button"),f=o("DropdownIcon"),v=o("SubMenu"),w=o("SplitButton",!0),u=o("CodeExample");return d(),m("section",null,[s("div",V,[s("div",j,[R,T,s("div",null,[n(w,null,{default:e(()=>[n(h,{primary:""},{default:e(()=>[a("Split button with submenu")]),_:1}),n(v,{items:i.subMenuItems,class:"submenu","button-title":"Open my submenu with icons",orientation:"left"},{default:e(()=>[n(f)]),_:1},8,["items"])]),_:1})]),n(u,{summary:"Show usage example"},{default:e(()=>[a(c(i.codeExample),1)]),_:1}),n(u,{summary:"Show SplitButton.vue source code"},{default:e(()=>[a(c(i.code),1)]),_:1})])])])}const Y=l(N,[["render",q],["__scopeId","data-v-d821d563"]]);export{Y as default};
