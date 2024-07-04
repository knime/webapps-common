import{C as k}from"./CodeExample-Py2TKdaF.js";import{D}from"./Dropdown-EDPjV32k.js";import{L as E}from"./LoadingIcon-hdEd5wGX.js";import{o as c,c as u,b as e,_ as T,r as f,d as s,t as i,w as p,e as d,j as b,k as w,a as I,p as z,f as G}from"./index-RyhvXRhb.js";import"./arrow-dropdown-qSe9iu7R.js";import"./svgWithTitle-GLc3zo7f.js";const O=`<script lang="ts">
import "./variables.css";
import { isEmpty } from "lodash-es";

import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";
import { type PropType } from "vue";
import { OnClickOutside } from "@vueuse/components";

type Id = string | number;
interface PossibleValue {
  id: Id;
  text: string;
  title?: string;
  group?: string;
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
    OnClickOutside,
  },
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
     * The direction of the dropdown menu. When set to 'up', the menu will appear above the input field.
     * Defaults to 'down'.
     */
    direction: {
      default: "down",
      type: String as PropType<"up" | "down">,
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
    compact: {
      type: Boolean,
      default: false,
    },
    useGroupLabels: {
      type: Boolean,
      default: false,
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
    groupedValues() {
      const groups: Record<string, { label?: string; items: PossibleValue[] }> =
        {};
      for (const item of this.possibleValues) {
        const groupLabel = item.group || "";
        if (!groups[groupLabel]) {
          groups[groupLabel] = { label: item.group, items: [] };
        }
        groups[groupLabel].items.push(item);
      }
      return Object.values(groups);
    },
    orderedGroupedValues() {
      const namedGroups = this.groupedValues.filter(
        (group) => group.items[0].group,
      );
      const unnamedGroups = this.groupedValues.filter(
        (group) => !group.items[0].group,
      );
      return [...namedGroups, ...unnamedGroups];
    },
    flatOrderedValues() {
      return this.orderedGroupedValues.flatMap((group) => group.items);
    },
    selectedIndex() {
      return this.flatOrderedValues.map((x) => x.id).indexOf(this.modelValue);
    },
    showPlaceholder() {
      return !this.modelValue;
    },
    displayTextMap() {
      let map = {} as Record<Id, string>;
      for (let value of this.flatOrderedValues) {
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
      return this.flatOrderedValues.every(
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
      if (next >= this.flatOrderedValues.length) {
        return;
      }
      this.setSelected(this.flatOrderedValues[next].id);
      this.scrollTo(next);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      this.setSelected(this.flatOrderedValues[next].id);
      this.scrollTo(next);
    },
    onEndKey() {
      let next = this.flatOrderedValues.length - 1;
      this.setSelected(this.flatOrderedValues[next].id);
      const listBoxNode = this.getListBoxNodeRef();
      listBoxNode.scrollTop = listBoxNode.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.setSelected(this.flatOrderedValues[next].id);
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
      const candidate = this.flatOrderedValues.find((item) =>
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
        return this.flatOrderedValues[this.selectedIndex].id;
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
  <OnClickOutside @trigger="clickAway">
    <div
      :id="id"
      :class="[
        'dropdown',
        { collapsed: !isExpanded, invalid: !isValid, disabled, compact },
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
        :class="{ 'drops-upwards': direction === 'up' }"
        @keydown="handleKeyDownList"
      >
        <template
          v-for="(group, groupIndex) in orderedGroupedValues"
          :key="groupIndex"
        >
          <span v-if="useGroupLabels" class="group-label">{{
            group.label
          }}</span>
          <span v-else class="group-divider" />
          <li
            v-for="item in group.items"
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
              'has-group-label': useGroupLabels,
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
        </template>
      </ul>
      <input :id="id" type="hidden" :name="name" :value="modelValue" />
    </div>
  </OnClickOutside>
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

  &.compact {
    & [role="button"] {
      height: var(--single-line-form-height-compact);
    }

    & .icon {
      top: calc(
        (var(--single-line-form-height-compact) - var(--icon-size)) / 2
      );
      right: var(--space-8);
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

  /* stylelint-disable-next-line no-descending-specificity */
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

  /* stylelint-disable-next-line no-descending-specificity */
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

    &.drops-upwards {
      bottom: 100%;
    }
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

    &.has-group-label {
      padding-left: 15px;
    }
  }

  & .noselect {
    user-select: none;
  }

  & .group-label {
    display: block;
    margin: 5px 10px;
    cursor: default;
    font-weight: 500;
  }

  & .group-divider {
    display: block;
    margin: 10px 10px 5px;
    border-top: 1px solid var(--knime-silver-sand);

    &:first-child {
      display: none;
    }
  }
}
</style>
`,L={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},N=e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1),M=[N];function A(r,t){return c(),u("svg",L,[...M])}const _={render:A},K={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},P=e("path",{d:"M15.935 25.421c1.97-.503 4.186-1.836 6.674-4.325 9.805-9.805 6.442-17.866 6.442-17.866s-2.94-1.227-7.428-.039c-2.944.779-6.554 2.597-10.438 6.481-2.489 2.489-3.822 4.704-4.325 6.674zm9.125-7.087c1.379 1.379.76 4.234-1.382 6.376l-4.227 4.227-3.516-3.516M13.949 7.223c-1.379-1.379-4.234-.76-6.376 1.382l-4.227 4.227 3.514 3.514m22.392-6.371-6.947-6.948M9.238 18.724 5.502 22.46m-1.495 1.495-.854.854m4.864-.545-5.409 5.409m9.004-4.839-3.79 3.79"},null,-1),C=e("circle",{cx:"20.06",cy:"11.961",r:"3.858"},null,-1),U=[P,C];function R(r,t){return c(),u("svg",K,[...U])}const y={render:R},H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Y=e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1),F=[Y];function W(r,t){return c(),u("svg",H,[...F])}const B={render:W},j={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q=e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),J=e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1),q=[Q,J];function X(r,t){return c(),u("svg",j,[...q])}const S={render:X},Z=`<Dropdown
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
/>`,$=`<Dropdown
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
`,ee={components:{Dropdown:D,CodeExample:k,LoadingIcon:E,DisconnectIcon:_,RocketIcon:y,DiamondIcon:B,EarlyBirdIcon:S},data(){return{codeExample:Z,slottedCodeExample:$,selected:"bar",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:""}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:_,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:y,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:B,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:S,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return O}}},a=r=>(z("data-v-ae4cf985"),r=r(),G(),r),ne=I('<div class="grid-container" data-v-ae4cf985><div class="grid-item-12" data-v-ae4cf985><p data-v-ae4cf985> A list of choices the user must choose one of them, so it emits an <code data-v-ae4cf985>input</code> event when something is selected, and it has a <code data-v-ae4cf985>value</code>. Keyboard navigation works (<code data-v-ae4cf985>Enter</code><code data-v-ae4cf985>Up</code>/<code data-v-ae4cf985>Down</code> and <code data-v-ae4cf985>Home</code>/<code data-v-ae4cf985>End</code>, leave with <code data-v-ae4cf985>Esc</code>). </p></div></div>',1),te={class:"grid-container"},oe={class:"grid-item-5"},ie={class:"grid-item-5"},se={class:"grid-item-2"},le=a(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[d(" The "),e("code",null,"placeholder"),d(" will be shown when no or empty "),e("code",null,"value"),d(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),d(") state. ")])])],-1)),de={class:"grid-container"},re={class:"grid-item-5"},ae={class:"grid-item-5"},ce={class:"grid-item-2"},pe=a(()=>e("br",null,null,-1)),ue={class:"grid-container"},he={class:"grid-item-5"},me={class:"grid-item-2"},ge=a(()=>e("br",null,null,-1)),ve={class:"grid-container"},xe={class:"grid-item-5"},fe={class:"grid-item-2"},be=a(()=>e("br",null,null,-1)),we={class:"grid-container"},_e={class:"grid-item-5"},ye={class:"grid-item-2"},Be=a(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[d(" The optional "),e("code",null,"direction"),d(" property can be used to display the dropdown above the input field. ")])])],-1)),Se={class:"grid-container"},Ve={class:"grid-item-5"},ke={class:"grid-item-2"},De=a(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),Ee={class:"grid-container"},Te={class:"grid-item-5"},Ie={class:"grid-item-5"},ze={class:"grid-item-2"},Ge=a(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[d(" The optional "),e("code",null,"slotData"),d(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1)),Oe={class:"grid-container"},Le={class:"grid-item-12"},Ne={class:"grid-container"},Me={class:"grid-item-5"},Ae={class:"slot-option"},Ke={class:"description"},Pe={class:"title"},Ce={class:"subtitle"},Ue={class:"year"},Re={class:"grid-item-2"},He=a(()=>e("br",null,null,-1)),Ye={class:"grid-container"},Fe={class:"grid-item-5"},We={class:"slot-option"},je={class:"description"},Qe={class:"title"},Je={class:"subtitle"},qe={class:"year"},Xe={class:"grid-item-2"},Ze={class:"grid-container"},$e={class:"grid-item-12"};function en(r,t,nn,tn,n,h){const l=f("Dropdown",!0),V=f("LoadingIcon"),m=f("CodeExample");return c(),u("div",null,[e("section",null,[ne,e("div",te,[e("div",oe,[s(l,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=o=>n.selected=o),"aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ie,[s(l,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=o=>n.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",se,"selected id: "+i(n.selected),1)]),le,e("div",de,[e("div",re,[s(l,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=o=>n.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ae,[s(l,{modelValue:n.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=o=>n.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ce,"selected id: "+i(n.placeholderModel),1)]),pe,e("div",ue,[e("div",he,[s(l,{modelValue:n.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=o=>n.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",me,"selected id: "+i(n.disabledSelected),1)]),ge,e("div",ve,[e("div",xe,[s(l,{modelValue:n.withSlotsSelected,"onUpdate:modelValue":t[5]||(t[5]=o=>n.withSlotsSelected=o),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":p(()=>[s(V)]),_:1},8,["modelValue"])]),e("div",fe,"selected id: "+i(n.withSlotsSelected),1)]),be,e("div",we,[e("div",_e,[s(l,{modelValue:n.withSlotsSelected,"onUpdate:modelValue":t[6]||(t[6]=o=>n.withSlotsSelected=o),placeholder:"In compact mode","aria-label":"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ye,"selected id: "+i(n.withSlotsSelected),1)]),Be,e("div",Se,[e("div",Ve,[s(l,{modelValue:n.dropupSelected,"onUpdate:modelValue":t[7]||(t[7]=o=>n.dropupSelected=o),"aria-label":"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",ke,"selected id: "+i(n.dropupSelected),1)]),De,e("div",Ee,[e("div",Te,[s(l,{modelValue:n.withGroupSelected,"onUpdate:modelValue":t[8]||(t[8]=o=>n.withGroupSelected=o),placeholder:"With groups","aria-label":"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",Ie,[s(l,{modelValue:n.withGroupSelected,"onUpdate:modelValue":t[9]||(t[9]=o=>n.withGroupSelected=o),placeholder:"With group labels","aria-label":"Dropdown with groups","use-group-labels":!0,"possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",ze,"selected id: "+i(n.withGroupSelected),1)]),Ge]),e("section",null,[e("div",Oe,[e("div",Le,[s(m,{summary:"Show usage example"},{default:p(()=>[d(i(n.codeExample),1)]),_:1})])])]),e("section",null,[e("div",Ne,[e("div",Me,[s(l,{modelValue:n.slottedSelected,"onUpdate:modelValue":t[10]||(t[10]=o=>n.slottedSelected=o),"aria-label":"A limited list",size:"3","possible-values":h.slottedExamplePossibleValue},{option:p(({slotData:{icon:o,title:g,subtitle:v,year:x}}={slotData:{}})=>[e("div",Ae,[(c(),b(w(o))),e("div",Ke,[e("div",Pe,i(g),1),e("div",Ce,i(v),1)]),e("div",Ue,i(x),1)])]),_:1},8,["modelValue","possible-values"])]),e("div",Re,"selected id: "+i(n.slottedSelected),1)]),He,e("div",Ye,[e("div",Fe,[s(l,{modelValue:n.withSlotsSelected,"onUpdate:modelValue":t[11]||(t[11]=o=>n.withSlotsSelected=o),placeholder:"In compact mode","aria-label":"A limited list",size:"3",compact:"","possible-values":h.slottedExamplePossibleValue},{option:p(({slotData:{icon:o,title:g,subtitle:v,year:x}}={slotData:{}})=>[e("div",We,[(c(),b(w(o))),e("div",je,[e("div",Qe,i(g),1),e("div",Je,i(v),1)]),e("div",qe,i(x),1)])]),_:1},8,["modelValue","possible-values"])]),e("div",Xe,"selected id: "+i(n.slottedSelected),1)])]),e("section",null,[e("div",Ze,[e("div",$e,[s(m,{summary:"Show slotted usage example"},{default:p(()=>[d(i(n.slottedCodeExample),1)]),_:1}),s(m,{summary:"Show Dropdown.vue source code"},{default:p(()=>[d(i(h.code),1)]),_:1})])])])])}const cn=T(ee,[["render",en],["__scopeId","data-v-ae4cf985"]]);export{cn as default};
