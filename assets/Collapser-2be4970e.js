import{C as m}from"./CodeExample-281cf0a0.js";import{C as h}from"./Collapser-1cd6d8a4.js";import{B as x}from"./bulb-06a1cc37.js";import{_,r as a,o as f,c as g,b as n,d as e,w as o,e as p,t as l,p as w,f as v}from"./index-f9aa1890.js";import"./arrow-dropdown-6c88b139.js";import"./ExpandTransition-9ef48176.js";const b=`<script>
import DropdownIcon from "../assets/img/icons/arrow-dropdown.svg";
import BaseButton from "./BaseButton.vue";
import ExpandTransition from "./transitions/ExpandTransition.vue";

export default {
  components: {
    DropdownIcon,
    BaseButton,
    ExpandTransition,
  },
  props: {
    /**
     * if the initial state is expanded
     */
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isExpanded: this.initiallyExpanded,
    };
  },
  methods: {
    onTrigger() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
<\/script>

<template>
  <div>
    <BaseButton
      class="button"
      :aria-expanded="String(isExpanded)"
      @click.prevent="onTrigger"
    >
      <slot name="title" />
      <div class="dropdown">
        <DropdownIcon :class="['dropdown-icon', { flip: isExpanded }]" />
      </div>
    </BaseButton>
    <ExpandTransition :is-expanded="isExpanded">
      <slot />
    </ExpandTransition>
  </div>
</template>

<style lang="postcss" scoped>
.button {
  position: relative;
  padding: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: bold;
  background-color: transparent;
  border: 0;
  outline: none;
  appearance: none;
  color: inherit; /* Safari needs this */
  width: 100%;
  text-align: left;
  cursor: pointer;

  & :deep(svg) {
    position: absolute;
    margin-right: 4px;
    float: left;
    margin-left: 4px;
    top: 17px;
  }

  & .dropdown {
    text-align: center;
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    top: 13px;

    &:hover {
      background-color: var(--theme-button-function-background-color-hover);
    }

    & .dropdown-icon {
      position: relative;
      margin: auto;
      width: 18px;
      height: 18px;
      stroke-width: calc(32px / 18);
      stroke: var(--knime-masala);
      top: 0;
      transition: transform 0.4s ease-in-out;

      &.flip {
        transform: scaleY(-1);
      }
    }
  }

  &:focus .dropdown {
    /* whole button gets focus but only dropdown icon is styled */
    background-color: var(--theme-button-function-background-color-focus);
  }
}

:deep(ul),
:deep(ol) {
  margin: 0;
  padding-left: 40px;
}
</style>
`;const C={components:{Collapser:h,BulbIcon:x,CodeExample:m},data(){return{codeExample:`<Collapser title="Collapser with icon">
  <template v-slot:title>
    <BulbIcon style="width: 20px; height: 20px;" />
    <h5>Collapser with icon</h5> /* Has to be h5 */
  </template>
  <p>Lorem ipsum…</p>
</Collapser>`}},computed:{code(){return b}}},s=t=>(w("data-v-6ea03f62"),t=t(),v(),t),B={class:"grid-container"},E={class:"grid-item-12"},y={class:"grid-container demo"},k=s(()=>n("h5",null,"Collapser",-1)),I=s(()=>n("p",null,"Lorem ipsum…",-1)),S=s(()=>n("h5",null,"Collapser with icon",-1)),T=s(()=>n("p",null,"Lorem ipsum…",-1));function D(t,L,N,V,d,c){const i=a("Collapser",!0),u=a("BulbIcon"),r=a("CodeExample");return f(),g("section",null,[n("div",B,[n("div",E,[n("div",y,[e(i,{class:"grid-item-3 collapser"},{title:o(()=>[k]),default:o(()=>[I]),_:1}),e(i,{class:"grid-item-3 collapser"},{title:o(()=>[e(u,{style:{width:"20px",height:"20px"}}),S]),default:o(()=>[T]),_:1})]),e(r,{summary:"Show usage example with icon"},{default:o(()=>[p(l(d.codeExample),1)]),_:1}),e(r,{summary:"Show Collapser.vue source code"},{default:o(()=>[p(l(c.code),1)]),_:1})])])])}const A=_(C,[["render",D],["__scopeId","data-v-6ea03f62"]]);export{A as default};
