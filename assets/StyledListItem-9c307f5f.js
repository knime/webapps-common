import{C as p}from"./CodeExample-d1959809.js";import{S as m}from"./StyledListItem-1894402e.js";import{_ as u,o as h,c as v,b as e,d as n,w as s,e as d,t as a,r,p as f,f as x}from"./index-e906df09.js";const g=`<script>
export default {
    props: {
        text: {
            type: String,
            default: ' '
        },
        selected: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        invalid: {
            type: Boolean,
            default: false
        },
        /**
         * Styles the item distinct to the other ones by adding a margin, adjusting the font-style and -height and
         * rounding the corners
        */
        special: {
            type: Boolean,
            default: false
        },
        lineHeight: {
            type: Number,
            default: null
        }
    },
    emits: ['mousedown', 'mousemove', 'dblclick-exact', 'dblclick-shift', 'click']
};
<\/script>

<template>
  <!-- //NOSONAR --><li
    v-bind="$attrs"
    role="option"
    :title="text"
    :style="{...lineHeight !== null ? {lineHeight: \`\${lineHeight}px\`} : {}}"
    :class="{
      selected,
      invalid,
      'empty': !Boolean(text.trim()),
      disabled,
      special
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
`;const _=`<ul>
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
`,y={components:{StyledListItem:m,CodeExample:p},data(){return{code:g,codeExample:_}}},c=o=>(f("data-v-a710097f"),o=o(),x(),o),b={class:"grid-container"},w={class:"grid-item-12"},S=c(()=>e("h2",null,"StyledListItem",-1)),k=c(()=>e("p",null," A li element with several styles ",-1)),I={class:"grid-container"},L={class:"grid-item-12"};function $(o,B,N,C,l,E){const t=r("StyledListItem",!0),i=r("CodeExample");return h(),v("section",null,[e("section",null,[e("div",b,[e("div",w,[S,k,e("ul",null,[n(t,{text:"Normal"}),n(t,{text:"Selected",selected:""}),n(t,{text:"Special",special:""}),n(t,{text:"Invalid",invalid:""}),n(t,{text:"Disabled",disabled:""}),n(t,{text:"With line height","line-height":40})])])])]),e("section",null,[e("div",I,[e("div",L,[n(i,{summary:"Show usage example"},{default:s(()=>[d(a(l.codeExample),1)]),_:1}),n(i,{summary:"Show SubMenu.vue source code"},{default:s(()=>[d(a(l.code),1)]),_:1})])])])])}const A=u(y,[["render",$],["__scopeId","data-v-a710097f"]]);export{A as default};
