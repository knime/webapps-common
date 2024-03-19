import{C as v}from"./CodeExample-i56rDI5D.js";import{B as x}from"./Button-q9YAHW1Q.js";import{_,L as F,A as I,r as c,o as S,c as y,b as e,d as o,w as f,e as a,t as d,p as b,f as w}from"./index-o67LSUhU.js";import{D as B}from"./Dropdown-KM6aERGB.js";import"./arrow-dropdown-LYxf0D-Y.js";const T={components:{Button:x,LensIcon:F},props:{modelValue:{type:Array,default:null},label:{type:String,default:""},acceptedFileTypes:{type:String,default:"*"},multiple:{type:Boolean,default:!1}},emits:["update:modelValue"],computed:{displayedFilename(){var t,l;return((l=(t=this.modelValue)==null?void 0:t.map)==null?void 0:l.call(t,({name:i})=>i).join(", "))||"No file selected"},fileSelectorId(){return`file-selector-${I().uid}`},selectFileText(){return`Select file${this.multiple?"s":""}`}},methods:{openFileSelector(){this.$refs.fileSelector.click()},onSelect(t){this.$emit("update:modelValue",Array.from(t.target.files))}}},V={class:"wrapper"},C=["for"],$={class:"filename"},k=["id","aria-label","accept","multiple"];function A(t,l,i,h,s,n){const r=c("LensIcon"),m=c("Button");return S(),y("div",V,[e("label",{for:n.fileSelectorId},[o(m,{compact:!0,"with-border":!0,onClick:n.openFileSelector},{default:f(()=>[o(r),a(d(n.selectFileText),1)]),_:1},8,["onClick"]),e("span",$,d(n.displayedFilename),1)],8,C),e("input",{id:n.fileSelectorId,ref:"fileSelector","aria-label":i.label,type:"file",accept:i.acceptedFileTypes,multiple:i.multiple,hidden:"",onInput:l[0]||(l[0]=p=>n.onSelect(p))},null,40,k)])}const E=_(T,[["render",A],["__scopeId","data-v-381fc03a"]]),L=`<script>
import { getCurrentInstance } from "vue";
import Button from "./Button.vue";
import LensIcon from "../assets/img/icons/lens.svg";

export default {
  components: {
    Button,
    LensIcon,
  },
  props: {
    modelValue: {
      type: Array,
      default: null,
    },
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
  emits: ["update:modelValue"],
  computed: {
    displayedFilename() {
      return (
        this.modelValue?.map?.(({ name }) => name).join(", ") ||
        "No file selected"
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
      this.$emit("update:modelValue", Array.from(event.target.files));
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
/>`,N={components:{FileSelector:E,CodeExample:v,Dropdown:B},data(){return{codeExample:D,fileSelectorCode:L,acceptedFileTypes:"*"}}},u=t=>(b("data-v-220ac518"),t=t(),w(),t),j={class:"grid-container"},z={class:"grid-item-12"},U=u(()=>e("p",null,[a(" The file selector allows the user to choose a file or multiple files from the file system. Accepted file types can be set via the "),e("code",null,'"accepted-file-types"'),a(" property. ")],-1)),q={class:"grid-container selector-container"},G={class:"grid-item-6"},H=u(()=>e("p",null,"Select a single file",-1)),J={class:"grid-item-3"},K=u(()=>e("p",null,"Example of accepted file types",-1)),M={class:"selector-container"},O=u(()=>e("p",null,"Select multiple files",-1));function P(t,l,i,h,s,n){const r=c("FileSelector",!0),m=c("Dropdown"),p=c("CodeExample");return S(),y("section",null,[e("div",j,[e("div",z,[U,e("div",q,[e("div",G,[H,o(r,{"accepted-file-types":s.acceptedFileTypes,label:"Select a file",multiple:!1},null,8,["accepted-file-types"])]),e("div",J,[K,o(m,{modelValue:s.acceptedFileTypes,"onUpdate:modelValue":l[0]||(l[0]=g=>s.acceptedFileTypes=g),"aria-label":"Accepted file types","possible-values":[{id:"*",text:"*"},{id:"text/plain",text:"text/plain"},{id:"image/png",text:"image/png"},{id:"video/*",text:"video/*"},{id:".pdf",text:".pdf"}]},null,8,["modelValue","possible-values"])])]),e("div",M,[O,o(r,{"accepted-file-types":"*",label:"Select files",multiple:!0})]),o(p,{summary:"Show usage example"},{default:f(()=>[a(d(s.codeExample),1)]),_:1}),o(p,{summary:"Show FileSelector.vue source code"},{default:f(()=>[a(d(s.fileSelectorCode),1)]),_:1})])])])}const Z=_(N,[["render",P],["__scopeId","data-v-220ac518"]]);export{Z as default};
