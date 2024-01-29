import{C as G}from"./CodeExample-648DlWHW.js";import{at as B,au as K,av as O,q as Y,s as J,P as Q,_ as F,r as g,o as w,j as X,w as v,b as i,x as b,y as m,n as ee,c as C,F as ne,g as se,t as h,d as c,Q as V,h as te,aw as ie,X as oe,e as I}from"./index-cYucmYcT.js";import{M as le}from"./Multiselect-reEtV72m.js";import"./Checkbox-8p3hkvH3.js";import"./arrow-dropdown-h2btSJCt.js";function ue(){}function re(e,n,t,u){for(var s=e.length,r=t+(u?1:-1);u?r--:++r<s;)if(n(e[r],r,e))return r;return-1}function ae(e){return e!==e}function de(e,n,t){for(var u=t-1,s=e.length;++u<s;)if(e[u]===n)return u;return-1}function ce(e,n,t){return n===n?de(e,n,t):re(e,ae,t)}function pe(e,n){var t=e==null?0:e.length;return!!t&&ce(e,n,0)>-1}function he(e,n,t,u){var s=-1,r=e==null?0:e.length;for(u&&r&&(t=e[++s]);++s<r;)t=n(t,e[s],s,e);return t}function fe(e){return function(n){return e==null?void 0:e[n]}}var me={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},xe=fe(me);const be=xe;var ge=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,ve="\\u0300-\\u036f",Ie="\\ufe20-\\ufe2f",we="\\u20d0-\\u20ff",ye=ve+Ie+we,Oe="["+ye+"]",Se=RegExp(Oe,"g");function Ce(e){return e=B(e),e&&e.replace(ge,be).replace(Se,"")}var Ee=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;function Ve(e){return e.match(Ee)||[]}var Ae=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;function Re(e){return Ae.test(e)}var k="\\ud800-\\udfff",_e="\\u0300-\\u036f",Me="\\ufe20-\\ufe2f",Be="\\u20d0-\\u20ff",Fe=_e+Me+Be,z="\\u2700-\\u27bf",D="a-z\\xdf-\\xf6\\xf8-\\xff",ke="\\xac\\xb1\\xd7\\xf7",ze="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",De="\\u2000-\\u206f",Te=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",T="A-Z\\xc0-\\xd6\\xd8-\\xde",Le="\\ufe0e\\ufe0f",L=ke+ze+De+Te,$="['’]",A="["+L+"]",$e="["+Fe+"]",N="\\d+",Ne="["+z+"]",U="["+D+"]",P="[^"+k+L+N+z+D+T+"]",Ue="\\ud83c[\\udffb-\\udfff]",Pe="(?:"+$e+"|"+Ue+")",je="[^"+k+"]",j="(?:\\ud83c[\\udde6-\\uddff]){2}",W="[\\ud800-\\udbff][\\udc00-\\udfff]",x="["+T+"]",We="\\u200d",R="(?:"+U+"|"+P+")",qe="(?:"+x+"|"+P+")",_="(?:"+$+"(?:d|ll|m|re|s|t|ve))?",M="(?:"+$+"(?:D|LL|M|RE|S|T|VE))?",q=Pe+"?",H="["+Le+"]?",He="(?:"+We+"(?:"+[je,j,W].join("|")+")"+H+q+")*",Ze="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Ge="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Ke=H+q+He,Ye="(?:"+[Ne,j,W].join("|")+")"+Ke,Je=RegExp([x+"?"+U+"+"+_+"(?="+[A,x,"$"].join("|")+")",qe+"+"+M+"(?="+[A,x+R,"$"].join("|")+")",x+"?"+R+"+"+_,x+"+"+M,Ge,Ze,N,Ye].join("|"),"g");function Qe(e){return e.match(Je)||[]}function Xe(e,n,t){return e=B(e),n=t?void 0:n,n===void 0?Re(e)?Qe(e):Ve(e):e.match(n)||[]}var en="['’]",nn=RegExp(en,"g");function sn(e){return function(n){return he(Xe(Ce(n).replace(nn,"")),e,"")}}var tn="__lodash_hash_undefined__";function on(e){return this.__data__.set(e,tn),this}function ln(e){return this.__data__.has(e)}function y(e){var n=-1,t=e==null?0:e.length;for(this.__data__=new K;++n<t;)this.add(e[n])}y.prototype.add=y.prototype.push=on;y.prototype.has=ln;function un(e,n){return e.has(n)}function Z(e){var n=-1,t=Array(e.size);return e.forEach(function(u){t[++n]=u}),t}function rn(e,n,t){for(var u=-1,s=e==null?0:e.length;++u<s;)if(t(n,e[u]))return!0;return!1}var an=sn(function(e,n,t){return e+(t?"-":"")+n.toLowerCase()});const dn=an;var cn=1/0,pn=O&&1/Z(new O([,-0]))[1]==cn?function(e){return new O(e)}:ue,hn=200;function fn(e,n,t){var u=-1,s=pe,r=e.length,d=!0,a=[],o=a;if(t)d=!1,s=rn;else if(r>=hn){var l=n?null:pn(e);if(l)return Z(l);d=!1,s=un,o=new y}else o=n?[]:a;e:for(;++u<r;){var p=e[u],f=n?n(p):p;if(p=t||p!==0?p:0,d&&f===f){for(var E=o.length;E--;)if(o[E]===f)continue e;n&&o.push(f),a.push(p)}else s(o,f,t)||(o!==a&&o.push(f),a.push(p))}return a}function mn(e){return e&&e.length?fn(e):[]}const S="draft-id-combobox-preview-item",xn=Y({components:{Multiselect:le,FunctionButton:J,CloseIcon:Q},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}},initialSelectedIds:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(e){return e>=0}},closeDropdownOnSelection:{type:Boolean,default:!1},isValid:{type:Boolean,default:!0},allowNewValues:{type:Boolean,default:!1}},emits:{"update:selectedIds":e=>!0,change:e=>!0},data(){return{selectedIds:this.initialSelectedIds,searchValue:"",inputOrOptionsFocussed:!1,focusElement:null,refocusElement:null,allPossibleItems:this.possibleValues}},computed:{isSearchEmpty(){return!this.searchValue.trim()},searchResults(){const e=this.allPossibleItems.some(({text:t})=>t.toLowerCase()===this.searchValue.toLowerCase()),n=this.allPossibleItems.filter(({text:t})=>t.toLowerCase().includes(this.searchValue.toLowerCase()));return this.allowNewValues&&!e&&!this.isSearchEmpty?[{id:S,text:`${this.searchValue} (new item)`},...n]:n},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputOrOptionsFocussed&&this.searchResults.length>0?{}:{width:"0%"}},selectedValues(){return this.selectedIds.length===0?[]:this.selectedIds.map(e=>this.allPossibleItems.find(t=>t.id===e)||{id:e,text:e})},maxSizeVisibleOptions(){return this.searchResults.length<this.sizeVisibleOptions?this.searchResults.length:this.sizeVisibleOptions}},watch:{initialSelectedIds(e,n){e.length===(n==null?void 0:n.length)&&e.slice().sort().join(".")===n.slice().sort().join(".")||this.changeSelectedIds(e)}},mounted(){this.focusElement=this.$refs.searchInput,this.refocusElement=this.$refs.listBox},methods:{changeSelectedIds(e){this.selectedIds=e,this.$emit("update:selectedIds",this.selectedIds),this.$emit("change",this.selectedValues)},focusInput(){this.$refs.searchInput.focus()},onDown(){this.$refs.combobox.onDown()},onEnter(){var e;this.isSearchEmpty||(this.updateSelectedIds([...this.selectedIds,(e=this.searchResults[0])==null?void 0:e.id]),this.searchValue="")},onBackspace(){this.searchValue||this.changeSelectedIds(this.selectedIds.slice(0,-1))},onFocusOutside(){this.inputOrOptionsFocussed=!1,this.searchValue=""},onInput(){this.$refs.combobox.updateFocusOptions()},onInputFocus(){this.inputOrOptionsFocussed||this.$refs.combobox.toggle(),this.inputOrOptionsFocussed=!0,this.$refs.combobox.updateFocusOptions()},updateSelectedIds(e){const n=r=>{this.changeSelectedIds(mn(r).filter(Boolean))};if(!e.includes(S)){n(e);return}const u={id:dn(this.searchValue),text:this.searchValue.trim()};this.allPossibleItems.some(r=>r.id===u.id)||(this.allPossibleItems.push(u),n(e.map(r=>r===S?u.id:r)))},removeTag(e){this.updateSelectedIds(this.selectedIds.filter(n=>n!==e)),this.closeOptions()},removeAllTags(){this.updateSelectedIds([]),this.closeOptions()},closeOptionsAndStop(e){this.$refs.combobox.closeOptionsAndStop(e)},closeOptions(){this.$refs.combobox.closeOptions()}}}),bn=["title"],gn={class:"text"},vn={class:"icon-right"};function In(e,n,t,u,s,r){const d=g("CloseIcon"),a=g("FunctionButton"),o=g("Multiselect");return w(),X(o,{ref:"combobox","model-value":e.selectedIds,"possible-values":e.searchResults,"use-custom-list-box":"","size-visible-options":e.maxSizeVisibleOptions,"parent-focus-element":e.focusElement,"parent-refocus-element-on-close":e.refocusElement,"close-dropdown-on-selection":e.closeDropdownOnSelection,"is-valid":e.isValid,onFocusOutside:e.onFocusOutside,"onUpdate:modelValue":e.updateSelectedIds},{listBox:v(()=>[i("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:n[8]||(n[8]=b(m((...l)=>e.focusInput&&e.focusInput(...l),["prevent","self"]),["enter"]))},[i("div",{class:ee(["summary-input-wrapper",{"with-icon-right":e.hasSelection}]),onClick:n[7]||(n[7]=m((...l)=>e.focusInput&&e.focusInput(...l),["stop"]))},[(w(!0),C(ne,null,se(e.selectedValues,(l,p)=>(w(),C("div",{key:`item.id${p}`,class:"tag",title:l.text},[i("span",gn,h(l.text),1),c(a,{class:"remove-tag-button",onClick:m(f=>e.removeTag(l.id),["stop"])},{default:v(()=>[c(d,{class:"remove-tag-button-icon"})]),_:2},1032,["onClick"])],8,bn))),128)),V(i("input",{ref:"searchInput","onUpdate:modelValue":n[0]||(n[0]=l=>e.searchValue=l),class:"search-input",type:"text",style:te(e.inputWidth),onFocus:n[1]||(n[1]=(...l)=>e.onInputFocus&&e.onInputFocus(...l)),onInput:n[2]||(n[2]=(...l)=>e.onInput&&e.onInput(...l)),onKeydown:[n[3]||(n[3]=b(m((...l)=>e.onEnter&&e.onEnter(...l),["prevent"]),["enter"])),n[4]||(n[4]=b((...l)=>e.onBackspace&&e.onBackspace(...l),["backspace"])),n[5]||(n[5]=b(m((...l)=>e.onDown&&e.onDown(...l),["stop","prevent"]),["down"])),n[6]||(n[6]=b((...l)=>e.closeOptionsAndStop&&e.closeOptionsAndStop(...l),["esc"]))]},null,36),[[ie,e.searchValue]])],2),V(i("div",vn,[c(a,{ref:"removeAllTags",class:"remove-all-tags-button",onClick:m(e.removeAllTags,["stop"])},{default:v(()=>[c(d)]),_:1},8,["onClick"])],512),[[oe,e.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-element","parent-refocus-element-on-close","close-dropdown-on-selection","is-valid","onFocusOutside","onUpdate:modelValue"])}const wn=F(xn,[["render",In],["__scopeId","data-v-d9a1e8f2"]]),yn=`<script lang="ts">
import "./variables.css";
import { defineComponent, type PropType } from "vue";
import { kebabCase, uniq } from "lodash-es";

import Multiselect from "./Multiselect.vue";
import FunctionButton from "../FunctionButton.vue";
import CloseIcon from "../../assets/img/icons/close.svg";

const DRAFT_ITEM_ID = "draft-id-combobox-preview-item";

interface ComboBoxItem {
  id: string;
  text: string;
}

interface ComponentData {
  selectedIds: Array<string>;
  searchValue: string;
  inputOrOptionsFocussed: boolean;
  /*
   * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
   * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
   * it needs to be passed to the Multiselect component.
   */
  focusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  refocusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  allPossibleItems: Array<ComboBoxItem>;
}

type MultiselectRef = InstanceType<typeof Multiselect>;

export default defineComponent({
  components: {
    Multiselect,
    FunctionButton,
    CloseIcon,
  },
  props: {
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property. Some optional properties
     * can be used that are specified in Multiselect.vue.
     */
    possibleValues: {
      type: Array as PropType<Array<ComboBoxItem>>,
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
    /**
     * List of initial selected ids.
     */
    initialSelectedIds: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    /**
     * Limit the number of visible options in the dropdown.
     */
    sizeVisibleOptions: {
      type: Number,
      default: 5,
      validator(value: number) {
        return value >= 0;
      },
    },
    /**
     * Close the dropdown when an entry was selected.
     */
    closeDropdownOnSelection: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    /**
     * Allow adding and selecting new tags, not just possible values
     */
    allowNewValues: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "update:selectedIds": (_payload: Array<string>) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_payload: Array<ComboBoxItem>) => true,
  },

  data(): ComponentData {
    return {
      selectedIds: this.initialSelectedIds,
      searchValue: "",
      inputOrOptionsFocussed: false,
      /*
       * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
       * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
       * it needs to be passed to the Multiselect component.
       */
      focusElement: null,
      refocusElement: null,
      allPossibleItems: this.possibleValues,
    };
  },

  computed: {
    isSearchEmpty() {
      return !this.searchValue.trim();
    },

    searchResults() {
      const hasExactSearchMatch = this.allPossibleItems.some(
        ({ text }) => text.toLowerCase() === this.searchValue.toLowerCase(),
      );

      const fuzzyMatchedItems = this.allPossibleItems.filter(({ text }) =>
        text.toLowerCase().includes(this.searchValue.toLowerCase()),
      );

      if (this.allowNewValues && !hasExactSearchMatch && !this.isSearchEmpty) {
        // add a preview for a non existing items
        return [
          { id: DRAFT_ITEM_ID, text: \`\${this.searchValue} (new item)\` },
          ...fuzzyMatchedItems,
        ];
      }

      return fuzzyMatchedItems;
    },

    hasSelection() {
      return this.selectedValues.length > 0;
    },

    inputWidth() {
      return this.inputOrOptionsFocussed && this.searchResults.length > 0
        ? {}
        : { width: "0%" };
    },

    selectedValues() {
      return this.selectedIds.length === 0
        ? []
        : this.selectedIds.map((id) => {
            const item = this.allPossibleItems.find((item) => item.id === id);
            return item || { id, text: id };
          });
    },

    maxSizeVisibleOptions() {
      return this.searchResults.length < this.sizeVisibleOptions
        ? this.searchResults.length
        : this.sizeVisibleOptions;
    },
  },
  watch: {
    initialSelectedIds(newValue: string[], prevValue: string[]) {
      const lengthIsEqual = newValue.length === prevValue?.length;

      const isEqual =
        lengthIsEqual &&
        newValue.slice().sort().join(".") ===
          prevValue.slice().sort().join(".");

      if (isEqual) {
        return;
      }

      this.changeSelectedIds(newValue);
    },
  },
  mounted() {
    this.focusElement = this.$refs.searchInput as HTMLInputElement;
    this.refocusElement = this.$refs.listBox as HTMLDivElement;
  },

  methods: {
    changeSelectedIds(newSelected: string[]) {
      this.selectedIds = newSelected;
      this.$emit("update:selectedIds", this.selectedIds);
      this.$emit("change", this.selectedValues);
    },
    focusInput() {
      (this.$refs.searchInput as HTMLInputElement).focus();
    },
    onDown() {
      (this.$refs.combobox as MultiselectRef).onDown();
    },
    onEnter() {
      if (this.isSearchEmpty) {
        return;
      }

      this.updateSelectedIds([...this.selectedIds, this.searchResults[0]?.id]);
      this.searchValue = "";
    },
    onBackspace() {
      if (!this.searchValue) {
        this.changeSelectedIds(this.selectedIds.slice(0, -1));
      }
      // else regular backspace behavior
    },
    onFocusOutside() {
      this.inputOrOptionsFocussed = false;
      this.searchValue = "";
    },
    onInput() {
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },
    onInputFocus() {
      if (!this.inputOrOptionsFocussed) {
        (this.$refs.combobox as MultiselectRef).toggle();
      }

      this.inputOrOptionsFocussed = true;
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },

    updateSelectedIds(selectedIds: Array<string>) {
      const setSelectedIds = (value: Array<string>) => {
        this.changeSelectedIds(uniq(value).filter(Boolean));
      };

      const hasNewItem = selectedIds.includes(DRAFT_ITEM_ID);

      if (!hasNewItem) {
        setSelectedIds(selectedIds);
        return;
      }

      const newItem: ComboBoxItem = {
        id: kebabCase(this.searchValue),
        text: this.searchValue.trim(),
      };

      const isDuplicateItem = this.allPossibleItems.some(
        (item) => item.id === newItem.id,
      );

      if (isDuplicateItem) {
        return;
      }

      this.allPossibleItems.push(newItem);

      setSelectedIds(
        selectedIds.map((id) => (id === DRAFT_ITEM_ID ? newItem.id : id)),
      );
    },

    removeTag(idToRemove: string) {
      this.updateSelectedIds(
        this.selectedIds.filter((id) => id !== idToRemove),
      );
      this.closeOptions();
    },

    removeAllTags() {
      this.updateSelectedIds([]);
      this.closeOptions();
    },
    closeOptionsAndStop(event: KeyboardEvent) {
      (this.$refs.combobox as MultiselectRef).closeOptionsAndStop(event);
    },
    closeOptions() {
      (this.$refs.combobox as MultiselectRef).closeOptions();
    },
  },
});
<\/script>

<template>
  <Multiselect
    ref="combobox"
    :model-value="selectedIds"
    :possible-values="searchResults"
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
          :class="[
            'summary-input-wrapper',
            { 'with-icon-right': hasSelection },
          ]"
          @click.stop="focusInput"
        >
          <div
            v-for="(item, index) in selectedValues"
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
            @keydown.enter.prevent="onEnter"
            @keydown.backspace="onBackspace"
            @keydown.down.stop.prevent="onDown"
            @keydown.esc="closeOptionsAndStop"
          />
        </div>
        <div v-show="hasSelection" class="icon-right">
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
  & .summary-input-icon-wrapper {
    border: var(--form-border-width) solid var(--knime-stone-gray);
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    &:focus-within {
      border-color: var(--knime-masala);
    }

    &:focus {
      outline: none;
    }

    & .summary-input-wrapper {
      max-width: 100%;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      /** The height of the input field and tags inside the summary */
      --inner-height: 18px;

      padding: calc(
        (
            var(--single-line-form-height) - 2 * var(--form-border-width) -
              var(--inner-height)
          ) / 2
      );

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding-right: 0;
      }

      & .search-input {
        all: unset;
        height: var(--inner-height);
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1;
      }

      & .tag {
        height: var(--inner-height);
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
`,On=`<ComboBox
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
/>`,Sn={components:{ComboBox:wn,CodeExample:G},data(){return{codeExample:On,selected:[[],[],[]],selectedValues:[],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return yn}}},Cn=i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null,[I(" A combobox component. It emits an "),i("code",null,"update"),I(" event when an option is (de-)selected and has a list of selected "),i("code",null,"values"),I(". ")])])],-1),En={class:"grid-container"},Vn=i("div",{class:"grid-item-3"},"default",-1),An={class:"grid-item-6"},Rn={class:"grid-item-3"},_n=i("br",null,null,-1),Mn={class:"grid-container"},Bn=i("div",{class:"grid-item-3"},"max visible options: 3",-1),Fn={class:"grid-item-6"},kn={class:"grid-item-3"},zn=i("br",null,null,-1),Dn={class:"grid-container"},Tn=i("div",{class:"grid-item-3"},"allow new values",-1),Ln={class:"grid-item-6"},$n={class:"grid-item-3"},Nn=i("br",null,null,-1),Un={class:"grid-container"},Pn=i("div",{class:"grid-item-3"},"close dropdown on selection",-1),jn={class:"grid-item-6"},Wn={class:"grid-item-3"},qn={class:"grid-container"},Hn={class:"grid-item-12"},Zn={class:"grid-container"},Gn={class:"grid-item-12"};function Kn(e,n,t,u,s,r){const d=g("ComboBox",!0),a=g("CodeExample");return w(),C("div",null,[i("section",null,[Cn,i("div",En,[Vn,i("div",An,[c(d,{"possible-values":s.values,"initial-selected-ids":s.selected[0],"onUpdate:selectedIds":n[0]||(n[0]=o=>s.selected[0]=o),onChange:n[1]||(n[1]=o=>s.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),i("div",Rn,"selected-ids: "+h(s.selected[0]),1)]),_n,i("div",Mn,[Bn,i("div",Fn,[c(d,{"possible-values":s.values,"initial-selected-ids":s.selected[1],"size-visible-options":3,"onUpdate:selectedIds":n[2]||(n[2]=o=>s.selected[1]=o),onChange:n[3]||(n[3]=o=>s.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),i("div",kn,"selected-ids: "+h(s.selected[1]),1)]),zn,i("div",Dn,[Tn,i("div",Ln,[c(d,{"possible-values":s.values,"initial-selected-ids":s.selected[0],"allow-new-values":"","onUpdate:selectedIds":n[4]||(n[4]=o=>s.selected[0]=o),onChange:n[5]||(n[5]=o=>s.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),i("div",$n,"selected-ids: "+h(s.selected[0]),1)]),Nn,i("div",Un,[Pn,i("div",jn,[c(d,{"possible-values":s.values,"initial-selected-ids":s.selected[2],"close-dropdown-on-selection":"","onUpdate:selectedIds":n[6]||(n[6]=o=>s.selected[2]=o),onChange:n[7]||(n[7]=o=>s.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),i("div",Wn,"selected-ids: "+h(s.selected[2]),1)]),i("div",qn,[i("div",Hn,"Selected Values: "+h(s.selectedValues),1)])]),i("section",null,[i("div",Zn,[i("div",Gn,[c(a,{summary:"Show usage example"},{default:v(()=>[I(h(s.codeExample),1)]),_:1}),c(a,{summary:"Show ComboBox.vue source code"},{default:v(()=>[I(h(r.code),1)]),_:1})])])])])}const ns=F(Sn,[["render",Kn]]);export{ns as default};
