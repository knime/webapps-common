import{C as V}from"./CodeExample-D5JV_nn3.js";import{_ as h,r as v,o as x,c as g,b as i,e as u,t as d,d as t,w as o,p as b,f}from"./index-f-h5UuUy.js";import{N as I}from"./NumberInput-DlaOyszo.js";import{L as y}from"./Label-DKyu-lTK.js";import"./arrow-dropdown-5CEJk2ZC.js";const N="",U=`<NumberInput
  v-model="inputValue1"
  :min="min"
  :max="max"
  :is-valid="isValid1"
  type="integer"
  title="I am the integer"
  @input="validate1"
/>
<NumberInput
  v-model="inputValue2"
  :min="min"
  :max="max"
  :is-valid="isValid2"
  type="double"
  title="I am the double"
  @input="validate2"
/>
<NumberInput
  v-model="inputValue3"
  :min="min"
  :max="max"
  :is-valid="isValid3"
  type="integer"
  title="My starting value is invalid"
  @input="validate3"
/>`,w={components:{NumberInput:I,CodeExample:V,Label:y},data(){return{codeExample:U,min:-1e7,max:1e7,inputValue1:0,inputValue2:"4.5324526E6",inputValue3:-15e6,isValid1:!0,isValid2:!0,isValid3:!0}},computed:{code(){return N},input3Text(){return this.isValid3?"Valid":"Invalid"}},mounted(){this.validate1(),this.validate2(),this.validate3()},methods:{validate1(){this.isValid1=this.$refs.input1.validate().isValid},validate2(){this.isValid2=this.$refs.input2.validate().isValid},validate3(){this.isValid3=this.$refs.input3.validate().isValid}}},m=c=>(b("data-v-4e436705"),c=c(),f(),c),C=m(()=>i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null,[u(" Numeric input field with either type double or integer to set the step size. Spinner controls allow the user to increment the value with the mouse or keyboard. It acts as a form element, so it emits "),i("code",null,"input"),u(" events and it has a "),i("code",null,"value"),u(". It also has a valid and invalid state for styling purposes. ")])])],-1)),E={class:"grid-container"},S={class:"grid-item-4"},D=m(()=>i("u",null,"All",-1)),L=m(()=>i("br",null,null,-1)),T=m(()=>i("br",null,null,-1)),k={class:"grid-container"},z={class:"grid-item-8"},B={class:"grid-container"},M={class:"grid-item-6 inputs"},A={class:"grid-item-2"},j={class:"grid-container"},q={class:"grid-item-6 inputs"},F={class:"grid-item-2"},G={class:"grid-container"},H={class:"grid-item-6 inputs"},J={class:"grid-item-2"},K={class:"grid-container"},O={class:"grid-item-6 inputs"},P=m(()=>i("div",{class:"grid-item-2"},null,-1)),Q={class:"grid-container"},R={class:"grid-item-6 inputs"},W=m(()=>i("div",{class:"grid-item-2"},null,-1)),X={class:"grid-container"},Y={class:"grid-item-12"};function Z(c,l,$,ee,e,a){const r=v("NumberInput",!0),p=v("Label"),_=v("CodeExample");return x(),g("div",null,[i("section",null,[C,i("div",E,[i("div",S,[D,L,u(" min: "+d(e.min)+" ",1),T,u(" max: "+d(e.max),1)])]),i("div",k,[i("div",z,[i("div",B,[i("div",M,[t(p,{text:"Integer (step-size = 1)",large:""},{default:o(({labelForId:s})=>[t(r,{id:s,ref:"input1",modelValue:e.inputValue1,"onUpdate:modelValue":[l[0]||(l[0]=n=>e.inputValue1=n),a.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"I am the integer"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),i("div",A,"Integer: "+d(e.inputValue1),1)]),i("div",j,[i("div",q,[t(p,{text:"Double (step-size = .1)",large:""},{default:o(({labelForId:s})=>[t(r,{id:s,ref:"input2",modelValue:e.inputValue2,"onUpdate:modelValue":[l[1]||(l[1]=n=>e.inputValue2=n),a.validate2],min:e.min,max:e.max,"is-valid":e.isValid2,type:"double",title:"I am the double"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),i("div",F,"Double: "+d(e.inputValue2),1)]),i("div",G,[i("div",H,[t(p,{text:a.input3Text,large:""},{default:o(({labelForId:s})=>[t(r,{id:s,ref:"input3",modelValue:e.inputValue3,"onUpdate:modelValue":[l[2]||(l[2]=n=>e.inputValue3=n),a.validate3],min:e.min,max:e.max,"is-valid":e.isValid3,type:"integer",title:"My starting value is invalid"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1},8,["text"])]),i("div",J,d(a.input3Text)+": "+d(e.inputValue3),1)]),i("div",K,[i("div",O,[t(p,{text:"Disabled",large:""},{default:o(({labelForId:s})=>[t(r,{id:s,modelValue:e.inputValue1,"onUpdate:modelValue":[l[3]||(l[3]=n=>e.inputValue1=n),a.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"Disabled",disabled:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),P]),i("div",Q,[i("div",R,[t(p,{text:"Compact"},{default:o(({labelForId:s})=>[t(r,{id:s,modelValue:e.inputValue1,"onUpdate:modelValue":[l[4]||(l[4]=n=>e.inputValue1=n),a.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"Compact",compact:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),W])])])]),i("section",null,[i("div",X,[i("div",Y,[t(_,{summary:"Show usage example"},{default:o(()=>[u(d(e.codeExample),1)]),_:1}),t(_,{summary:"Show NumberInput.vue source code"},{default:o(()=>[u(d(a.code),1)]),_:1})])])])])}const ae=h(w,[["render",Z],["__scopeId","data-v-4e436705"]]);export{ae as default};
