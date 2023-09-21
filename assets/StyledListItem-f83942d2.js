import{C as c}from"./CodeExample-765fa6a6.js";import{S as p}from"./StyledListItem-acc1262d.js";import{_ as m,r as d,o as u,c as h,b as n,d as e,w as s,e as r,t as a,p as v,f as x}from"./index-79858142.js";const g=`<script>
export default {
  props: {
    text: {
      type: String,
      default: " ",
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    /**
     * Styles the item distinct to the other ones by adding a margin, adjusting the font-style and -height and
     * rounding the corners
     */
    special: {
      type: Boolean,
      default: false,
    },
    lineHeight: {
      type: Number,
      default: null,
    },
  },
  emits: [
    "mousedown",
    "mousemove",
    "dblclick-exact",
    "dblclick-shift",
    "click",
  ],
};
<\/script>

<template>
  <!-- //NOSONAR -->
  <li
    v-bind="$attrs"
    role="option"
    :title="text"
    :style="{
      ...(lineHeight !== null ? { lineHeight: \`\${lineHeight}px\` } : {}),
    }"
    :class="{
      selected,
      invalid,
      empty: !Boolean(text.trim()),
      disabled,
      special,
    }"
    :aria-selected="selected"
    @click="$emit('click', $event)"
    @dblclick.shift="$emit('dblclick-shift')"
    @dblclick.exact="$emit('dblclick-exact')"
    @mousedown="$emit('mousedown', $event)"
    @mousemove="$emit('mousemove', $event)"
  >
    {{ text }}
  </li>
</template>

<style lang="postcss" scoped>
[role="option"] {
  display: block;
  padding: 0 10px;
  line-height: 22px;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  background: var(--theme-dropdown-background-color);
  color: var(--theme-dropdown-foreground-color);
  user-select: none;

  &.empty {
    white-space: pre-wrap;
  }

  &.disabled {
    cursor: unset;
  }

  &:not(.disabled) {
    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);
    }

    &.selected {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  /* invalid values */
  &.invalid {
    color: var(--theme-color-error);

    &.selected {
      background: var(--theme-color-error);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  &.special {
    border-radius: 3px;
    font-size: 10px;
    font-style: italic;
    text-align: center;
    margin: 2px;
    padding: 0 3px;
    line-height: 16px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
`;const f=`<ul>
  <StyledListItem
    text="Normal"
  />
  <StyledListItem
    text="Selected"
    selected
  />
  <StyledListItem
    text="Special"
    special
  />
  <StyledListItem
    text="Invalid"
    invalid
  />
  <StyledListItem
    text="Disabled"
    disabled
  />
  <StyledListItem
    text="With line height"
    :line-height="40"
  />
</ul>
`,_={components:{StyledListItem:p,CodeExample:c},data(){return{code:g,codeExample:f}}},y=o=>(v("data-v-68253bde"),o=o(),x(),o),b={class:"grid-container"},w={class:"grid-item-12"},S=y(()=>n("p",null,"A li element with several styles",-1)),k={class:"grid-container"},I={class:"grid-item-12"};function $(o,L,B,N,l,C){const t=d("StyledListItem",!0),i=d("CodeExample");return u(),h("section",null,[n("section",null,[n("div",b,[n("div",w,[S,n("ul",null,[e(t,{text:"Normal"}),e(t,{text:"Selected",selected:""}),e(t,{text:"Special",special:""}),e(t,{text:"Invalid",invalid:""}),e(t,{text:"Disabled",disabled:""}),e(t,{text:"With line height","line-height":40})])])])]),n("section",null,[n("div",k,[n("div",I,[e(i,{summary:"Show usage example"},{default:s(()=>[r(a(l.codeExample),1)]),_:1}),e(i,{summary:"Show SubMenu.vue source code"},{default:s(()=>[r(a(l.code),1)]),_:1})])])])])}const V=m(_,[["render",$],["__scopeId","data-v-68253bde"]]);export{V as default};
