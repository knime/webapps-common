import{C as b}from"./CodeExample-Jm2k0UjL.js";import{_ as g,o as c,c as m,b as e,n as h,l as x,r as V,d,e as a,t as s,w as v,p as y,f as I}from"./index-WBbi1ara.js";const w={props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},k=["id","name","title","value","cols","disabled","rows","placeholder"],S={key:0,class:"invalid-marker"};function C(u,t,l,_,n,p){return c(),m("div",{class:h({disabled:l.disabled})},[e("textarea",{id:l.id,ref:"input",name:l.name,title:l.title,value:l.modelValue,class:h(l.inputClasses),cols:l.cols,disabled:l.disabled,rows:l.rows,placeholder:l.placeholder,onInput:t[0]||(t[0]=(...i)=>p.onInput&&p.onInput(...i))},null,42,k),l.isValid?x("",!0):(c(),m("span",S))],2)}const T=g(w,[["render",C],["__scopeId","data-v-82cd8521"]]),A=`<script>
export default {
  props: {
    modelValue: {
      default: "",
      type: [Number, String],
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    cols: {
      default: 12,
      type: Number,
    },
    rows: {
      default: 4,
      type: Number,
    },
    placeholder: {
      default: null,
      type: String,
    },
    inputClasses: {
      default: "",
      type: String,
    },
    title: {
      default: null,
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    getValue() {
      return this.$refs.input.value;
    },
    onInput() {
      this.$emit("update:modelValue", this.getValue());
    },
  },
};
<\/script>

<template>
  <div :class="{ disabled }">
    <textarea
      :id="id"
      ref="input"
      :name="name"
      :title="title"
      :value="modelValue"
      :class="inputClasses"
      :cols="cols"
      :disabled="disabled"
      :rows="rows"
      :placeholder="placeholder"
      @input="onInput"
    />
    <span v-if="!isValid" class="invalid-marker" />
  </div>
</template>

<style lang="postcss" scoped>
div {
  position: relative;
  isolation: isolate;
  display: block;
  max-width: max-content;

  &.disabled {
    opacity: 0.5;
  }

  & textarea {
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
    padding: 11px 10px;
    border-radius: 0;
    border: 1px solid var(--knime-stone-gray);
    background-color: var(--theme-text-area-background-color);
    outline: none;
    display: block;

    &::placeholder {
      color: var(--knime-dove-gray);
    }

    &:focus {
      border-color: var(--knime-masala);
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--theme-text-area-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
  }
}
</style>
`,N=`<TextArea
  v-model="inputValue"
  title="Insert text"
/>
<TextArea
  v-model="inputValue2"
  placeholder="I'm a placeholder."
/>
<TextArea
  v-model="inputValue3"
  :is-valid="false"
/>
<TextArea
  v-model="inputValue4"
  placeholder="I'm a placeholder."
  :cols="48"
  :rows="8"
/>`,B={components:{TextArea:T,CodeExample:b},data(){return{codeExample:N,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return A}}},r=u=>(y("data-v-d5df7248"),u=u(),I(),u),E=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),e("code",null,"input"),a(" events and it has a "),e("code",null,"value"),a(". ")])])],-1)),U={class:"grid-container"},z={class:"grid-item-6 inputs"},D=r(()=>e("br",null,null,-1)),M={class:"grid-item-6"},j=r(()=>e("br",null,null,-1)),q=r(()=>e("br",null,null,-1)),F=r(()=>e("br",null,null,-1)),G={class:"grid-container"},H={class:"grid-item-12"};function J(u,t,l,_,n,p){const i=V("TextArea",!0),f=V("CodeExample");return c(),m("div",null,[e("section",null,[E,e("div",U,[e("div",z,[d(i,{modelValue:n.inputValue,"onUpdate:modelValue":t[0]||(t[0]=o=>n.inputValue=o),title:"Insert text"},null,8,["modelValue"]),d(i,{modelValue:n.inputValue2,"onUpdate:modelValue":t[1]||(t[1]=o=>n.inputValue2=o),placeholder:"I'm a placeholder."},null,8,["modelValue"]),d(i,{modelValue:n.inputValue3,"onUpdate:modelValue":t[2]||(t[2]=o=>n.inputValue3=o),"is-valid":!1},null,8,["modelValue"]),D,d(i,{modelValue:n.inputValue4,"onUpdate:modelValue":t[3]||(t[3]=o=>n.inputValue4=o),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),e("div",M,[a(" Input 1: "+s(n.inputValue)+" ",1),j,a(" Input 2: "+s(n.inputValue2)+" ",1),q,a(" Input 3: "+s(n.inputValue3)+" ",1),F,a(" Input 4: "+s(n.inputValue4),1)])])]),e("section",null,[e("div",G,[e("div",H,[d(f,{summary:"Show usage example"},{default:v(()=>[a(s(n.codeExample),1)]),_:1}),d(f,{summary:"Show TextArea.vue source code"},{default:v(()=>[a(s(p.code),1)]),_:1})])])])])}const O=g(B,[["render",J],["__scopeId","data-v-d5df7248"]]);export{O as default};
