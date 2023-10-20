import{C as I}from"./CodeExample-63ce1427.js";import{_ as k,r as f,ag as B,P as y,o as p,c as m,b as o,e as u,t as c,u as S,l as C,d as a,n as b,F as K,g as A,a3 as N,w as v,a as z}from"./index-0c667c3d.js";import{D as L}from"./arrow-dropdown-c1760ed1.js";import{L as M}from"./LoadingIcon-08c7da1b.js";import"./svgWithTitle-88ef7d56.js";const V=function(){return document.ontouchstart!==null?"click":"touchstart"},x="__vue_click_away__",T=function(e,n,s){D(e);let h=s.context,t=n.value,i=!1;setTimeout(function(){i=!0},0),e[x]=function(d){if((!e||!e.contains(d.target))&&t&&i&&typeof t=="function")return t.call(h,d)},document.addEventListener(V(),e[x],!1)},D=function(e){document.removeEventListener(V(),e[x],!1),delete e[x]},O=function(e,n,s){n.value!==n.oldValue&&T(e,n,s)},P={mounted:T,updated:O,unmounted:D},U={directives:{ClickAway:P}};let Y=0;const w=40,_=38,H=36,$=35,F=27,E=13,Q=1e3,R={components:{DropdownIcon:L},mixins:[U],props:{id:{type:String,default(){return`Dropdown-${Y++}`}},modelValue:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},ariaLabel:{type:String,required:!0},isValid:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}}},emits:["update:modelValue"],data(){return{isExpanded:!1,searchQuery:""}},computed:{selectedIndex(){return this.possibleValues.map(e=>e.id).indexOf(this.modelValue)},showPlaceholder(){return!this.modelValue},displayTextMap(){let e={};for(let n of this.possibleValues)e[n.id]=n.text;return e},displayText(){return this.showPlaceholder?this.placeholder:this.displayTextMap.hasOwnProperty(this.modelValue)?this.displayTextMap[this.modelValue]:`(MISSING) ${this.modelValue}`},isMissing(){return this.modelValue&&!this.displayTextMap.hasOwnProperty(this.modelValue)},hasRightIcon(){var e,n;return(n=(e=this.$slots)["icon-right"])==null?void 0:n.call(e).length}},created(){this.typingTimeout=null},methods:{isCurrentValue(e){return this.modelValue===e},setSelected(e){consola.trace("ListBox setSelected on",e),this.$emit("update:modelValue",e)},onOptionClick(e){this.setSelected(e),this.isExpanded=!1,this.$refs.button.focus()},scrollTo(e){let n=this.$refs.ul;if(n.scrollHeight>n.clientHeight){let s=this.$refs.options[e],h=n.clientHeight+n.scrollTop,t=s.offsetTop+s.offsetHeight;t>h?n.scrollTop=t-n.clientHeight:s.offsetTop<n.scrollTop&&(n.scrollTop=s.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.possibleValues.length||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onEndKey(){let e=this.possibleValues.length-1;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=this.$refs.ul.scrollHeight},onHomeKey(){let e=0;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=0},toggleExpanded(){this.disabled||(this.isExpanded=!this.isExpanded,this.isExpanded&&this.$nextTick(()=>this.$refs.ul.focus()))},handleKeyDownList(e){if(e.keyCode===w){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===_){this.onArrowUp(),e.preventDefault();return}if(e.keyCode===$){this.onEndKey(),e.preventDefault();return}if(e.keyCode===H){this.onHomeKey(),e.preventDefault();return}if(e.keyCode===F){this.isExpanded=!1,this.$refs.ul.blur(),e.preventDefault();return}if(e.keyCode===E){this.isExpanded=!1,this.$refs.button.focus(),e.preventDefault();return}this.searchItem(e)},handleKeyDownButton(e){if(e.keyCode===E){this.toggleExpanded(),e.preventDefault();return}if(e.keyCode===w){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===_){this.onArrowUp(),e.preventDefault();return}this.searchItem(e)},searchItem(e){clearTimeout(this.typingTimeout),this.typingTimeout=setTimeout(()=>{this.searchQuery=""},Q),this.searchQuery+=e.key,consola.trace(`Searching for ${this.searchQuery}`);const n=this.possibleValues.find(s=>s.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()));n&&this.setSelected(n.id)},hasSelection(){return this.selectedIndex>=0},getCurrentSelectedId(){try{return this.possibleValues[this.selectedIndex].id}catch{return""}},generateId(e,n){if(!n)return`${e}-${this.id}`;let s=String(n).replace(/[^\w]/gi,"");return`${e}-${this.id}-${s}`},clickAway(){this.isExpanded=!1}}},W=["id"],G=["id","aria-label","aria-labelledby","aria-expanded"],q={key:0,class:"loading-icon"},X=["aria-activedescendant"],j=["id","title","aria-selected","onClick"],J=["id","name","value"];function Z(e,n,s,h,t,i){const d=f("DropdownIcon"),g=B("click-away");return y((p(),m("div",{id:s.id,class:b(["dropdown",{collapsed:!t.isExpanded,invalid:!s.isValid,disabled:s.disabled}])},[o("div",{id:i.generateId("button"),ref:"button",role:"button",tabindex:"0","aria-haspopup":"listbox",class:b({placeholder:i.showPlaceholder,missing:i.isMissing}),"aria-label":s.ariaLabel,"aria-labelledby":i.generateId("button"),"aria-expanded":t.isExpanded,onClick:n[0]||(n[0]=(...l)=>i.toggleExpanded&&i.toggleExpanded(...l)),onKeydown:n[1]||(n[1]=(...l)=>i.handleKeyDownButton&&i.handleKeyDownButton(...l))},[u(c(i.displayText)+" ",1),i.hasRightIcon?(p(),m("div",q,[S(e.$slots,"icon-right")])):C("",!0),a(d,{class:"icon"})],42,G),y(o("ul",{ref:"ul",role:"listbox",tabindex:"-1","aria-activedescendant":t.isExpanded?i.generateId("option",i.getCurrentSelectedId()):!1,onKeydown:n[2]||(n[2]=(...l)=>i.handleKeyDownList&&i.handleKeyDownList(...l))},[(p(!0),m(K,null,A(s.possibleValues,l=>(p(),m("li",{id:i.generateId("option",l.id),key:`listbox-${l.id}`,ref_for:!0,ref:"options",role:"option",title:typeof l.title>"u"?l.text:l.title,class:b({focused:i.isCurrentValue(l.id),noselect:!0,empty:l.text.trim()===""}),"aria-selected":i.isCurrentValue(l.id),onClick:r=>i.onOptionClick(l.id)},c(l.text),11,j))),128))],40,X),[[N,t.isExpanded]]),o("input",{id:s.id,type:"hidden",name:s.name,value:s.modelValue},null,8,J)],10,W)),[[g,i.clickAway]])}const ee=k(R,[["render",Z],["__scopeId","data-v-db8aa486"]]),ne=`<script>
import "./variables.css";
import { mixin as VueClickAway } from "vue3-click-away";

import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";

let count = 0;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const TYPING_TIMEOUT = 1000; // in ms

export default {
  components: {
    DropdownIcon,
  },
  mixins: [VueClickAway],
  props: {
    id: {
      type: String,
      default() {
        return \`Dropdown-\${count++}\`;
      },
    },
    modelValue: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     */
    possibleValues: {
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      isExpanded: false,
      searchQuery: "",
    };
  },
  computed: {
    selectedIndex() {
      return this.possibleValues.map((x) => x.id).indexOf(this.modelValue);
    },
    showPlaceholder() {
      return !this.modelValue;
    },
    displayTextMap() {
      let map = {};
      for (let value of this.possibleValues) {
        map[value.id] = value.text;
      }
      return map;
    },
    displayText() {
      if (this.showPlaceholder) {
        return this.placeholder;
      } else if (this.displayTextMap.hasOwnProperty(this.modelValue)) {
        return this.displayTextMap[this.modelValue];
      } else {
        return \`(MISSING) \${this.modelValue}\`;
      }
    },
    isMissing() {
      return (
        this.modelValue && !this.displayTextMap.hasOwnProperty(this.modelValue)
      );
    },
    hasRightIcon() {
      return this.$slots["icon-right"]?.().length;
    },
  },
  created() {
    this.typingTimeout = null;
  },
  methods: {
    isCurrentValue(candidate) {
      return this.modelValue === candidate;
    },
    setSelected(id) {
      consola.trace("ListBox setSelected on", id);

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", id);
    },
    onOptionClick(id) {
      this.setSelected(id);
      this.isExpanded = false;
      this.$refs.button.focus();
    },
    scrollTo(optionIndex) {
      let listBoxNode = this.$refs.ul;
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        let element = this.$refs.options[optionIndex];
        let scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
        let elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
        } else if (element.offsetTop < listBoxNode.scrollTop) {
          listBoxNode.scrollTop = element.offsetTop;
        }
      }
    },
    onArrowDown() {
      let next = this.selectedIndex + 1;
      if (next >= this.possibleValues.length) {
        return;
      }
      this.setSelected(this.possibleValues[next].id);
      this.scrollTo(next);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      this.setSelected(this.possibleValues[next].id);
      this.scrollTo(next);
    },
    onEndKey() {
      let next = this.possibleValues.length - 1;
      this.setSelected(this.possibleValues[next].id);
      this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.setSelected(this.possibleValues[next].id);
      this.$refs.ul.scrollTop = 0;
    },
    toggleExpanded() {
      if (this.disabled) {
        return;
      }
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.$nextTick(() => this.$refs.ul.focus());
      }
    },
    handleKeyDownList(e) {
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
      if (e.keyCode === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_END) {
        this.onEndKey();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_HOME) {
        this.onHomeKey();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_ESC) {
        this.isExpanded = false;
        this.$refs.ul.blur();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_ENTER) {
        this.isExpanded = false;
        this.$refs.button.focus();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    handleKeyDownButton(e) {
      if (e.keyCode === KEY_ENTER) {
        this.toggleExpanded();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    searchItem(e) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.searchQuery = "";
      }, TYPING_TIMEOUT);
      this.searchQuery += e.key;

      consola.trace(\`Searching for \${this.searchQuery}\`);

      const candidate = this.possibleValues.find((item) =>
        item.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()),
      );
      if (candidate) {
        this.setSelected(candidate.id);
      }
    },
    hasSelection() {
      return this.selectedIndex >= 0;
    },
    getCurrentSelectedId() {
      try {
        return this.possibleValues[this.selectedIndex].id;
      } catch (e) {
        return "";
      }
    },
    generateId(node, itemId) {
      if (!itemId) {
        return \`\${node}-\${this.id}\`;
      }
      let cleanId = String(itemId).replace(/[^\\w]/gi, "");
      return \`\${node}-\${this.id}-\${cleanId}\`;
    },
    clickAway() {
      this.isExpanded = false;
    },
  },
};
<\/script>

<template>
  <div
    :id="id"
    v-click-away="clickAway"
    :class="[
      'dropdown',
      { collapsed: !isExpanded, invalid: !isValid, disabled },
    ]"
  >
    <div
      :id="generateId('button')"
      ref="button"
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      :class="{ placeholder: showPlaceholder, missing: isMissing }"
      :aria-label="ariaLabel"
      :aria-labelledby="generateId('button')"
      :aria-expanded="isExpanded"
      @click="toggleExpanded"
      @keydown="handleKeyDownButton"
    >
      {{ displayText }}
      <div v-if="hasRightIcon" class="loading-icon">
        <slot name="icon-right" />
      </div>
      <DropdownIcon class="icon" />
    </div>
    <ul
      v-show="isExpanded"
      ref="ul"
      role="listbox"
      tabindex="-1"
      :aria-activedescendant="
        isExpanded ? generateId('option', getCurrentSelectedId()) : false
      "
      @keydown="handleKeyDownList"
    >
      <li
        v-for="item of possibleValues"
        :id="generateId('option', item.id)"
        :key="\`listbox-\${item.id}\`"
        ref="options"
        role="option"
        :title="typeof item.title === 'undefined' ? item.text : item.title"
        :class="{
          focused: isCurrentValue(item.id),
          noselect: true,
          empty: item.text.trim() === '',
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="onOptionClick(item.id)"
      >
        {{ item.text }}
      </li>
    </ul>
    <input :id="id" type="hidden" :name="name" :value="modelValue" />
  </div>
</template>

<style lang="postcss" scoped>
.dropdown {
  position: relative;

  &.collapsed {
    background: var(--theme-dropdown-background-color);

    &.disabled {
      opacity: 0.5;
    }
  }

  &:not(.disabled).collapsed:hover {
    background: var(--knime-silver-sand-semi);
  }

  & .missing {
    color: var(--theme-color-error);
  }

  &.invalid::after {
    content: "";
    position: absolute;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
  }

  & .placeholder {
    color: var(--knime-stone-gray);
    user-select: none;
  }

  & [role="button"] {
    margin: 0;
    border: var(--form-border-width) solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    height: var(--single-line-form-height);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 10px;

    &:focus {
      outline: none;
    }
  }

  &:not(.collapsed) [role="button"] {
    border-color: var(--knime-masala);
  }

  &:not(.disabled) [role="button"] {
    cursor: pointer;

    &:focus {
      border-color: var(--knime-masala);
    }
  }

  & .icon {
    --icon-size: 18px;

    width: var(--icon-size);
    height: var(--icon-size);
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: calc((var(--single-line-form-height) - var(--icon-size)) / 2);
    pointer-events: none;
    transition: transform 0.2s ease-in-out;
  }

  & .loading-icon {
    --icon-size: 18;

    display: flex;
    pointer-events: none;

    & :slotted(svg) {
      vertical-align: top;
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
      stroke: var(--knime-masala);
    }
  }

  &:not(.collapsed) .icon {
    transform: scaleY(-1);
  }

  /* this selector is required to override some * rules interfere (overflow) - so do not simplify */
  & [role="listbox"] {
    overflow-y: auto;
    position: absolute;
    z-index: var(--z-index-common-dropdown-expanded, 2);
    max-height: calc(22px * 7); /* show max 7 items */
    font-size: 14px;
    min-height: 22px;
    width: 100%;
    padding: 0;
    margin: -1px 0 1px;
    background: var(--theme-dropdown-background-color);
    box-shadow: var(--shadow-elevation-1);
    cursor: pointer;
  }

  & [role="option"] {
    display: block;
    width: 100%;
    padding: 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);

    &.empty {
      white-space: pre-wrap;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  & .noselect {
    user-select: none;
  }
}
</style>
`,te=`<Dropdown
  v-model="selected"
  aria-label="A Dropdown"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>`,oe={components:{Dropdown:ee,CodeExample:I,LoadingIcon:M},data(){return{codeExample:te,selected:"bar",placeholderModel:"",disabledSelected:"",withSlotsSelected:""}},computed:{code(){return ne}}},ie=z('<div class="grid-container"><div class="grid-item-12"><p> A list of choices the user must choose one of them, so it emits an <code>input</code> event when something is selected, and it has a <code>value</code>. Keyboard navigation works (<code>Enter</code><code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>, leave with <code>Esc</code>). </p></div></div>',1),se={class:"grid-container"},le={class:"grid-item-5"},re={class:"grid-item-5"},de={class:"grid-item-2"},ae=o("div",{class:"grid-container"},[o("div",{class:"grid-item-12"},[o("p",null,[u(" The "),o("code",null,"placeholder"),u(" will be shown when no or empty "),o("code",null,"value"),u(" is set. Also it provides an invalid ("),o("code",null,"isValid=false"),u(") state. ")])])],-1),ce={class:"grid-container"},ue={class:"grid-item-5"},he={class:"grid-item-5"},pe={class:"grid-item-2"},me=o("br",null,null,-1),fe={class:"grid-container"},xe={class:"grid-item-5"},ge={class:"grid-item-2"},be={class:"grid-container"},ve={class:"grid-item-5"},ye={class:"grid-item-2"},we={class:"grid-container"},_e={class:"grid-item-12"};function Ee(e,n,s,h,t,i){const d=f("Dropdown",!0),g=f("LoadingIcon"),l=f("CodeExample");return p(),m("div",null,[o("section",null,[ie,o("div",se,[o("div",le,[a(d,{modelValue:t.selected,"onUpdate:modelValue":n[0]||(n[0]=r=>t.selected=r),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),o("div",re,[a(d,{modelValue:t.selected,"onUpdate:modelValue":n[1]||(n[1]=r=>t.selected=r),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),o("div",de,"selected id: "+c(t.selected),1)]),ae,o("div",ce,[o("div",ue,[a(d,{modelValue:t.placeholderModel,"onUpdate:modelValue":n[2]||(n[2]=r=>t.placeholderModel=r),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),o("div",he,[a(d,{modelValue:t.placeholderModel,"onUpdate:modelValue":n[3]||(n[3]=r=>t.placeholderModel=r),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),o("div",pe,"selected id: "+c(t.placeholderModel),1)]),me,o("div",fe,[o("div",xe,[a(d,{modelValue:t.disabledSelected,"onUpdate:modelValue":n[4]||(n[4]=r=>t.disabledSelected=r),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),o("div",ge,"selected id: "+c(t.disabledSelected),1)]),o("div",be,[o("div",ve,[a(d,{modelValue:t.withSlotsSelected,"onUpdate:modelValue":n[5]||(n[5]=r=>t.withSlotsSelected=r),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":v(()=>[a(g)]),_:1},8,["modelValue"])]),o("div",ye,"selected id: "+c(t.withSlotsSelected),1)])]),o("section",null,[o("div",we,[o("div",_e,[a(l,{summary:"Show usage example"},{default:v(()=>[u(c(t.codeExample),1)]),_:1}),a(l,{summary:"Show Dropdown.vue source code"},{default:v(()=>[u(c(i.code),1)]),_:1})])])])])}const Be=k(oe,[["render",Ee]]);export{Be as default};
