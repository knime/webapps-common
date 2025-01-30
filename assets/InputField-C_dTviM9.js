import{o as _,c as h,b as o,_ as f,I as V,E as F,Q as g,aB as C,r as a,d as e,w as l,t as m,e as c,p as y,f as w}from"./index-BP46Hi4H.js";import{C as k}from"./CodeExample-QP1ilMCf.js";const b={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32"},B=o("path",{stroke:"#000","stroke-linecap":"round","stroke-linejoin":"round",d:"M2.5 7h27m-27 0v18h27V7m-27 0L16 17.771 29.5 7"},null,-1),E=[B];function R(u,t){return _(),h("svg",b,[...E])}const S={render:R},D="",M=`<InputField
  v-model="inputValue"
  type="text"
  title="Insert text"
/>
<Label text="Label of the Input Field">
  <InputField
    v-model="inputValue2"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>
<InputField
  v-model="inputValue"
  type="text"
  :is-valid="false"
/>
<InputField
  v-model="inputValue3"
  type="text"
  placeholder="Required field"
  required
/>
<InputField
  :model-value="no edit here"
  type="text"
  disabled
/>
<InputField
  type="password"
  model-value="secret-password"
/>
<InputField
  v-model="inputValue"
  @focus="onFocus"
/>
<InputField
  v-model="inputValue"
  type="text"
>
  <template v-slot:icon><MailIcon /></template>
</InputField>
<InputField
  model-value="demo with right aligned slot"
  type="text"
>
  <template v-slot:iconRight><CircleCheckIcon /></template>
</InputField>
<InputField
  model-value="demo with right aligned button"
  type="text"
  ref="buttonDemo"
>
  <template v-slot:iconRight>
    <FunctionButton
      @click="alert('demo')"
    >
      <CircleCheckIcon />
    </FunctionButton>
    <FunctionButton
      @click="alert('demo 2')"
    >
      <CloseIcon />
    </FunctionButton>
  </template>
</InputField>`,q={components:{InputField:V,FunctionButton:F,CircleCheckIcon:g,CloseIcon:C,MailIcon:S,CodeExample:k},data(){return{codeExample:M,inputValue:"demo text",inputValue2:"",inputValue3:""}},computed:{code(){return D}},methods:{alert(u){window.alert(u),this.$refs.buttonDemo.focus()}}},L=u=>(y("data-v-aacc274f"),u=u(),w(),u),N=L(()=>o("div",{class:"grid-container"},[o("div",{class:"grid-item-12"},[o("p",null,[c(" Single line string input with optional icon and validity styling. It acts as a form element, so it emits "),o("code",null,"input"),c(" events and it has a "),o("code",null,"value"),c(". ")])])],-1)),U={class:"grid-container"},j={class:"grid-item-6 inputs"},Q={class:"grid-item-6"},T={class:"grid-container"},z={class:"grid-item-12"};function A(u,t,G,H,d,s){const n=a("InputField",!0),x=a("MailIcon"),r=a("CircleCheckIcon"),p=a("FunctionButton"),v=a("CloseIcon"),I=a("CodeExample");return _(),h("div",null,[o("section",null,[N,o("div",U,[o("div",j,[e(n,{modelValue:d.inputValue,"onUpdate:modelValue":t[0]||(t[0]=i=>d.inputValue=i),type:"text",title:"Insert text"},null,8,["modelValue"]),e(n,{modelValue:d.inputValue2,"onUpdate:modelValue":t[1]||(t[1]=i=>d.inputValue2=i),type:"text",placeholder:"I'm a placeholder"},null,8,["modelValue"]),e(n,{modelValue:d.inputValue3,"onUpdate:modelValue":t[2]||(t[2]=i=>d.inputValue3=i),type:"text",placeholder:"Required field",required:""},null,8,["modelValue"]),e(n,{"model-value":"disabled: no edit here",type:"text",disabled:""}),e(n,{"model-value":"invalid","is-valid":!1,type:"text"}),e(n,{"model-value":"demo with left icon",type:"text"},{icon:l(()=>[e(x)]),_:1}),e(n,{"model-value":"demo with right icon",type:"text"},{iconRight:l(()=>[e(r)]),_:1}),e(n,{ref:"buttonDemo","model-value":"demo with right aligned buttons",type:"text"},{iconRight:l(()=>[e(p,{onClick:t[3]||(t[3]=i=>s.alert("demo"))},{default:l(()=>[e(r)]),_:1}),e(p,{onClick:t[4]||(t[4]=i=>s.alert("demo 2"))},{default:l(()=>[e(v)]),_:1})]),_:1},512),e(n,{ref:"buttonDemo","model-value":"demo with compact mode",type:"text",compact:""},{iconRight:l(()=>[e(p,{onClick:t[5]||(t[5]=i=>s.alert("demo"))},{default:l(()=>[e(r)]),_:1}),e(p,{onClick:t[6]||(t[6]=i=>s.alert("demo 2"))},{default:l(()=>[e(v)]),_:1})]),_:1},512)]),o("div",Q,"input value: "+m(d.inputValue),1)])]),o("section",null,[o("div",T,[o("div",z,[e(I,{summary:"Show usage example"},{default:l(()=>[c(m(d.codeExample),1)]),_:1}),e(I,{summary:"Show InputField.vue source code"},{default:l(()=>[c(m(s.code),1)]),_:1})])])])])}const O=f(q,[["render",A],["__scopeId","data-v-aacc274f"]]);export{O as default};
