import{C as h}from"./CodeExample-ab3ea217.js";import{_ as m,X as v,r as d,o as S,c as f,b as e,d as o,e as l,t as c,w as p,p as g,f as I}from"./index-19536967.js";const V=`<script>
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
      <LensIcon v-if="!disabled" />
    </template>
    <template #iconRight>
      <FunctionButton
        v-show="!disabled && modelValue"
        class="clear-search"
        @click="clearSearch"
      >
        <CloseIcon />
      </FunctionButton>
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

.disabled {
  opacity: 0.5;
}

</style>
`;const _=`<SearchInput
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
`,b={components:{SearchInput:v,CodeExample:h},data(){return{codeExample:_,inputValue:"",inputValue2:"",inputValue3:"Demo"}},computed:{code(){return V}},methods:{alert(a){window.alert(a)}}},B=a=>(g("data-v-ace9b8a7"),a=a(),I(),a),w=B(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"SearchInput"),e("p",null,[l(" Single line string search input with search icon and clear button. It acts as a form element, so it emits "),e("code",null,"input"),l(" events and it has a "),e("code",null,"value"),l(". ")])])],-1)),y={class:"grid-container"},C={class:"grid-item-6 inputs"},x={class:"grid-item-6"},F={class:"grid-container"},k={class:"grid-item-12"};function E(a,n,L,U,t,r){const i=d("SearchInput",!0),u=d("CodeExample");return S(),f("div",null,[e("section",null,[w,e("div",y,[e("div",C,[o(i,{modelValue:t.inputValue,"onUpdate:modelValue":n[0]||(n[0]=s=>t.inputValue=s),label:"Search things",placeholder:"Placeholder"},null,8,["modelValue"]),o(i,{modelValue:t.inputValue2,"onUpdate:modelValue":n[1]||(n[1]=s=>t.inputValue2=s)},null,8,["modelValue"]),o(i,{"model-value":"disabled: no search possible here",disabled:""}),l(' The clear-all button emits a "clear" event that can be listend to: '),o(i,{modelValue:t.inputValue3,"onUpdate:modelValue":n[2]||(n[2]=s=>t.inputValue3=s),placeholder:"Placeholder",onClear:n[3]||(n[3]=s=>r.alert("Search cleared"))},null,8,["modelValue"])]),e("div",x," input value: "+c(t.inputValue),1)])]),e("section",null,[e("div",F,[e("div",k,[o(u,{summary:"Show usage example"},{default:p(()=>[l(c(t.codeExample),1)]),_:1}),o(u,{summary:"Show SearchInput.vue source code"},{default:p(()=>[l(c(r.code),1)]),_:1})])])])])}const N=m(b,[["render",E],["__scopeId","data-v-ace9b8a7"]]);export{N as default};
