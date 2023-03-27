import{C as V}from"./CodeExample-83ed4e50.js";import{M as F}from"./Multiselect-73e5f89f.js";import{_ as I,s as _,N as B,r as c,o as h,j as S,w as r,b as s,x as v,y as u,n as E,c as x,F as C,g as z,t as m,d as l,O as g,h as O,a3 as k,V as A,e as d}from"./index-ae19d8f6.js";import"./Checkbox-392e2217.js";import"./arrow-dropdown-3a908287.js";const T={components:{Multiselect:F,FunctionButton:_,CloseIcon:B},props:{possibleValues:{type:Array,default:()=>[],validator(i){return Array.isArray(i)?i.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}},initialSelectedIds:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(i){return i>=0}}},emits:["update:selectedIds"],data(){return{selectedIds:this.initialSelectedIds,focusElements:[],searchValue:"",inputFocussed:!1,refocusElement:null}},computed:{filteredValues(){return this.possibleValues.filter(i=>i.id.includes(this.searchValue))},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputFocussed&&this.filteredValues.length>0?{}:{width:"0%"}},selectedValues(){return this.selectedIds.length===0?[]:this.possibleValues.filter(i=>this.selectedIds.includes(i.id))},maxSizeVisibleOptions(){return this.filteredValues.length<this.sizeVisibleOptions?this.filteredValues.length:this.sizeVisibleOptions}},watch:{hasSelection(){this.setFocusElements()}},mounted(){this.setFocusElements(),this.refocusElement=this.$refs.listBox},methods:{focusInput(){this.$refs.searchInput.focus()},onInputFocus(){this.inputFocussed||this.$refs.multiselect.toggle(),this.inputFocussed=!0,this.$refs.multiselect.updateFocusOptions()},onFocusOutside(){this.inputFocussed=!1,this.searchValue=""},setFocusElements(){this.focusElements=this.hasSelection?[this.$refs.searchInput,this.$refs.removeAllTags.$el&&this.$refs.removeAllTags.$el.nextElementSibling]:[this.$refs.searchInput]},updateSelectedIds(i){this.selectedIds=i,this.$emit("update:selectedIds",this.selectedIds)},onDown(){this.$refs.multiselect.onDown()},removeTag(i){this.updateSelectedIds(this.selectedIds.filter(t=>t!==i))},removeAllTags(){this.updateSelectedIds([]),this.focusInput()},onInput(){this.$refs.multiselect.updateFocusOptions()},onInputEscape(){this.$refs.listBox.focus()}}},M=["title"],$={class:"text"},D={class:"icon-right"};function N(i,t,b,w,o,e){const p=c("CloseIcon"),a=c("FunctionButton"),f=c("Multiselect");return h(),S(f,{ref:"multiselect","model-value":o.selectedIds,"possible-values":e.filteredValues,"use-custom-list-box":"","size-visible-options":e.maxSizeVisibleOptions,"parent-focus-elements":o.focusElements,"parent-refocus-element-on-close":o.refocusElement,onFocusOutside:e.onFocusOutside,"onUpdate:modelValue":e.updateSelectedIds},{listBox:r(()=>[s("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:t[6]||(t[6]=v(u((...n)=>e.focusInput&&e.focusInput(...n),["prevent","self"]),["enter"]))},[s("div",{class:E(["summary-input-wrapper",{"with-icon-right":e.hasSelection}]),onClick:t[5]||(t[5]=u((...n)=>e.focusInput&&e.focusInput(...n),["stop"]))},[(h(!0),x(C,null,z(e.selectedValues,(n,y)=>(h(),x("div",{key:`item.id${y}`,class:"tag",title:n.text},[s("span",$,m(n.text),1),l(a,{class:"remove-tag-button",onClick:u(Q=>e.removeTag(n.id),["stop"])},{default:r(()=>[l(p,{class:"remove-tag-button-icon"})]),_:2},1032,["onClick"])],8,M))),128)),g(s("input",{ref:"searchInput","onUpdate:modelValue":t[0]||(t[0]=n=>o.searchValue=n),class:"search-input",type:"text",style:O(e.inputWidth),onFocus:t[1]||(t[1]=(...n)=>e.onInputFocus&&e.onInputFocus(...n)),onInput:t[2]||(t[2]=(...n)=>e.onInput&&e.onInput(...n)),onKeydown:[t[3]||(t[3]=v(u((...n)=>e.onDown&&e.onDown(...n),["stop","prevent"]),["down"])),t[4]||(t[4]=v(u((...n)=>e.onInputEscape&&e.onInputEscape(...n),["stop","prevent"]),["esc"]))]},null,36),[[k,o.searchValue]])],2),g(s("div",D,[l(a,{ref:"removeAllTags",class:"remove-all-tags-button",onClick:u(e.removeAllTags,["stop"])},{default:r(()=>[l(p)]),_:1},8,["onClick"])],512),[[A,e.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-elements","parent-refocus-element-on-close","onFocusOutside","onUpdate:modelValue"])}const L=I(T,[["render",N],["__scopeId","data-v-fa1a7781"]]),W=`<script>
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
        }
    },
    emits: ['update:selectedIds'],
    data() {
        return {
            selectedIds: this.initialSelectedIds,
            /*
             * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
             * When the input/removeAllTags-Button of this component is focussed then they shouldn't be closed either,
             * which is why they need to be passed to the Multiselect component.
             */
            focusElements: [],
            searchValue: '',
            inputFocussed: false,
            refocusElement: null
        };
    },
    computed: {
        filteredValues() {
            return this.possibleValues.filter(value => value.id.includes(this.searchValue));
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        inputWidth() {
            return this.inputFocussed && this.filteredValues.length > 0 ? {} : { width: '0%' };
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
    watch: {
        hasSelection() {
            this.setFocusElements();
        }
    },
    mounted() {
        this.setFocusElements();
        this.refocusElement = this.$refs.listBox;
    },
    methods: {
        focusInput() {
            this.$refs.searchInput.focus();
        },
        onInputFocus() {
            if (!this.inputFocussed) {
                this.$refs.multiselect.toggle();
            }
            this.inputFocussed = true;
            this.$refs.multiselect.updateFocusOptions();
        },
        onFocusOutside() {
            this.inputFocussed = false;
            this.searchValue = '';
        },
        setFocusElements() {
            this.focusElements = this.hasSelection
                ? [this.$refs.searchInput,
                    this.$refs.removeAllTags.$el && this.$refs.removeAllTags.$el.nextElementSibling]
                : [this.$refs.searchInput];
        },
        updateSelectedIds(selectedIds) {
            this.selectedIds = selectedIds;
            this.$emit('update:selectedIds', this.selectedIds);
        },
        onDown() {
            this.$refs.multiselect.onDown();
        },
        removeTag(idToRemove) {
            this.updateSelectedIds(this.selectedIds.filter(id => id !== idToRemove));
        },
        removeAllTags() {
            this.updateSelectedIds([]);
            this.focusInput();
        },
        onInput() {
            this.$refs.multiselect.updateFocusOptions();
        },
        onInputEscape() {
            this.$refs.listBox.focus();
        }
    }
};
<\/script>

<template>
  <Multiselect
    ref="multiselect"
    :model-value="selectedIds"
    :possible-values="filteredValues"
    use-custom-list-box
    :size-visible-options="maxSizeVisibleOptions"
    :parent-focus-elements="focusElements"
    :parent-refocus-element-on-close="refocusElement"
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
  @update:selected-ids="selectedValues => selected = selectedValues"
/>`,U={components:{ComboBox:L,CodeExample:V},data(){return{codeExample:P,selected:[],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return W}}},j=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("h2",null,"ComboBox"),s("p",null,[d(" A combobox component. It emits an "),s("code",null,"update"),d(" event when an option is (de-)selected and has a list of selected "),s("code",null,"values"),d(". ")])])],-1),K={class:"grid-container"},R={class:"grid-item-6"},q={class:"grid-item-6"},G={class:"grid-container"},H={class:"grid-item-12"};function J(i,t,b,w,o,e){const p=c("ComboBox",!0),a=c("CodeExample");return h(),x("div",null,[s("section",null,[j,s("div",K,[s("div",R,[l(p,{"possible-values":o.values,"initial-selected-ids":o.selected,"size-visible-options":3,"onUpdate:selectedIds":t[0]||(t[0]=f=>o.selected=f)},null,8,["possible-values","initial-selected-ids"])]),s("div",q," values: "+m(o.selected),1)])]),s("section",null,[s("div",G,[s("div",H,[l(a,{summary:"Show usage example"},{default:r(()=>[d(m(o.codeExample),1)]),_:1}),l(a,{summary:"Show ComboBox.vue source code"},{default:r(()=>[d(m(e.code),1)]),_:1})])])])])}const se=I(U,[["render",J]]);export{se as default};
