import{C as h}from"./CodeExample-1fabe242.js";import{D as m}from"./Dropdown-fc991402.js";import{L as x}from"./LoadingIcon-b3ef92f2.js";import{_ as f,r,o as b,c as v,b as e,d as i,t as l,w as a,e as d,a as g}from"./index-157ee618.js";import"./arrow-dropdown-6d4d1b6b.js";import"./svgWithTitle-be037792.js";const w=`<script>
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
`,y=`<Dropdown
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
/>`,_={components:{Dropdown:m,CodeExample:h,LoadingIcon:x},data(){return{codeExample:y,selected:"bar",placeholderModel:"",disabledSelected:"",withSlotsSelected:""}},computed:{code(){return w}}},E=g('<div class="grid-container"><div class="grid-item-12"><p> A list of choices the user must choose one of them, so it emits an <code>input</code> event when something is selected, and it has a <code>value</code>. Keyboard navigation works (<code>Enter</code><code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>, leave with <code>Esc</code>). </p></div></div>',1),k={class:"grid-container"},B={class:"grid-item-5"},V={class:"grid-item-5"},D={class:"grid-item-2"},S=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[d(" The "),e("code",null,"placeholder"),d(" will be shown when no or empty "),e("code",null,"value"),d(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),d(") state. ")])])],-1),T={class:"grid-container"},I={class:"grid-item-5"},z={class:"grid-item-5"},C={class:"grid-item-2"},N=e("br",null,null,-1),K={class:"grid-container"},A={class:"grid-item-5"},Y={class:"grid-item-2"},L={class:"grid-container"},M={class:"grid-item-5"},O={class:"grid-item-2"},U={class:"grid-container"},P={class:"grid-item-12"};function H(F,t,$,Q,n,p){const s=r("Dropdown",!0),u=r("LoadingIcon"),c=r("CodeExample");return b(),v("div",null,[e("section",null,[E,e("div",k,[e("div",B,[i(s,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=o=>n.selected=o),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",V,[i(s,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=o=>n.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",D,"selected id: "+l(n.selected),1)]),S,e("div",T,[e("div",I,[i(s,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=o=>n.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",z,[i(s,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=o=>n.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",C,"selected id: "+l(n.placeholderModel),1)]),N,e("div",K,[e("div",A,[i(s,{modelValue:n.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=o=>n.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",Y,"selected id: "+l(n.disabledSelected),1)]),e("div",L,[e("div",M,[i(s,{modelValue:n.withSlotsSelected,"onUpdate:modelValue":t[5]||(t[5]=o=>n.withSlotsSelected=o),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":a(()=>[i(u)]),_:1},8,["modelValue"])]),e("div",O,"selected id: "+l(n.withSlotsSelected),1)])]),e("section",null,[e("div",U,[e("div",P,[i(c,{summary:"Show usage example"},{default:a(()=>[d(l(n.codeExample),1)]),_:1}),i(c,{summary:"Show Dropdown.vue source code"},{default:a(()=>[d(l(p.code),1)]),_:1})])])])])}const J=f(_,[["render",H]]);export{J as default};
