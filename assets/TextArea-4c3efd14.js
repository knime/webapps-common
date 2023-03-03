import{C as x}from"./CodeExample-af46618b.js";import{_ as v,o as c,c as m,b as e,n as g,l as b,d as i,e as o,t as s,w as h,r as f,p as y,f as I}from"./index-be5f8b0e.js";const w={props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},k=["id","name","title","value","cols","rows","placeholder"],S={key:0,class:"invalid-marker"};function T(r,t,l,V,n,p){return c(),m("div",null,[e("textarea",{id:l.id,ref:"input",name:l.name,title:l.title,value:l.modelValue,class:g(l.inputClasses),cols:l.cols,rows:l.rows,placeholder:l.placeholder,onInput:t[0]||(t[0]=(...u)=>p.onInput&&p.onInput(...u))},null,42,k),l.isValid?b("",!0):(c(),m("span",S))])}const A=v(w,[["render",T],["__scopeId","data-v-0b23b8eb"]]),C=`<script>
export default {
    props: {
        modelValue: {
            default: '',
            type: [Number, String]
        },
        id: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        /**
         * Validity controlled by the parent component to be flexible.
         */
        isValid: {
            default: true,
            type: Boolean
        },
        cols: {
            default: 12,
            type: Number
        },
        rows: {
            default: 4,
            type: Number
        },
        placeholder: {
            default: null,
            type: String
        },
        inputClasses: {
            default: '',
            type: String
        },
        title: {
            default: null,
            type: String
        }
    },
    emits: ['update:modelValue'],
    methods: {
        getValue() {
            return this.$refs.input.value;
        },
        onInput() {
            this.$emit('update:modelValue', this.getValue());
        }
    }
};
<\/script>

<template>
  <div>
    <textarea
      :id="id"
      ref="input"
      :name="name"
      :title="title"
      :value="modelValue"
      :class="inputClasses"
      :cols="cols"
      :rows="rows"
      :placeholder="placeholder"
      @input="onInput"
    />
    <span
      v-if="!isValid"
      class="invalid-marker"
    />
  </div>
</template>

<style lang="postcss" scoped>
div {
  position: relative;
  isolation: isolate;
  display: block;
  max-width: max-content;

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
/>`,E={components:{TextArea:A,CodeExample:x},data(){return{codeExample:N,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return C}}},d=r=>(y("data-v-f8291b04"),r=r(),I(),r),B=d(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"TextArea"),e("p",null,[o(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),e("code",null,"input"),o(" events and it has a "),e("code",null,"value"),o(". ")])])],-1)),U={class:"grid-container"},z={class:"grid-item-6 inputs"},D=d(()=>e("br",null,null,-1)),M={class:"grid-item-6"},j=d(()=>e("br",null,null,-1)),q=d(()=>e("br",null,null,-1)),F=d(()=>e("br",null,null,-1)),G={class:"grid-container"},H={class:"grid-item-12"};function J(r,t,l,V,n,p){const u=f("TextArea",!0),_=f("CodeExample");return c(),m("div",null,[e("section",null,[B,e("div",U,[e("div",z,[i(u,{modelValue:n.inputValue,"onUpdate:modelValue":t[0]||(t[0]=a=>n.inputValue=a),title:"Insert text"},null,8,["modelValue"]),i(u,{modelValue:n.inputValue2,"onUpdate:modelValue":t[1]||(t[1]=a=>n.inputValue2=a),placeholder:"I'm a placeholder."},null,8,["modelValue"]),i(u,{modelValue:n.inputValue3,"onUpdate:modelValue":t[2]||(t[2]=a=>n.inputValue3=a),"is-valid":!1},null,8,["modelValue"]),D,i(u,{modelValue:n.inputValue4,"onUpdate:modelValue":t[3]||(t[3]=a=>n.inputValue4=a),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),e("div",M,[o(" Input 1: "+s(n.inputValue)+" ",1),j,o(" Input 2: "+s(n.inputValue2)+" ",1),q,o(" Input 3: "+s(n.inputValue3)+" ",1),F,o(" Input 4: "+s(n.inputValue4),1)])])]),e("section",null,[e("div",G,[e("div",H,[i(_,{summary:"Show usage example"},{default:h(()=>[o(s(n.codeExample),1)]),_:1}),i(_,{summary:"Show TextArea.vue source code"},{default:h(()=>[o(s(p.code),1)]),_:1})])])])])}const O=v(E,[["render",J],["__scopeId","data-v-f8291b04"]]);export{O as default};
