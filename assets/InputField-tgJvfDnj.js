import{o as x,c as h,b as l,_ as V,I as _,B as F,O as g,aD as C,r as u,e as s,d as e,w as o,t as m}from"./index-jKV-u3te.js";import{C as y}from"./CodeExample-DdMcj6_f.js";const w={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32"};function k(c,t){return x(),h("svg",w,t[0]||(t[0]=[l("path",{stroke:"#000","stroke-linecap":"round","stroke-linejoin":"round",d:"M2.5 7h27m-27 0v18h27V7m-27 0L16 17.771 29.5 7"},null,-1)]))}const b={render:k},B="",R=`<InputField
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
</InputField>`,D={components:{InputField:_,FunctionButton:F,CircleCheckIcon:g,CloseIcon:C,MailIcon:b,CodeExample:y},data(){return{codeExample:R,inputValue:"demo text",inputValue2:"",inputValue3:""}},computed:{code(){return B}},methods:{alert(c){window.alert(c),this.$refs.buttonDemo.focus()}}},E={class:"grid-container"},M={class:"grid-item-6 inputs"},q={class:"grid-item-6"},L={class:"grid-container"},S={class:"grid-item-12"};function N(c,t,U,j,d,a){const n=u("InputField",!0),f=u("MailIcon"),r=u("CircleCheckIcon"),p=u("FunctionButton"),v=u("CloseIcon"),I=u("CodeExample");return x(),h("div",null,[l("section",null,[t[7]||(t[7]=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,[s(" Single line string input with optional icon and validity styling. It acts as a form element, so it emits "),l("code",null,"input"),s(" events and it has a "),l("code",null,"value"),s(". ")])])],-1)),l("div",E,[l("div",M,[e(n,{modelValue:d.inputValue,"onUpdate:modelValue":t[0]||(t[0]=i=>d.inputValue=i),type:"text",title:"Insert text"},null,8,["modelValue"]),e(n,{modelValue:d.inputValue2,"onUpdate:modelValue":t[1]||(t[1]=i=>d.inputValue2=i),type:"text",placeholder:"I'm a placeholder"},null,8,["modelValue"]),e(n,{modelValue:d.inputValue3,"onUpdate:modelValue":t[2]||(t[2]=i=>d.inputValue3=i),type:"text",placeholder:"Required field",required:""},null,8,["modelValue"]),e(n,{"model-value":"disabled: no edit here",type:"text",disabled:""}),e(n,{"model-value":"invalid","is-valid":!1,type:"text"}),e(n,{"model-value":"demo with left icon",type:"text"},{icon:o(()=>[e(f)]),_:1}),e(n,{"model-value":"demo with right icon",type:"text"},{iconRight:o(()=>[e(r)]),_:1}),e(n,{ref:"buttonDemo","model-value":"demo with right aligned buttons",type:"text"},{iconRight:o(()=>[e(p,{onClick:t[3]||(t[3]=i=>a.alert("demo"))},{default:o(()=>[e(r)]),_:1}),e(p,{onClick:t[4]||(t[4]=i=>a.alert("demo 2"))},{default:o(()=>[e(v)]),_:1})]),_:1},512),e(n,{ref:"buttonDemo","model-value":"demo with compact mode",type:"text",compact:""},{iconRight:o(()=>[e(p,{onClick:t[5]||(t[5]=i=>a.alert("demo"))},{default:o(()=>[e(r)]),_:1}),e(p,{onClick:t[6]||(t[6]=i=>a.alert("demo 2"))},{default:o(()=>[e(v)]),_:1})]),_:1},512)]),l("div",q,"input value: "+m(d.inputValue),1)])]),l("section",null,[l("div",L,[l("div",S,[e(I,{summary:"Show usage example"},{default:o(()=>[s(m(d.codeExample),1)]),_:1}),e(I,{summary:"Show InputField.vue source code"},{default:o(()=>[s(m(a.code),1)]),_:1})])])])])}const z=V(D,[["render",N],["__scopeId","data-v-aacc274f"]]);export{z as default};
