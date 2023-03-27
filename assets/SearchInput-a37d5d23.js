import{C as m}from"./CodeExample-83ed4e50.js";import{F as v}from"./filter-59dd60d8.js";import{_ as S,a2 as f,o as I,c as g,b as e,d as o,e as l,w as r,t as c,r as u,p as V,f as w}from"./index-ae19d8f6.js";const b=`<script>
import CloseIcon from '../../assets/img/icons/close.svg';
import LensIcon from '../../assets/img/icons/lens.svg';
import InverseSearchIcon from '../../assets/img/icons/arrows-order-left-right.svg';
import UpperLowerCaseIcon from '../../assets/img/icons/upper-lower-case.svg';

import InputField from './InputField.vue';
import FunctionButton from '../FunctionButton.vue';

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
        UpperLowerCaseIcon
    },
    props: {
        id: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            // A pseudo-placeholder to allow hiding the clear-button without any input
            default: ' '
        },
        initialCaseSensitiveSearch: {
            default: false,
            type: Boolean
        },
        initialInverseSearch: {
            default: false,
            type: Boolean
        },
        showCaseSensitiveSearchButton: {
            default: false,
            type: Boolean
        },
        showInverseSearchButton: {
            default: false,
            type: Boolean
        },
        autofocus: {
            default: false,
            type: Boolean
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    emits: ['clear', 'update:modelValue', 'toggle-case-sensitive-search', 'toggle-inverse-search', 'focus'],
    data() {
        return {
            caseSensitiveSearch: this.initialCaseSensitiveSearch,
            inverseSearch: this.initialInverseSearch
        };
    },
    computed: {
        showClearButton() {
            return !this.disabled && this.modelValue !== '';
        },
        showSpacer() {
            return this.showClearButton &&
                    (this.showCaseSensitiveSearchButton || this.showInverseSearchButton);
        }
    },
    methods: {
        clearSearch() {
            this.$emit('clear');
            this.$emit('update:modelValue', '');
            this.focus();
        },
        toggleCaseSensitiveSearch() {
            this.caseSensitiveSearch = !this.caseSensitiveSearch;
            this.$emit('toggle-case-sensitive-search', this.caseSensitiveSearch);
            this.focus();
        },
        toggleInverseSearch() {
            this.inverseSearch = !this.inverseSearch;
            this.$emit('toggle-inverse-search', this.inverseSearch);
            this.focus();
        },
        focus() {
            this.$refs.searchInput.focus();
        }
    }
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
    :class="{disabled}"
    autocomplete="off"
    role="searchbox"
    @focus="$emit('focus', $event)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #icon>
      <div
        v-if="!disabled"
        class="icon-slot-wrapper"
      >
        <slot name="icon">
          <LensIcon />
        </slot>
      </div>
    </template>
    <template #iconRight>
      <FunctionButton
        v-if="showClearButton"
        class="clear-search"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
      <span
        v-if="showSpacer"
        class="spacer"
      />
      <FunctionButton
        v-if="!disabled && showCaseSensitiveSearchButton"
        class="toggle-case-sensitive-search"
        :active="caseSensitiveSearch"
        @click="toggleCaseSensitiveSearch"
      >
        <UpperLowerCaseIcon />
      </FunctionButton>
      <FunctionButton
        v-if="!disabled && showInverseSearchButton"
        class="toggle-inverse-search"
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
`;const B=`<SearchInput
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
`,F={components:{SearchInput:f,FilterIcon:v,CodeExample:m},data(){return{codeExample:B,inputValue:"",inputValue2:"",inputValue3:"Demo",inputValue4:"",inputValue5:"Demo"}},computed:{code(){return b}},methods:{alert(a){window.alert(a)}}},_=a=>(V("data-v-7622e8de"),a=a(),w(),a),y=_(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"SearchInput"),e("p",null,[l(" Single line string search input with search icon and clear button. It acts as a form element, so it emits "),e("code",null,"input"),l(" events and it has a "),e("code",null,"value"),l(". Optionally, buttons for case-sensitive search and inverse searchc an be shown. ")])])],-1)),C={class:"grid-container"},x={class:"grid-item-6 inputs"},k={class:"grid-item-6"},U={class:"grid-container"},E={class:"grid-item-12"};function L(a,n,P,T,t,p){const i=u("SearchInput",!0),h=u("FilterIcon"),d=u("CodeExample");return I(),g("div",null,[e("section",null,[y,e("div",C,[e("div",x,[o(i,{modelValue:t.inputValue,"onUpdate:modelValue":n[0]||(n[0]=s=>t.inputValue=s),label:"Search things",placeholder:"Placeholder"},null,8,["modelValue"]),o(i,{modelValue:t.inputValue2,"onUpdate:modelValue":n[1]||(n[1]=s=>t.inputValue2=s)},null,8,["modelValue"]),o(i,{"model-value":"disabled: no search possible here",disabled:""}),l(' The clear-all button emits a "clear" event that can be listend to: '),o(i,{modelValue:t.inputValue3,"onUpdate:modelValue":n[2]||(n[2]=s=>t.inputValue3=s),placeholder:"Placeholder",onClear:n[3]||(n[3]=s=>p.alert("Search cleared"))},null,8,["modelValue"]),l(" It's possible to use a different icon: "),o(i,{modelValue:t.inputValue4,"onUpdate:modelValue":n[4]||(n[4]=s=>t.inputValue4=s),placeholder:"A different icon",onFocus:a.onFocus},{icon:r(()=>[o(h)]),_:1},8,["modelValue","onFocus"]),l(" Buttons for the search options case-sensitivity and inverse-search can be displayed. "),o(i,{modelValue:t.inputValue5,"onUpdate:modelValue":n[5]||(n[5]=s=>t.inputValue5=s),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,placeholder:"Search",onFocus:a.onFocus},null,8,["modelValue","onFocus"])]),e("div",k," input value: "+c(t.inputValue),1)])]),e("section",null,[e("div",U,[e("div",E,[o(d,{summary:"Show usage example"},{default:r(()=>[l(c(t.codeExample),1)]),_:1}),o(d,{summary:"Show SearchInput.vue source code"},{default:r(()=>[l(c(p.code),1)]),_:1})])])])])}const O=S(F,[["render",L],["__scopeId","data-v-7622e8de"]]);export{O as default};
