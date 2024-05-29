import{C}from"./CodeExample-oz6H8A5_.js";import{F as f}from"./folder-xVT-QIal.js";import{A as I}from"./arrow-next-CHdS_xWa.js";import{_ as v,i as N,r as h,o as n,c as l,b as i,F as S,g as B,j as a,w as k,k as b,l as s,e as d,t as u,n as y,m as E,q as A,s as F,d as m}from"./index-099kMGOp.js";const $={components:{ArrowNext:I},props:{items:{type:Array,default:()=>[]},greyStyle:{type:Boolean,default:!1}},emits:["click-item"],computed:{linkComponent(){return N()}}},D=["role","title","tabindex","onKeydown","onClick"];function L(t,g,o,w,r,p){const c=h("ArrowNext");return o.items&&o.items.length?(n(),l("nav",{key:0,class:y(["breadcrumb",{"grey-style":o.greyStyle}])},[i("ul",null,[(n(!0),l(S,null,B(o.items,(e,x)=>(n(),l("li",{key:x},[e.href?(n(),a(b(p.linkComponent),{key:0,to:e.href},{default:k(()=>[e.icon?(n(),a(b(e.icon),{key:0,class:"breadcrumb-icon"})):s("",!0),d(" "+u(e.text),1)]),_:2},1032,["to"])):(n(),l("span",{key:1,class:y({clickable:e.clickable}),role:e.clickable?"button":null,title:e.title,tabindex:e.clickable?0:null,onKeydown:E(A(_=>e.clickable&&t.$emit("click-item",e),["stop","prevent"]),["enter"]),onClick:_=>e.clickable&&t.$emit("click-item",e)},[e.icon?(n(),a(b(e.icon),{key:0,class:"breadcrumb-icon"})):s("",!0),d(" "+u(e.text),1)],42,D)),x!==o.items.length-1?(n(),a(c,{key:2,class:"arrow"})):s("",!0)]))),128))])],2)):s("",!0)}const j=v($,[["render",L],["__scopeId","data-v-e9934d80"]]),K=`<script>
import ArrowNext from "../assets/img/icons/arrow-next.svg";
import { resolveNuxtLinkComponent } from "../util/nuxtComponentResolver";

export default {
  components: {
    ArrowNext,
  },
  props: {
    /**
     * items as array with a 'text' and optional properties 'href', 'icon' and 'clickable'
     *
     * Having "href" set will make the element behave as a link. Having the "clickable" property
     * set will make the component emit a "click-item" event when the corresponding item is clicked. "href" takes
     * precedence over "clickable"
     *
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', icon: Icon },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', clickable: true },
     *   { text: 'Sentiment Prediction via REST' }
     * ]
     */
    items: {
      type: Array,
      default: () => [],
    },
    /**
     * focus and hover style can be switched by changing this value:
     * true - darker background, normal font
     * false - transparent background, bold font
     */
    greyStyle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click-item"],
  computed: {
    // TODO: Can be made into a composition function
    linkComponent() {
      return resolveNuxtLinkComponent();
    },
  },
};
<\/script>

<template>
  <nav
    v-if="items && items.length"
    :class="['breadcrumb', { 'grey-style': greyStyle }]"
  >
    <ul>
      <li v-for="(breadcrumbItem, i) in items" :key="i">
        <Component
          :is="linkComponent"
          v-if="breadcrumbItem.href"
          :to="breadcrumbItem.href"
        >
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }}
        </Component>
        <span
          v-else
          :class="{ clickable: breadcrumbItem.clickable }"
          :role="breadcrumbItem.clickable ? 'button' : null"
          :title="breadcrumbItem.title"
          :tabindex="breadcrumbItem.clickable ? 0 : null"
          @keydown.enter.stop.prevent="
            breadcrumbItem.clickable && $emit('click-item', breadcrumbItem)
          "
          @click="
            breadcrumbItem.clickable && $emit('click-item', breadcrumbItem)
          "
        >
          <Component
            :is="breadcrumbItem.icon"
            v-if="breadcrumbItem.icon"
            class="breadcrumb-icon"
          />
          {{ breadcrumbItem.text }} </span
        ><!-- no whitespace
        --><ArrowNext v-if="i !== items.length - 1" class="arrow" />
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
@import url("../css/mixins.css");

.breadcrumb {
  color: var(--knime-dove-gray);
  font-family: var(--theme-text-bold-font-family);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  margin: 0;
  list-style-type: none;

  & ul,
  & li {
    display: inline-block;
    margin: 0;
  }

  & ul {
    padding: 0;
    width: 100%;
  }

  & li {
    position: relative;
    margin: 0;
    max-width: 100%;
  }

  & span,
  & a {
    display: inline-block;
    text-decoration: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    padding: 10px 5px;
    line-height: normal;
    vertical-align: middle;
  }

  & svg {
    position: relative;
    vertical-align: top;
    stroke: var(--theme-text-bold-color);
    bottom: 1px;
  }

  & .breadcrumb-icon {
    width: 18px;
    height: 18px;
    margin-right: 2px;
    stroke-width: calc((32px / 18) * 0.8);
  }

  & .arrow {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    stroke-width: calc(32px / 10);
    vertical-align: middle;
    position: relative;
  }

  /* Unlinked breadcrumb item */
  & span {
    color: var(--theme-text-bold-color);

    &:focus {
      outline: none;
    }

    &:focus-visible {
      @mixin focus-outline;
    }

    & svg {
      stroke: var(--theme-text-bold-color);
    }
  }

  /* Clickable breadcrumb item */
  & span.clickable {
    cursor: pointer;
  }

  /* Linked breadcrumb item */
  & a {
    &:hover,
    &:focus {
      outline: none;
      color: var(--theme-text-bold-color);

      & svg {
        stroke: var(--theme-text-bold-color);
      }
    }
  }

  &.grey-style {
    color: var(--theme-text-bold-color);

    /* Linked breadcrumb item */
    & a:hover,
    & a:focus {
      outline: none;
      background-color: var(--knime-silver-sand-semi);
    }
  }
}
</style>
`,R=`<Breadcrumb
  :items="[
    { text: 'segment without link' },
    { text: 'segment with link', href: '/' },
    { text: 'segment with icon (clickable)', icon: FolderIcon, clickable: true },
    { text: 'segment with icon', icon: FolderIcon }
    { title: 'only an icon with no text but a title', icon: FolderIcon }
  ]"
  greyStyle
/>
`,H={components:{Breadcrumb:j,CodeExample:C},data(){const t=F(f);return{breadcrumbCode:K,breadcrumbItems:[{text:"KNIME Hub",href:"/"},{text:"John Doe",href:"/john.doe"},{text:"Public Space",href:"/john.doe/space",icon:t},{text:"Examples (clickable)",icon:t,clickable:!0},{text:"Sentiment Prediction via REST"},{title:"only an icon with no text but a title",icon:f}],codeExample:R}},methods:{onItemClicked({text:t}){window.alert(`You clicked on item ${JSON.stringify({text:t})}`)}}},P={class:"grid-container"},T={class:"grid-item-12"},V=i("p",null,' Breadcrumbs can have different focus/hover styles, these can be toggled via the "greyStyle"-property ',-1),J=i("span",null,"Default style:",-1),M=i("span",null,'"greyStyle" enabled:',-1);function O(t,g,o,w,r,p){const c=h("Breadcrumb",!0),e=h("CodeExample");return n(),l("section",null,[i("div",P,[i("div",T,[V,J,m(c,{items:r.breadcrumbItems,onClickItem:p.onItemClicked},null,8,["items","onClickItem"]),M,m(c,{items:r.breadcrumbItems,"grey-style":""},null,8,["items"]),m(e,{summary:"Show usage example"},{default:k(()=>[d(u(r.codeExample),1)]),_:1}),m(e,{summary:"Show Breadcrumb.vue source code"},{default:k(()=>[d(u(r.breadcrumbCode),1)]),_:1})])])])}const G=v(H,[["render",O]]);export{G as default};
