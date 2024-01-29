import{C as v}from"./CodeExample-648DlWHW.js";import{B as x}from"./Button-o3VSg2AN.js";import{_,L as F,A as b,r as c,o as S,c as h,b as e,d as i,w as m,e as a,t as d,p as I,f as w}from"./index-cYucmYcT.js";import{D as B}from"./Dropdown-COIThf2A.js";import"./arrow-dropdown-h2btSJCt.js";const T={components:{Button:x,LensIcon:F},props:{label:{type:String,default:""},acceptedFileTypes:{type:String,default:"*"},multiple:{type:Boolean,default:!1}},emits:["input"],data(){return{files:null}},computed:{displayedFilename(){var t,l;return((l=(t=this.files)==null?void 0:t.map)==null?void 0:l.call(t,({name:o})=>o).join(", "))??"No file selected"},fileSelectorId(){return`file-selector-${b().uid}`},selectFileText(){return`Select file${this.multiple?"s":""}`}},methods:{openFileSelector(){this.$refs.fileSelector.click()},onSelect(t){this.files=Array.from(t.target.files),this.$emit("input",this.files)}}},C={class:"wrapper"},$=["for"],k={class:"filename"},E=["id","aria-label","accept","multiple"];function L(t,l,o,y,s,n){const r=c("LensIcon"),f=c("Button");return S(),h("div",C,[e("label",{for:n.fileSelectorId},[i(f,{compact:!0,"with-border":!0,onClick:n.openFileSelector},{default:m(()=>[i(r),a(d(n.selectFileText),1)]),_:1},8,["onClick"]),e("span",k,d(n.displayedFilename),1)],8,$),e("input",{id:n.fileSelectorId,ref:"fileSelector","aria-label":o.label,type:"file",accept:o.acceptedFileTypes,multiple:o.multiple,hidden:"",onInput:l[0]||(l[0]=p=>n.onSelect(p))},null,40,E)])}const V=_(T,[["render",L],["__scopeId","data-v-dabdb623"]]),A=`<script>
import { getCurrentInstance } from "vue";
import Button from "./Button.vue";
import LensIcon from "../assets/img/icons/lens.svg";

export default {
  components: {
    Button,
    LensIcon,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    acceptedFileTypes: {
      type: String,
      default: "*",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  data() {
    return {
      files: null,
    };
  },
  computed: {
    displayedFilename() {
      return (
        this.files?.map?.(({ name }) => name).join(", ") ?? "No file selected"
      );
    },
    fileSelectorId() {
      const uid = getCurrentInstance().uid;
      return \`file-selector-\${uid}\`;
    },
    selectFileText() {
      return \`Select file\${this.multiple ? "s" : ""}\`;
    },
  },
  methods: {
    openFileSelector() {
      this.$refs.fileSelector.click();
    },
    onSelect(event) {
      this.files = Array.from(event.target.files);
      this.$emit("input", this.files);
    },
  },
};
<\/script>

<template>
  <div class="wrapper">
    <label :for="fileSelectorId">
      <Button :compact="true" :with-border="true" @click="openFileSelector">
        <LensIcon />{{ selectFileText }}
      </Button>
      <span class="filename">{{ displayedFilename }}</span>
    </label>
    <input
      :id="fileSelectorId"
      ref="fileSelector"
      :aria-label="label"
      type="file"
      :accept="acceptedFileTypes"
      :multiple="multiple"
      hidden
      @input="(event) => onSelect(event)"
    />
  </div>
</template>

<style lang="postcss" scoped>
.filename {
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  color: var(--knime-dove-gray);
  margin-left: 10px;
}
</style>
`,D=`<FileSelector
  accepted-file-types="*"
  label="Select a file"
  :multiple="true"
/>`,N={components:{FileSelector:V,CodeExample:v,Dropdown:B},data(){return{codeExample:D,fileSelectorCode:A,acceptedFileTypes:"*"}}},u=t=>(I("data-v-220ac518"),t=t(),w(),t),j={class:"grid-container"},z={class:"grid-item-12"},U=u(()=>e("p",null,[a(" The file selector allows the user to choose a file or multiple files from the file system. Accepted file types can be set via the "),e("code",null,'"accepted-file-types"'),a(" property. ")],-1)),q={class:"grid-container selector-container"},G={class:"grid-item-6"},H=u(()=>e("p",null,"Select a single file",-1)),J={class:"grid-item-3"},K=u(()=>e("p",null,"Example of accepted file types",-1)),M={class:"selector-container"},O=u(()=>e("p",null,"Select multiple files",-1));function P(t,l,o,y,s,n){const r=c("FileSelector",!0),f=c("Dropdown"),p=c("CodeExample");return S(),h("section",null,[e("div",j,[e("div",z,[U,e("div",q,[e("div",G,[H,i(r,{"accepted-file-types":s.acceptedFileTypes,label:"Select a file",multiple:!1},null,8,["accepted-file-types"])]),e("div",J,[K,i(f,{modelValue:s.acceptedFileTypes,"onUpdate:modelValue":l[0]||(l[0]=g=>s.acceptedFileTypes=g),"aria-label":"Accepted file types","possible-values":[{id:"*",text:"*"},{id:"text/plain",text:"text/plain"},{id:"image/png",text:"image/png"},{id:"video/*",text:"video/*"},{id:".pdf",text:".pdf"}]},null,8,["modelValue","possible-values"])])]),e("div",M,[O,i(r,{"accepted-file-types":"*",label:"Select files",multiple:!0})]),i(p,{summary:"Show usage example"},{default:m(()=>[a(d(s.codeExample),1)]),_:1}),i(p,{summary:"Show FileSelector.vue source code"},{default:m(()=>[a(d(s.fileSelectorCode),1)]),_:1})])])])}const Z=_(N,[["render",P],["__scopeId","data-v-220ac518"]]);export{Z as default};
