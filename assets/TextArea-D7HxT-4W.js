import{C as m}from"./CodeExample-DEPoky-z.js";import{_ as V,r,c,o as x,b as l,e as o,d as u,t as s,w as d}from"./index-d8EcZAIk.js";import{T as v}from"./TextArea-DTgyx4R8.js";const f="",I=`<TextArea
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
/>`,g={components:{TextArea:v,CodeExample:m},data(){return{codeExample:I,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return f}}},T={class:"grid-container"},A={class:"grid-item-6 inputs"},_={class:"grid-item-6"},w={class:"grid-container"},C={class:"grid-item-12"};function E(b,e,y,U,t,p){const a=r("TextArea",!0),i=r("CodeExample");return x(),c("div",null,[l("section",null,[e[8]||(e[8]=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,[o(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),l("code",null,"input"),o(" events and it has a "),l("code",null,"value"),o(". ")])])],-1)),l("div",T,[l("div",A,[u(a,{modelValue:t.inputValue,"onUpdate:modelValue":e[0]||(e[0]=n=>t.inputValue=n),title:"Insert text"},null,8,["modelValue"]),u(a,{modelValue:t.inputValue2,"onUpdate:modelValue":e[1]||(e[1]=n=>t.inputValue2=n),placeholder:"I'm a placeholder."},null,8,["modelValue"]),u(a,{modelValue:t.inputValue3,"onUpdate:modelValue":e[2]||(e[2]=n=>t.inputValue3=n),"is-valid":!1},null,8,["modelValue"]),e[4]||(e[4]=l("br",null,null,-1)),u(a,{modelValue:t.inputValue4,"onUpdate:modelValue":e[3]||(e[3]=n=>t.inputValue4=n),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),l("div",_,[o(" Input 1: "+s(t.inputValue)+" ",1),e[5]||(e[5]=l("br",null,null,-1)),o(" Input 2: "+s(t.inputValue2)+" ",1),e[6]||(e[6]=l("br",null,null,-1)),o(" Input 3: "+s(t.inputValue3)+" ",1),e[7]||(e[7]=l("br",null,null,-1)),o(" Input 4: "+s(t.inputValue4),1)])])]),l("section",null,[l("div",w,[l("div",C,[u(i,{summary:"Show usage example"},{default:d(()=>[o(s(t.codeExample),1)]),_:1}),u(i,{summary:"Show TextArea.vue source code"},{default:d(()=>[o(s(p.code),1)]),_:1})])])])])}const S=V(g,[["render",E],["__scopeId","data-v-09f42e34"]]);export{S as default};
