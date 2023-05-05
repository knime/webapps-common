import{C as _}from"./CodeExample-e13e6dfe.js";import{M as O}from"./Multiselect-16fc653a.js";import{_ as I,s as V,N as F,r as p,o as f,j as B,w as m,b as e,x,y as u,n as S,c as b,F as C,g as z,t as a,d as l,O as g,h as E,a3 as k,V as A,e as h}from"./index-376170fd.js";import"./Checkbox-755b7125.js";import"./arrow-dropdown-97894e3b.js";const M={components:{Multiselect:O,FunctionButton:V,CloseIcon:F},props:{possibleValues:{type:Array,default:()=>[],validator(i){return Array.isArray(i)?i.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}},initialSelectedIds:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(i){return i>=0}},closeDropdownOnSelection:{type:Boolean,default:!1},isValid:{type:Boolean,default:!0}},emits:["update:selectedIds"],data(){return{selectedIds:this.initialSelectedIds,searchValue:"",inputOrOptionsFocussed:!1,focusElement:null,refocusElement:null}},computed:{filteredValues(){return this.possibleValues.filter(i=>i.text.includes(this.searchValue))},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputOrOptionsFocussed&&this.filteredValues.length>0?{}:{width:"0%"}},selectedValues(){return this.selectedIds.length===0?[]:this.possibleValues.filter(i=>this.selectedIds.includes(i.id))},maxSizeVisibleOptions(){return this.filteredValues.length<this.sizeVisibleOptions?this.filteredValues.length:this.sizeVisibleOptions}},mounted(){this.focusElement=this.$refs.searchInput,this.refocusElement=this.$refs.listBox},methods:{focusInput(){this.$refs.searchInput.focus()},onDown(){this.$refs.combobox.onDown()},onFocusOutside(){this.inputOrOptionsFocussed=!1,this.searchValue=""},onInput(){this.$refs.combobox.updateFocusOptions()},onInputFocus(){this.inputOrOptionsFocussed||this.$refs.combobox.toggle(),this.inputOrOptionsFocussed=!0,this.$refs.combobox.updateFocusOptions()},onInputEscape(){this.$refs.combobox.closeOptions()},updateSelectedIds(i){this.selectedIds=i,this.$emit("update:selectedIds",this.selectedIds)},removeTag(i){this.updateSelectedIds(this.selectedIds.filter(n=>n!==i)),this.$refs.combobox.closeOptions()},removeAllTags(){this.updateSelectedIds([]),this.$refs.combobox.closeOptions()}}},T=["title"],D={class:"text"},N={class:"icon-right"};function U(i,n,v,w,t,s){const c=p("CloseIcon"),r=p("FunctionButton"),d=p("Multiselect");return f(),B(d,{ref:"combobox","model-value":t.selectedIds,"possible-values":s.filteredValues,"use-custom-list-box":"","size-visible-options":s.maxSizeVisibleOptions,"parent-focus-element":t.focusElement,"parent-refocus-element-on-close":t.refocusElement,"close-dropdown-on-selection":v.closeDropdownOnSelection,"is-valid":v.isValid,onFocusOutside:s.onFocusOutside,"onUpdate:modelValue":s.updateSelectedIds},{listBox:m(()=>[e("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:n[6]||(n[6]=x(u((...o)=>s.focusInput&&s.focusInput(...o),["prevent","self"]),["enter"]))},[e("div",{class:S(["summary-input-wrapper",{"with-icon-right":s.hasSelection}]),onClick:n[5]||(n[5]=u((...o)=>s.focusInput&&s.focusInput(...o),["stop"]))},[(f(!0),b(C,null,z(s.selectedValues,(o,y)=>(f(),b("div",{key:`item.id${y}`,class:"tag",title:o.text},[e("span",D,a(o.text),1),l(r,{class:"remove-tag-button",onClick:u(de=>s.removeTag(o.id),["stop"])},{default:m(()=>[l(c,{class:"remove-tag-button-icon"})]),_:2},1032,["onClick"])],8,T))),128)),g(e("input",{ref:"searchInput","onUpdate:modelValue":n[0]||(n[0]=o=>t.searchValue=o),class:"search-input",type:"text",style:E(s.inputWidth),onFocus:n[1]||(n[1]=(...o)=>s.onInputFocus&&s.onInputFocus(...o)),onInput:n[2]||(n[2]=(...o)=>s.onInput&&s.onInput(...o)),onKeydown:[n[3]||(n[3]=x(u((...o)=>s.onDown&&s.onDown(...o),["stop","prevent"]),["down"])),n[4]||(n[4]=x(u((...o)=>s.onInputEscape&&s.onInputEscape(...o),["stop","prevent"]),["esc"]))]},null,36),[[k,t.searchValue]])],2),g(e("div",N,[l(r,{ref:"removeAllTags",class:"remove-all-tags-button",onClick:u(s.removeAllTags,["stop"])},{default:m(()=>[l(c)]),_:1},8,["onClick"])],512),[[A,s.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-element","parent-refocus-element-on-close","close-dropdown-on-selection","is-valid","onFocusOutside","onUpdate:modelValue"])}const L=I(M,[["render",U],["__scopeId","data-v-a297231b"]]),W=`<script>
import Multiselect from './Multiselect.vue';
import FunctionButton from '../FunctionButton.vue';
import CloseIcon from '../../assets/img/icons/close.svg';

export default {
    components: {
        Multiselect,
        FunctionButton,
        CloseIcon
    },
    props: {
        /**
         * List of possible values. Each item must have an \`id\` and a \`text\` property. Some optional properties
         * can be used that are specified in Multiselect.vue.
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(values) {
                if (!Array.isArray(values)) {
                    return false;
                }
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        },
        /**
         * List of initial selected ids.
         */
        initialSelectedIds: {
            type: Array,
            default: () => []
        },
        /**
         * Limit the number of visible options in the dropdown.
         */
        sizeVisibleOptions: {
            type: Number,
            default: 5,
            validator(value) {
                return value >= 0;
            }
        },
        /**
         * Close the dropdown when an entry was selected.
         */
        closeDropdownOnSelection: {
            type: Boolean,
            default: false
        },
        isValid: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:selectedIds'],
    data() {
        return {
            selectedIds: this.initialSelectedIds,
            searchValue: '',
            inputOrOptionsFocussed: false,
            /*
             * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
             * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
             * it needs to be passed to the Multiselect component.
             */
            focusElement: null,
            refocusElement: null
        };
    },
    computed: {
        filteredValues() {
            return this.possibleValues.filter(value => value.text.includes(this.searchValue));
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        inputWidth() {
            return this.inputOrOptionsFocussed && this.filteredValues.length > 0 ? {} : { width: '0%' };
        },
        selectedValues() {
            return this.selectedIds.length === 0
                ? []
                : this.possibleValues.filter(ele => this.selectedIds.includes(ele.id));
        },
        maxSizeVisibleOptions() {
            return this.filteredValues.length < this.sizeVisibleOptions
                ? this.filteredValues.length
                : this.sizeVisibleOptions;
        }
    },
    mounted() {
        this.focusElement = this.$refs.searchInput;
        this.refocusElement = this.$refs.listBox;
    },
    methods: {
        focusInput() {
            this.$refs.searchInput.focus();
        },
        onDown() {
            this.$refs.combobox.onDown();
        },
        onFocusOutside() {
            this.inputOrOptionsFocussed = false;
            this.searchValue = '';
        },
        onInput() {
            this.$refs.combobox.updateFocusOptions();
        },
        onInputFocus() {
            if (!this.inputOrOptionsFocussed) {
                this.$refs.combobox.toggle();
            }
            this.inputOrOptionsFocussed = true;
            this.$refs.combobox.updateFocusOptions();
        },
        onInputEscape() {
            this.$refs.combobox.closeOptions();
        },
        updateSelectedIds(selectedIds) {
            this.selectedIds = selectedIds;
            this.$emit('update:selectedIds', this.selectedIds);
        },
        removeTag(idToRemove) {
            this.updateSelectedIds(this.selectedIds.filter(id => id !== idToRemove));
            this.$refs.combobox.closeOptions();
        },
        removeAllTags() {
            this.updateSelectedIds([]);
            this.$refs.combobox.closeOptions();
        }
    }
};
<\/script>

<template>
  <Multiselect
    ref="combobox"
    :model-value="selectedIds"
    :possible-values="filteredValues"
    use-custom-list-box
    :size-visible-options="maxSizeVisibleOptions"
    :parent-focus-element="focusElement"
    :parent-refocus-element-on-close="refocusElement"
    :close-dropdown-on-selection="closeDropdownOnSelection"
    :is-valid="isValid"
    @focus-outside="onFocusOutside"
    @update:model-value="updateSelectedIds"
  >
    <template #listBox>
      <div
        ref="listBox"
        class="summary-input-icon-wrapper"
        tabindex="0"
        @keydown.enter.prevent.self="focusInput"
      >
        <div
          :class="['summary-input-wrapper', {'with-icon-right': hasSelection}]"
          @click.stop="focusInput"
        >
          <div
            v-for="item, index in selectedValues"
            :key="\`item.id\${index}\`"
            class="tag"
            :title="item.text"
          >
            <span class="text">{{ item.text }}</span>
            <FunctionButton
              class="remove-tag-button"
              @click.stop="removeTag(item.id)"
            >
              <CloseIcon class="remove-tag-button-icon" />
            </FunctionButton>
          </div>
          <input
            ref="searchInput"
            v-model="searchValue"
            class="search-input"
            type="text"
            :style="inputWidth"
            @focus="onInputFocus"
            @input="onInput"
            @keydown.down.stop.prevent="onDown"
            @keydown.esc.stop.prevent="onInputEscape"
          >
        </div>
        <div
          v-show="hasSelection"
          class="icon-right"
        >
          <FunctionButton
            ref="removeAllTags"
            class="remove-all-tags-button"
            @click.stop="removeAllTags"
          >
            <CloseIcon />
          </FunctionButton>
        </div>
      </div>
    </template>
  </Multiselect>
</template>

<style lang="postcss" scoped>
.multiselect {
  border: 1px solid var(--knime-dove-gray);

  &:focus-within {
    border-color: var(--knime-masala);
  }

  & .summary-input-icon-wrapper {
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    &:focus {
      outline: none;
    }

    & .summary-input-wrapper {
      max-width: 100%;
      padding: 11px;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding: 11px 0 11px 11px;
      }

      & .search-input {
        all: unset;
        height: 18px;
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1
      }

      & .tag {
        height: 18px;
        max-width: 100%;
        overflow: hidden;
        padding: 2px 2px 2px 5px;
        gap: 2px;
        display: flex;
        align-items: center;
        cursor: default;
        border: 1px solid var(--knime-dove-gray);

        & .text {
          font-weight: 500;
          font-size: 12px;
          color: var(--knime-dove-gray);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 12px;
        }

        & .remove-tag-button {
          padding: 2px;
          
          & :deep(svg) {
            --icon-size: 10;

            width: calc(var(--icon-size) * 1px);
            height: calc(var(--icon-size) * 1px);
            stroke-width: calc(32px / var(--icon-size));
           }
        }
      }
    }

    & .icon-right {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
`,P=`<ComboBox
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
  :possible-values="values"
  :initialSelectedIds="selected"
  :size-visible-options="3"
  close-dropdown-on-selection
  @update:selected-ids="selectedValues => selected = selectedValues"
/>`,j={components:{ComboBox:L,CodeExample:_},data(){return{codeExample:P,selected:[[],[],[]],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return W}}},K=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"ComboBox"),e("p",null,[h(" A combobox component. It emits an "),e("code",null,"update"),h(" event when an option is (de-)selected and has a list of selected "),e("code",null,"values"),h(". ")])])],-1),R={class:"grid-container"},q=e("div",{class:"grid-item-3"}," default ",-1),G={class:"grid-item-6"},H={class:"grid-item-3"},J=e("br",null,null,-1),Q={class:"grid-container"},X=e("div",{class:"grid-item-3"}," max visible options: 3 ",-1),Y={class:"grid-item-6"},Z={class:"grid-item-3"},$=e("br",null,null,-1),ee={class:"grid-container"},ne=e("div",{class:"grid-item-3"}," close dropdown on selection ",-1),se={class:"grid-item-6"},te={class:"grid-item-3"},oe={class:"grid-container"},ie={class:"grid-item-12"};function le(i,n,v,w,t,s){const c=p("ComboBox",!0),r=p("CodeExample");return f(),b("div",null,[e("section",null,[K,e("div",R,[q,e("div",G,[l(c,{"possible-values":t.values,"initial-selected-ids":t.selected[0],"onUpdate:selectedIds":n[0]||(n[0]=d=>t.selected[0]=d)},null,8,["possible-values","initial-selected-ids"])]),e("div",H," values: "+a(t.selected[0]),1)]),J,e("div",Q,[X,e("div",Y,[l(c,{"possible-values":t.values,"initial-selected-ids":t.selected[1],"size-visible-options":3,"onUpdate:selectedIds":n[1]||(n[1]=d=>t.selected[1]=d)},null,8,["possible-values","initial-selected-ids"])]),e("div",Z," values: "+a(t.selected[1]),1)]),$,e("div",ee,[ne,e("div",se,[l(c,{"possible-values":t.values,"initial-selected-ids":t.selected[2],"close-dropdown-on-selection":"","onUpdate:selectedIds":n[2]||(n[2]=d=>t.selected[2]=d)},null,8,["possible-values","initial-selected-ids"])]),e("div",te," values: "+a(t.selected[2]),1)])]),e("section",null,[e("div",oe,[e("div",ie,[l(r,{summary:"Show usage example"},{default:m(()=>[h(a(t.codeExample),1)]),_:1}),l(r,{summary:"Show ComboBox.vue source code"},{default:m(()=>[h(a(s.code),1)]),_:1})])])])])}const me=I(j,[["render",le]]);export{me as default};
