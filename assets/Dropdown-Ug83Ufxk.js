import{C as k}from"./CodeExample-ua9vugdZ.js";import{D as B}from"./Dropdown-RekwcOZJ.js";import{L as D}from"./LoadingIcon-eTSBGilv.js";import{o as r,c as p,b as e,_ as T,r as m,d as i,t as s,w as c,e as l,j as S,k as V,a as I,p as z,f as N}from"./index--RvsTnyg.js";import"./arrow-dropdown-APsIr1la.js";import"./svgWithTitle-3RV5IJeo.js";const M=`<script lang="ts">
import "./variables.css";
import { mixin as VueClickAway } from "vue3-click-away";
import { isEmpty } from "lodash-es";

import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";
import type { PropType } from "vue";

type Id = string | number;
interface PossibleValue {
  id: Id;
  text: string;
  title?: string;
  slotData?: {
    [K in keyof any]: string | number | boolean;
  };
}

let count = 0;
const KEY_DOWN = "ArrowDown";
const KEY_UP = "ArrowUp";
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_ESC = "Escape";
const KEY_ENTER = "Enter";

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
      type: String as PropType<Id>,
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
     * List of possible values. Each item must have an \`id\` and a \`text\` property. To use slots an additional
     * slotData object must be passed which contains the data to be displayed.
     *
     * IMPORTANT: All values have to have a slotData object otherwise the slot will not be displayed and the
     * usual text is rendered instead.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }, {
     *   id: 'JPG',
     *   text: 'Jpeg',
     *   slotData: {
     *     fullName: 'Joint Photographic Experts Group',
     *     year: '1992'
     *     description: 'Commonly used method of lossy compression for digital images'
     *   }
     * }]
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      typingTimeout: null as null | ReturnType<typeof setTimeout>,
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
      let map = {} as Record<Id, string>;
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
    hasOptionTemplate() {
      return this.possibleValues.every(
        (value) => value.slotData && !isEmpty(value.slotData),
      );
    },
  },

  methods: {
    isCurrentValue(candidate: Id) {
      return this.modelValue === candidate;
    },
    setSelected(id: Id) {
      consola.trace("ListBox setSelected on", id);

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", id);
    },
    getButtonRef() {
      return this.$refs.button as HTMLElement;
    },
    getOptionsRefs() {
      return this.$refs.options as HTMLElement[];
    },
    getListBoxNodeRef() {
      return this.$refs.ul as HTMLElement;
    },
    onOptionClick(id: Id) {
      this.setSelected(id);
      this.isExpanded = false;
      this.getButtonRef().focus();
    },
    scrollTo(optionIndex: number) {
      let listBoxNode = this.getListBoxNodeRef();
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        let element = this.getOptionsRefs()[optionIndex];
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
      const listBoxNode = this.getListBoxNodeRef();
      listBoxNode.scrollTop = listBoxNode.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.setSelected(this.possibleValues[next].id);
      this.getListBoxNodeRef().scrollTop = 0;
    },
    toggleExpanded() {
      if (this.disabled) {
        return;
      }
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.$nextTick(() => this.getListBoxNodeRef().focus());
      }
    },
    handleKeyDownList(e: KeyboardEvent) {
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
      if (e.key === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_END) {
        this.onEndKey();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_HOME) {
        this.onHomeKey();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_ESC) {
        this.isExpanded = false;
        this.getButtonRef().focus();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === KEY_ENTER) {
        this.isExpanded = false;
        this.getButtonRef().focus();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    handleKeyDownButton(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.toggleExpanded();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    searchItem(e: KeyboardEvent) {
      if (this.typingTimeout !== null) {
        clearTimeout(this.typingTimeout);
      }
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
    generateId(node: string, itemId: Id | null = null) {
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
      <!-- @vue-ignore -->
      <DropdownIcon class="icon" />
    </div>
    <ul
      v-show="isExpanded"
      ref="ul"
      role="listbox"
      tabindex="-1"
      :aria-activedescendant="
        isExpanded ? generateId('option', getCurrentSelectedId()) : undefined
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
          'has-option-template': hasOptionTemplate,
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="onOptionClick(item.id)"
      >
        <template v-if="hasOptionTemplate">
          <slot name="option" :slot-data="item.slotData" />
        </template>
        <template v-else>
          {{ item.text }}
        </template>
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
    max-height: var(
      --dropdown-max-height,
      calc(22px * 7)
    ); /* show max 7 items. override to change default */

    font-size: 14px;
    min-height: 22px;
    width: 100%;
    padding: 0;
    margin: -1px 0 1px;
    background: var(--theme-dropdown-background-color);
    box-shadow: var(--shadow-elevation-1);
    cursor: pointer;
    outline: none;
  }

  & [role="option"] {
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);

    & > :slotted(svg) {
      stroke: var(--theme-dropdown-foreground-color);
    }

    &.empty {
      white-space: pre-wrap;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-focus);
      }
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-selected);
      }
    }
  }

  & [role="option"]:not(.slotted) {
    display: block;
    width: 100%;
    padding: 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &.empty {
      white-space: pre-wrap;
    }
  }

  & .noselect {
    user-select: none;
  }
}
</style>
`,A={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},K=e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1),L=[K];function C(d,t){return r(),p("svg",A,[...L])}const x={render:C},P={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},O=e("path",{d:"M15.935 25.421c1.97-.503 4.186-1.836 6.674-4.325 9.805-9.805 6.442-17.866 6.442-17.866s-2.94-1.227-7.428-.039c-2.944.779-6.554 2.597-10.438 6.481-2.489 2.489-3.822 4.704-4.325 6.674zm9.125-7.087c1.379 1.379.76 4.234-1.382 6.376l-4.227 4.227-3.516-3.516M13.949 7.223c-1.379-1.379-4.234-.76-6.376 1.382l-4.227 4.227 3.514 3.514m22.392-6.371-6.947-6.948M9.238 18.724 5.502 22.46m-1.495 1.495-.854.854m4.864-.545-5.409 5.409m9.004-4.839-3.79 3.79"},null,-1),R=e("circle",{cx:"20.06",cy:"11.961",r:"3.858"},null,-1),U=[O,R];function H(d,t){return r(),p("svg",P,[...U])}const g={render:H},Y={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},$=e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1),F=[$];function j(d,t){return r(),p("svg",Y,[...F])}const b={render:j},G={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},W=e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),Q=e("path",{"stroke-linecap":"round","stroke-width":"1.6",d:"M8.3 9"},null,-1),J=[W,Q];function q(d,t){return r(),p("svg",G,[...J])}const f={render:q},X=`<Dropdown
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
/>`,Z=`<Dropdown
  v-model="slottedSelected"
  aria-label="A Slotted dropdown"
  :possible-values="[{
      id: '1',
      text: 'The Sundering',
      slotData: {
          icon: DisconnectIcon,
          title: 'The Sundering',
          subtitle: 'Gods of the Earth',
          year: '2008'
      }
  }, {
      id: '2',
      text: 'Iron Swan',
      slotData: {
          icon: RocketIcon,
          title: 'Iron Swan',
          subtitle: 'Age of Winters',
          year: '2006'
      }
  }, {
      id: '3',
      text: 'The Dreamthieves',
      slotData: {
          icon: DiamondIcon,
          title: 'The Dreamthieves',
          subtitle: 'Low Country',
          year: '2016'
      }
  }, {
      id: '4',
      text: 'Twilight Sunrise',
      slotData: {
          icon: EarlyBirdIcon,
          title: 'Twilight Sunrise',
          subtitle: 'Used Future',
          year: '2018'
      }
  }]"
>
  <template
    #option="{ slotData: { icon, title, subtitle, year } } = {
      slotData: {},
    }"
  >
    <div class="slot-option">
      <component :is="icon" />
      <div class="description">
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <div class="year">{{ year }}</div>
    </div>
  </template>
</Dropdown>
`,ee={components:{Dropdown:B,CodeExample:k,LoadingIcon:D,DisconnectIcon:x,RocketIcon:g,DiamondIcon:b,EarlyBirdIcon:f},data(){return{codeExample:X,slottedCodeExample:Z,selected:"bar",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1"}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:x,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:g,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:b,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:f,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return M}}},u=d=>(z("data-v-d5d706b7"),d=d(),N(),d),ne=I('<div class="grid-container" data-v-d5d706b7><div class="grid-item-12" data-v-d5d706b7><p data-v-d5d706b7> A list of choices the user must choose one of them, so it emits an <code data-v-d5d706b7>input</code> event when something is selected, and it has a <code data-v-d5d706b7>value</code>. Keyboard navigation works (<code data-v-d5d706b7>Enter</code><code data-v-d5d706b7>Up</code>/<code data-v-d5d706b7>Down</code> and <code data-v-d5d706b7>Home</code>/<code data-v-d5d706b7>End</code>, leave with <code data-v-d5d706b7>Esc</code>). </p></div></div>',1),te={class:"grid-container"},oe={class:"grid-item-5"},ie={class:"grid-item-5"},se={class:"grid-item-2"},le=u(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[l(" The "),e("code",null,"placeholder"),l(" will be shown when no or empty "),e("code",null,"value"),l(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),l(") state. ")])])],-1)),de={class:"grid-container"},ae={class:"grid-item-5"},re={class:"grid-item-5"},ce={class:"grid-item-2"},pe=u(()=>e("br",null,null,-1)),ue={class:"grid-container"},he={class:"grid-item-5"},me={class:"grid-item-2"},ve=u(()=>e("br",null,null,-1)),xe={class:"grid-container"},ge={class:"grid-item-5"},be={class:"grid-item-2"},fe=u(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[l(" The optional "),e("code",null,"slotData"),l(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1)),we={class:"grid-container"},_e={class:"grid-item-12"},ye={class:"grid-container"},Ee={class:"grid-item-5"},ke={class:"slot-option"},Be={class:"description"},De={class:"title"},Te={class:"subtitle"},Se={class:"year"},Ve={class:"grid-item-2"},Ie={class:"grid-container"},ze={class:"grid-item-12"};function Ne(d,t,Me,Ae,n,v){const a=m("Dropdown",!0),w=m("LoadingIcon"),h=m("CodeExample");return r(),p("div",null,[e("section",null,[ne,e("div",te,[e("div",oe,[i(a,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=o=>n.selected=o),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ie,[i(a,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=o=>n.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",se,"selected id: "+s(n.selected),1)]),le,e("div",de,[e("div",ae,[i(a,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=o=>n.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",re,[i(a,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=o=>n.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ce,"selected id: "+s(n.placeholderModel),1)]),pe,e("div",ue,[e("div",he,[i(a,{modelValue:n.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=o=>n.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",me,"selected id: "+s(n.disabledSelected),1)]),ve,e("div",xe,[e("div",ge,[i(a,{modelValue:n.withSlotsSelected,"onUpdate:modelValue":t[5]||(t[5]=o=>n.withSlotsSelected=o),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":c(()=>[i(w)]),_:1},8,["modelValue"])]),e("div",be,"selected id: "+s(n.withSlotsSelected),1)]),fe]),e("section",null,[e("div",we,[e("div",_e,[i(h,{summary:"Show usage example"},{default:c(()=>[l(s(n.codeExample),1)]),_:1})])])]),e("section",null,[e("div",ye,[e("div",Ee,[i(a,{modelValue:n.slottedSelected,"onUpdate:modelValue":t[6]||(t[6]=o=>n.slottedSelected=o),"aria-label":"A limited list",size:"3","possible-values":v.slottedExamplePossibleValue},{option:c(({slotData:{icon:o,title:_,subtitle:y,year:E}}={slotData:{}})=>[e("div",ke,[(r(),S(V(o))),e("div",Be,[e("div",De,s(_),1),e("div",Te,s(y),1)]),e("div",Se,s(E),1)])]),_:1},8,["modelValue","possible-values"])]),e("div",Ve,"selected id: "+s(n.slottedSelected),1)])]),e("section",null,[e("div",Ie,[e("div",ze,[i(h,{summary:"Show slotted usage example"},{default:c(()=>[l(s(n.slottedCodeExample),1)]),_:1}),i(h,{summary:"Show Dropdown.vue source code"},{default:c(()=>[l(s(v.code),1)]),_:1})])])])])}const Ue=T(ee,[["render",Ne],["__scopeId","data-v-d5d706b7"]]);export{Ue as default};
