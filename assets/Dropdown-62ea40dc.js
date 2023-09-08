import{C as T}from"./CodeExample-a15987c6.js";import{D as B}from"./arrow-dropdown-bfd1fd45.js";import{_ as E,r as b,ad as I,P as y,o as h,c as m,b as i,e as c,t as a,d,n as x,F as C,g as S,W as K,w as v,a as A}from"./index-dc7234a8.js";const V=function(){return document.ontouchstart!==null?"click":"touchstart"},f="__vue_click_away__",k=function(e,n,l){D(e);let u=l.context,t=n.value,s=!1;setTimeout(function(){s=!0},0),e[f]=function(r){if((!e||!e.contains(r.target))&&t&&s&&typeof t=="function")return t.call(u,r)},document.addEventListener(V(),e[f],!1)},D=function(e){document.removeEventListener(V(),e[f],!1),delete e[f]},N=function(e,n,l){n.value!==n.oldValue&&k(e,n,l)},M={mounted:k,updated:N,unmounted:D},O={directives:{ClickAway:M}};let P=0;const g=40,w=38,Y=36,L=35,U=27,_=13,H=1e3,z={components:{DropdownIcon:B},mixins:[O],props:{id:{type:String,default(){return`Dropdown-${P++}`}},modelValue:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},ariaLabel:{type:String,required:!0},isValid:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}}},emits:["update:modelValue"],data(){return{isExpanded:!1,searchQuery:""}},computed:{selectedIndex(){return this.possibleValues.map(e=>e.id).indexOf(this.modelValue)},showPlaceholder(){return!this.modelValue},displayTextMap(){let e={};for(let n of this.possibleValues)e[n.id]=n.text;return e},displayText(){return this.showPlaceholder?this.placeholder:this.displayTextMap.hasOwnProperty(this.modelValue)?this.displayTextMap[this.modelValue]:`(MISSING) ${this.modelValue}`},isMissing(){return this.modelValue&&!this.displayTextMap.hasOwnProperty(this.modelValue)}},created(){this.typingTimeout=null},methods:{isCurrentValue(e){return this.modelValue===e},setSelected(e){consola.trace("ListBox setSelected on",e),this.$emit("update:modelValue",e)},onOptionClick(e){this.setSelected(e),this.isExpanded=!1,this.$refs.button.focus()},scrollTo(e){let n=this.$refs.ul;if(n.scrollHeight>n.clientHeight){let l=this.$refs.options[e],u=n.clientHeight+n.scrollTop,t=l.offsetTop+l.offsetHeight;t>u?n.scrollTop=t-n.clientHeight:l.offsetTop<n.scrollTop&&(n.scrollTop=l.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.possibleValues.length||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onEndKey(){let e=this.possibleValues.length-1;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=this.$refs.ul.scrollHeight},onHomeKey(){let e=0;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=0},toggleExpanded(){this.disabled||(this.isExpanded=!this.isExpanded,this.isExpanded&&this.$nextTick(()=>this.$refs.ul.focus()))},handleKeyDownList(e){if(e.keyCode===g){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===w){this.onArrowUp(),e.preventDefault();return}if(e.keyCode===L){this.onEndKey(),e.preventDefault();return}if(e.keyCode===Y){this.onHomeKey(),e.preventDefault();return}if(e.keyCode===U){this.isExpanded=!1,this.$refs.ul.blur(),e.preventDefault();return}if(e.keyCode===_){this.isExpanded=!1,this.$refs.button.focus(),e.preventDefault();return}this.searchItem(e)},handleKeyDownButton(e){if(e.keyCode===_){this.toggleExpanded(),e.preventDefault();return}if(e.keyCode===g){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===w){this.onArrowUp(),e.preventDefault();return}this.searchItem(e)},searchItem(e){clearTimeout(this.typingTimeout),this.typingTimeout=setTimeout(()=>{this.searchQuery=""},H),this.searchQuery+=e.key,consola.trace(`Searching for ${this.searchQuery}`);const n=this.possibleValues.find(l=>l.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()));n&&this.setSelected(n.id)},hasSelection(){return this.selectedIndex>=0},getCurrentSelectedId(){try{return this.possibleValues[this.selectedIndex].id}catch{return""}},generateId(e,n){if(!n)return`${e}-${this.id}`;let l=String(n).replace(/[^\w]/gi,"");return`${e}-${this.id}-${l}`},clickAway(){this.isExpanded=!1}}},$=["id"],Q=["id","aria-label","aria-labelledby","aria-expanded"],F=["aria-activedescendant"],W=["id","title","aria-selected","onClick"],G=["id","name","value"];function R(e,n,l,u,t,s){const r=b("DropdownIcon"),p=I("click-away");return y((h(),m("div",{id:l.id,class:x(["dropdown",{collapsed:!t.isExpanded,invalid:!l.isValid,disabled:l.disabled}])},[i("div",{id:s.generateId("button"),ref:"button",role:"button",tabindex:"0","aria-haspopup":"listbox",class:x({placeholder:s.showPlaceholder,missing:s.isMissing}),"aria-label":l.ariaLabel,"aria-labelledby":s.generateId("button"),"aria-expanded":t.isExpanded,onClick:n[0]||(n[0]=(...o)=>s.toggleExpanded&&s.toggleExpanded(...o)),onKeydown:n[1]||(n[1]=(...o)=>s.handleKeyDownButton&&s.handleKeyDownButton(...o))},[c(a(s.displayText)+" ",1),d(r,{class:"icon"})],42,Q),y(i("ul",{ref:"ul",role:"listbox",tabindex:"-1","aria-activedescendant":t.isExpanded?s.generateId("option",s.getCurrentSelectedId()):!1,onKeydown:n[2]||(n[2]=(...o)=>s.handleKeyDownList&&s.handleKeyDownList(...o))},[(h(!0),m(C,null,S(l.possibleValues,o=>(h(),m("li",{id:s.generateId("option",o.id),key:`listbox-${o.id}`,ref_for:!0,ref:"options",role:"option",title:typeof o.title>"u"?o.text:o.title,class:x({focused:s.isCurrentValue(o.id),noselect:!0,empty:o.text.trim()===""}),"aria-selected":s.isCurrentValue(o.id),onClick:xe=>s.onOptionClick(o.id)},a(o.text),11,W))),128))],40,F),[[K,t.isExpanded]]),i("input",{id:l.id,type:"hidden",name:l.name,value:l.modelValue},null,8,G)],10,$)),[[p,s.clickAway]])}const q=E(z,[["render",R],["__scopeId","data-v-e6204cb1"]]),X=`<script>
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
    border: 1px solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    height: 40px;
    line-height: 40px; /* to center text vertically */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: 11px;
    pointer-events: none;
    transition: transform 0.2s ease-in-out;
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
`,j=`<Dropdown
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
/>`,J={components:{Dropdown:q,CodeExample:T},data(){return{codeExample:j,selected:"bar",placeholderModel:"",disabledSelected:""}},computed:{code(){return X}}},Z=A('<div class="grid-container"><div class="grid-item-12"><p> A list of choices the user must choose one of them, so it emits an <code>input</code> event when something is selected, and it has a <code>value</code>. Keyboard navigation works (<code>Enter</code><code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>, leave with <code>Esc</code>). </p></div></div>',1),ee={class:"grid-container"},ne={class:"grid-item-5"},te={class:"grid-item-5"},oe={class:"grid-item-2"},ie=i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null,[c(" The "),i("code",null,"placeholder"),c(" will be shown when no or empty "),i("code",null,"value"),c(" is set. Also it provides an invalid ("),i("code",null,"isValid=false"),c(") state. ")])])],-1),se={class:"grid-container"},le={class:"grid-item-5"},re={class:"grid-item-5"},de={class:"grid-item-2"},ae=i("br",null,null,-1),ce={class:"grid-container"},ue={class:"grid-item-5"},pe={class:"grid-item-2"},he={class:"grid-container"},me={class:"grid-item-12"};function fe(e,n,l,u,t,s){const r=b("Dropdown",!0),p=b("CodeExample");return h(),m("div",null,[i("section",null,[Z,i("div",ee,[i("div",ne,[d(r,{modelValue:t.selected,"onUpdate:modelValue":n[0]||(n[0]=o=>t.selected=o),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),i("div",te,[d(r,{modelValue:t.selected,"onUpdate:modelValue":n[1]||(n[1]=o=>t.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),i("div",oe,"selected id: "+a(t.selected),1)]),ie,i("div",se,[i("div",le,[d(r,{modelValue:t.placeholderModel,"onUpdate:modelValue":n[2]||(n[2]=o=>t.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),i("div",re,[d(r,{modelValue:t.placeholderModel,"onUpdate:modelValue":n[3]||(n[3]=o=>t.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),i("div",de,"selected id: "+a(t.placeholderModel),1)]),ae,i("div",ce,[i("div",ue,[d(r,{modelValue:t.disabledSelected,"onUpdate:modelValue":n[4]||(n[4]=o=>t.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),i("div",pe,"selected id: "+a(t.placeholderModel),1)])]),i("section",null,[i("div",he,[i("div",me,[d(p,{summary:"Show usage example"},{default:v(()=>[c(a(t.codeExample),1)]),_:1}),d(p,{summary:"Show Dropdown.vue source code"},{default:v(()=>[c(a(s.code),1)]),_:1})])])])])}const ge=E(J,[["render",fe]]);export{ge as default};
