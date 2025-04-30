import{C as V}from"./CodeExample-Bgnrg-T3.js";import{_ as c,r as p,o as x,c as g,b as i,e as u,t as a,d as l,w as o}from"./index-iyHn6l_j.js";import{N as _}from"./NumberInput-CzYS0mfK.js";import{L as b}from"./Label-Bev8SZcF.js";import"./arrow-dropdown-y1oQ6uyI.js";const f="",h=`<NumberInput
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
/>`,I={components:{NumberInput:_,CodeExample:V,Label:b},data(){return{codeExample:h,min:-1e7,max:1e7,inputValue1:0,inputValue2:"4.5324526E6",inputValue3:-15e6,isValid1:!0,isValid2:!0,isValid3:!0}},computed:{code(){return f},input3Text(){return this.isValid3?"Valid":"Invalid"}},mounted(){this.validate1(),this.validate2(),this.validate3()},methods:{validate1(){this.isValid1=this.$refs.input1.validate().isValid},validate2(){this.isValid2=this.$refs.input2.validate().isValid},validate3(){this.isValid3=this.$refs.input3.validate().isValid}}},y={class:"grid-container"},N={class:"grid-item-4"},U={class:"grid-container"},C={class:"grid-item-8"},w={class:"grid-container"},E={class:"grid-item-6 inputs"},D={class:"grid-item-2"},L={class:"grid-container"},S={class:"grid-item-6 inputs"},T={class:"grid-item-2"},k={class:"grid-container"},z={class:"grid-item-6 inputs"},B={class:"grid-item-2"},M={class:"grid-container"},A={class:"grid-item-6 inputs"},j={class:"grid-container"},q={class:"grid-item-6 inputs"},F={class:"grid-container"},G={class:"grid-item-12"};function H(J,t,K,O,e,d){const m=p("NumberInput",!0),r=p("Label"),v=p("CodeExample");return x(),g("div",null,[i("section",null,[t[10]||(t[10]=i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null,[u(" Numeric input field with either type double or integer to set the step size. Spinner controls allow the user to increment the value with the mouse or keyboard. It acts as a form element, so it emits "),i("code",null,"input"),u(" events and it has a "),i("code",null,"value"),u(". It also has a valid and invalid state for styling purposes. ")])])],-1)),i("div",y,[i("div",N,[t[5]||(t[5]=i("u",null,"All",-1)),t[6]||(t[6]=i("br",null,null,-1)),u(" min: "+a(e.min)+" ",1),t[7]||(t[7]=i("br",null,null,-1)),u(" max: "+a(e.max),1)])]),i("div",U,[i("div",C,[i("div",w,[i("div",E,[l(r,{text:"Integer (step-size = 1)",large:""},{default:o(({labelForId:s})=>[l(m,{id:s,ref:"input1",modelValue:e.inputValue1,"onUpdate:modelValue":[t[0]||(t[0]=n=>e.inputValue1=n),d.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"I am the integer"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),i("div",D,"Integer: "+a(e.inputValue1),1)]),i("div",L,[i("div",S,[l(r,{text:"Double (step-size = .1)",large:""},{default:o(({labelForId:s})=>[l(m,{id:s,ref:"input2",modelValue:e.inputValue2,"onUpdate:modelValue":[t[1]||(t[1]=n=>e.inputValue2=n),d.validate2],min:e.min,max:e.max,"is-valid":e.isValid2,type:"double",title:"I am the double"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),i("div",T,"Double: "+a(e.inputValue2),1)]),i("div",k,[i("div",z,[l(r,{text:d.input3Text,large:""},{default:o(({labelForId:s})=>[l(m,{id:s,ref:"input3",modelValue:e.inputValue3,"onUpdate:modelValue":[t[2]||(t[2]=n=>e.inputValue3=n),d.validate3],min:e.min,max:e.max,"is-valid":e.isValid3,type:"integer",title:"My starting value is invalid"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1},8,["text"])]),i("div",B,a(d.input3Text)+": "+a(e.inputValue3),1)]),i("div",M,[i("div",A,[l(r,{text:"Disabled",large:""},{default:o(({labelForId:s})=>[l(m,{id:s,modelValue:e.inputValue1,"onUpdate:modelValue":[t[3]||(t[3]=n=>e.inputValue1=n),d.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"Disabled",disabled:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),t[8]||(t[8]=i("div",{class:"grid-item-2"},null,-1))]),i("div",j,[i("div",q,[l(r,{text:"Compact"},{default:o(({labelForId:s})=>[l(m,{id:s,modelValue:e.inputValue1,"onUpdate:modelValue":[t[4]||(t[4]=n=>e.inputValue1=n),d.validate1],min:e.min,max:e.max,"is-valid":e.isValid1,type:"integer",title:"Compact",compact:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),t[9]||(t[9]=i("div",{class:"grid-item-2"},null,-1))])])])]),i("section",null,[i("div",F,[i("div",G,[l(v,{summary:"Show usage example"},{default:o(()=>[u(a(e.codeExample),1)]),_:1}),l(v,{summary:"Show NumberInput.vue source code"},{default:o(()=>[u(a(d.code),1)]),_:1})])])])])}const Y=c(I,[["render",H],["__scopeId","data-v-4e436705"]]);export{Y as default};
