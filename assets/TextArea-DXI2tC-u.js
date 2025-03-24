import{C as I}from"./CodeExample-BraLefvA.js";import{_ as v,o as c,c as m,b as e,n as _,m as g,r as f,d as s,e as n,t as d,w as h,p as y,f as b}from"./index-DlKExezu.js";const w={name:"TextArea",props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},S=["id","name","title","value","cols","disabled","rows","placeholder"],T={key:0,class:"invalid-marker"};function A(i,a,t,x,l,p){return c(),m("div",{class:_({disabled:t.disabled})},[e("textarea",{id:t.id,ref:"input",name:t.name,title:t.title,value:t.modelValue,class:_(t.inputClasses),cols:t.cols,disabled:t.disabled,rows:t.rows,placeholder:t.placeholder,onInput:a[0]||(a[0]=(...o)=>p.onInput&&p.onInput(...o))},null,42,S),t.isValid?g("",!0):(c(),m("span",T))],2)}const C=v(w,[["render",A],["__scopeId","data-v-ac394a7b"]]),N="",E=`<TextArea
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
/>`,B={components:{TextArea:C,CodeExample:I},data(){return{codeExample:E,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return N}}},r=i=>(y("data-v-09f42e34"),i=i(),b(),i),k=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),e("code",null,"input"),n(" events and it has a "),e("code",null,"value"),n(". ")])])],-1)),U={class:"grid-container"},D={class:"grid-item-6 inputs"},z=r(()=>e("br",null,null,-1)),M={class:"grid-item-6"},j=r(()=>e("br",null,null,-1)),q=r(()=>e("br",null,null,-1)),F=r(()=>e("br",null,null,-1)),G={class:"grid-container"},H={class:"grid-item-12"};function J(i,a,t,x,l,p){const o=f("TextArea",!0),V=f("CodeExample");return c(),m("div",null,[e("section",null,[k,e("div",U,[e("div",D,[s(o,{modelValue:l.inputValue,"onUpdate:modelValue":a[0]||(a[0]=u=>l.inputValue=u),title:"Insert text"},null,8,["modelValue"]),s(o,{modelValue:l.inputValue2,"onUpdate:modelValue":a[1]||(a[1]=u=>l.inputValue2=u),placeholder:"I'm a placeholder."},null,8,["modelValue"]),s(o,{modelValue:l.inputValue3,"onUpdate:modelValue":a[2]||(a[2]=u=>l.inputValue3=u),"is-valid":!1},null,8,["modelValue"]),z,s(o,{modelValue:l.inputValue4,"onUpdate:modelValue":a[3]||(a[3]=u=>l.inputValue4=u),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),e("div",M,[n(" Input 1: "+d(l.inputValue)+" ",1),j,n(" Input 2: "+d(l.inputValue2)+" ",1),q,n(" Input 3: "+d(l.inputValue3)+" ",1),F,n(" Input 4: "+d(l.inputValue4),1)])])]),e("section",null,[e("div",G,[e("div",H,[s(V,{summary:"Show usage example"},{default:h(()=>[n(d(l.codeExample),1)]),_:1}),s(V,{summary:"Show TextArea.vue source code"},{default:h(()=>[n(d(p.code),1)]),_:1})])])])])}const O=v(B,[["render",J],["__scopeId","data-v-09f42e34"]]);export{O as default};
