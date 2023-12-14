import{C as x}from"./CodeExample-4cb2fb43.js";import{_ as V,o as c,c as m,b as e,n as _,l as y,r as h,d as s,e as a,t as i,w as v,p as b,f as I}from"./index-4c2fa59f.js";const w={props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},k=["id","name","title","value","cols","disabled","rows","placeholder"],S={key:0,class:"invalid-marker"};function T(u,l,t,g,n,p){return c(),m("div",{class:_({disabled:t.disabled})},[e("textarea",{id:t.id,ref:"input",name:t.name,title:t.title,value:t.modelValue,class:_(t.inputClasses),cols:t.cols,disabled:t.disabled,rows:t.rows,placeholder:t.placeholder,onInput:l[0]||(l[0]=(...d)=>p.onInput&&p.onInput(...d))},null,42,k),t.isValid?y("",!0):(c(),m("span",S))],2)}const A=V(w,[["render",T],["__scopeId","data-v-82cd8521"]]),C=`<script>
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
`;const N=`<TextArea
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
/>`,B={components:{TextArea:A,CodeExample:x},data(){return{codeExample:N,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return C}}},r=u=>(b("data-v-d5df7248"),u=u(),I(),u),E=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),e("code",null,"input"),a(" events and it has a "),e("code",null,"value"),a(". ")])])],-1)),U={class:"grid-container"},z={class:"grid-item-6 inputs"},D=r(()=>e("br",null,null,-1)),M={class:"grid-item-6"},j=r(()=>e("br",null,null,-1)),q=r(()=>e("br",null,null,-1)),F=r(()=>e("br",null,null,-1)),G={class:"grid-container"},H={class:"grid-item-12"};function J(u,l,t,g,n,p){const d=h("TextArea",!0),f=h("CodeExample");return c(),m("div",null,[e("section",null,[E,e("div",U,[e("div",z,[s(d,{modelValue:n.inputValue,"onUpdate:modelValue":l[0]||(l[0]=o=>n.inputValue=o),title:"Insert text"},null,8,["modelValue"]),s(d,{modelValue:n.inputValue2,"onUpdate:modelValue":l[1]||(l[1]=o=>n.inputValue2=o),placeholder:"I'm a placeholder."},null,8,["modelValue"]),s(d,{modelValue:n.inputValue3,"onUpdate:modelValue":l[2]||(l[2]=o=>n.inputValue3=o),"is-valid":!1},null,8,["modelValue"]),D,s(d,{modelValue:n.inputValue4,"onUpdate:modelValue":l[3]||(l[3]=o=>n.inputValue4=o),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),e("div",M,[a(" Input 1: "+i(n.inputValue)+" ",1),j,a(" Input 2: "+i(n.inputValue2)+" ",1),q,a(" Input 3: "+i(n.inputValue3)+" ",1),F,a(" Input 4: "+i(n.inputValue4),1)])])]),e("section",null,[e("div",G,[e("div",H,[s(f,{summary:"Show usage example"},{default:v(()=>[a(i(n.codeExample),1)]),_:1}),s(f,{summary:"Show TextArea.vue source code"},{default:v(()=>[a(i(p.code),1)]),_:1})])])])])}const O=V(B,[["render",J],["__scopeId","data-v-d5df7248"]]);export{O as default};
