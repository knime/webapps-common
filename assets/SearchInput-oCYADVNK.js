import{C as m}from"./CodeExample-9wTT2Cq1.js";import{F as v}from"./filter-Mf2LCvGN.js";import{_ as f,at as S,r,o as g,c as I,b as s,d as o,e as i,w as c,t as u,p as V,f as w}from"./index-1EVMs0HF.js";const b=`<script>
import CloseIcon from "../../assets/img/icons/close.svg";
import LensIcon from "../../assets/img/icons/lens.svg";
import InverseSearchIcon from "../../assets/img/icons/arrows-order-left-right.svg";
import UpperLowerCaseIcon from "../../assets/img/icons/upper-lower-case.svg";

import InputField from "./InputField.vue";
import FunctionButton from "../FunctionButton.vue";

const defaultTooltips = {
  clear: "Clear",
  inverseSearch: "Exclude results that match query",
  caseSensitive: "Toggle case sensitivity",
};

/**
 * Search input box for searches in other components, like the Twinlist.
 * Implements the v-model pattern.
 */
export default {
  components: {
    InputField,
    FunctionButton,
    CloseIcon,
    LensIcon,
    InverseSearchIcon,
    UpperLowerCaseIcon,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      // A pseudo-placeholder to allow hiding the clear-button without any input
      default: " ",
    },
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },
    initialInverseSearch: {
      default: false,
      type: Boolean,
    },
    showCaseSensitiveSearchButton: {
      default: false,
      type: Boolean,
    },
    showInverseSearchButton: {
      default: false,
      type: Boolean,
    },
    autofocus: {
      default: false,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    tooltips: {
      type: Object,
      default: () => ({}),
    },
    focusOnMount: {
      type: Boolean,
      default: false,
    },
    ariaActivedescendant: {
      type: String,
      default: null,
    },
    ariaOwns: {
      type: String,
      default: null,
    },
  },
  emits: [
    "clear",
    "update:modelValue",
    "toggle-case-sensitive-search",
    "toggle-inverse-search",
    "focus",
  ],
  data() {
    return {
      caseSensitiveSearch: this.initialCaseSensitiveSearch,
      inverseSearch: this.initialInverseSearch,
    };
  },
  computed: {
    showClearButton() {
      return !this.disabled && this.modelValue !== "";
    },
    showSpacer() {
      return (
        this.showClearButton &&
        (this.showCaseSensitiveSearchButton || this.showInverseSearchButton)
      );
    },
    tooltipsWithDefaults() {
      return { ...defaultTooltips, ...this.tooltips };
    },
  },
  expose: ["focus"],
  async mounted() {
    if (this.focusOnMount) {
      await this.$nextTick();
      this.focus();
    }
  },
  methods: {
    clearSearch() {
      this.$emit("clear");
      this.$emit("update:modelValue", "");
      this.focus();
    },
    toggleCaseSensitiveSearch() {
      this.caseSensitiveSearch = !this.caseSensitiveSearch;
      this.$emit("toggle-case-sensitive-search", this.caseSensitiveSearch);
      this.focus();
    },
    toggleInverseSearch() {
      this.inverseSearch = !this.inverseSearch;
      this.$emit("toggle-inverse-search", this.inverseSearch);
      this.focus();
    },
    focus() {
      this.$refs.searchInput.focus();
    },
  },
};
<\/script>

<template>
  <InputField
    :id="id"
    ref="searchInput"
    :name="name"
    :model-value="modelValue"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :disabled="disabled"
    class="search-input"
    :class="{ disabled }"
    autocomplete="off"
    :aria-owns="ariaOwns"
    :aria-activedescendant="ariaActivedescendant"
    role="searchbox"
    @focus="$emit('focus', $event)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #icon>
      <div v-if="!disabled" class="icon-slot-wrapper">
        <slot name="icon">
          <LensIcon />
        </slot>
      </div>
    </template>
    <template #iconRight>
      <FunctionButton
        v-if="showClearButton"
        class="clear-search"
        :title="tooltipsWithDefaults.clear"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
      <span v-if="showSpacer" class="spacer" />
      <FunctionButton
        v-if="!disabled && showCaseSensitiveSearchButton"
        class="toggle-case-sensitive-search"
        :active="caseSensitiveSearch"
        :title="tooltipsWithDefaults.caseSensitive"
        @click="toggleCaseSensitiveSearch"
      >
        <UpperLowerCaseIcon />
      </FunctionButton>
      <FunctionButton
        v-if="!disabled && showInverseSearchButton"
        class="toggle-inverse-search"
        :title="tooltipsWithDefaults.inverseSearch"
        :active="inverseSearch"
        @click="toggleInverseSearch"
      >
        <InverseSearchIcon />
      </FunctionButton>
    </template>
  </InputField>
</template>

<style lang="postcss" scoped>
.search-input {
  & .spacer {
    border: 0.4pt solid var(--knime-silver-sand);
    height: 20px;
    margin: auto 0.3em auto 0.2em;
  }
}

.disabled {
  opacity: 0.5;
}

.icon-slot-wrapper {
  /* This is done to make the wrapper have the same height as its content. */
  display: contents;
}
</style>
`,F=`<SearchInput
  v-model="inputValue"
  label="Search things"
  placeholder="Placeholder"
/>
<SearchInput />
<SearchInput
  model-value="disabled: no search possible here"
  disabled
/>
<SearchInput
  v-model="inputValue3"
  placeholder="Placeholder"
  @clear="alert('Search cleared')"
/>
<SearchInput
  v-model="inputValue"
  @focus="onFocus"
/>
<SearchInput
  v-model="inputValue4"
  @focus="onFocus"
>
  <template #icon>
    <FilterIcon />
  </template>
</SearchInput>
<SearchInput
  v-model="inputValue5"
  :show-case-sensitive-search-button="true"
  :show-inverse-search-button="true"
  :initial-inverse-search="true"
  @focus="onFocus"
/>
`,B={components:{SearchInput:S,FilterIcon:v,CodeExample:m},data(){return{codeExample:F,inputValue:"",inputValue2:"",inputValue3:"Demo",inputValue4:"",inputValue5:"Demo"}},computed:{code(){return b}},methods:{alert(a){window.alert(a)}}},y=a=>(V("data-v-aef09a0d"),a=a(),w(),a),C=y(()=>s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,[i(" Single line string search input with search icon and clear button. It acts as a form element, so it emits "),s("code",null,"input"),i(" events and it has a "),s("code",null,"value"),i(". Optionally, buttons for case-sensitive search and inverse searchc an be shown. ")])])],-1)),_={class:"grid-container"},x={class:"grid-item-6 inputs"},k={class:"grid-item-6"},U={class:"grid-container"},T={class:"grid-item-12"};function D(a,e,E,L,n,p){const l=r("SearchInput",!0),h=r("FilterIcon"),d=r("CodeExample");return g(),I("div",null,[s("section",null,[C,s("div",_,[s("div",x,[o(l,{modelValue:n.inputValue,"onUpdate:modelValue":e[0]||(e[0]=t=>n.inputValue=t),label:"Search things",placeholder:"Placeholder"},null,8,["modelValue"]),o(l,{modelValue:n.inputValue2,"onUpdate:modelValue":e[1]||(e[1]=t=>n.inputValue2=t)},null,8,["modelValue"]),o(l,{"model-value":"disabled: no search possible here",disabled:""}),i(' The clear-all button emits a "clear" event that can be listend to: '),o(l,{modelValue:n.inputValue3,"onUpdate:modelValue":e[2]||(e[2]=t=>n.inputValue3=t),placeholder:"Placeholder",onClear:e[3]||(e[3]=t=>p.alert("Search cleared"))},null,8,["modelValue"]),i(" It's possible to use a different icon: "),o(l,{modelValue:n.inputValue4,"onUpdate:modelValue":e[4]||(e[4]=t=>n.inputValue4=t),placeholder:"A different icon",onFocus:a.onFocus},{icon:c(()=>[o(h)]),_:1},8,["modelValue","onFocus"]),i(" Buttons for the search options case-sensitivity and inverse-search can be displayed. "),o(l,{modelValue:n.inputValue5,"onUpdate:modelValue":e[5]||(e[5]=t=>n.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,placeholder:"Search",onFocus:a.onFocus},null,8,["modelValue","onFocus"]),i(" Custom title for the buttons "),o(l,{modelValue:n.inputValue5,"onUpdate:modelValue":e[6]||(e[6]=t=>n.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,tooltips:{clear:"Custom clear tooltip",inverseSearch:"Custom inverse tooltip",caseSensitive:"Custom case sensitive tooltip"},placeholder:"Search",onFocus:a.onFocus},null,8,["modelValue","onFocus"])]),s("div",k,"input value: "+u(n.inputValue),1)])]),s("section",null,[s("div",U,[s("div",T,[o(d,{summary:"Show usage example"},{default:c(()=>[i(u(n.codeExample),1)]),_:1}),o(d,{summary:"Show SearchInput.vue source code"},{default:c(()=>[i(u(p.code),1)]),_:1})])])])])}const W=f(B,[["render",D],["__scopeId","data-v-aef09a0d"]]);export{W as default};
