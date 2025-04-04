import{C as x}from"./CodeExample-CqrZuIia.js";import{_ as h,o as c,c as m,b as e,B as I,m as g,n as b,r as _,d,e as n,t as i,w as f,p as y,f as w}from"./index-d57f9Tmz.js";const S={name:"TextArea",props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},T=["id","name","title","value","cols","disabled","rows","placeholder"],A={key:0,class:"invalid-marker"};function C(o,a,t,v,l,p){return c(),m("div",{class:b({disabled:t.disabled})},[e("textarea",I(o.$attrs,{id:t.id,ref:"input",name:t.name,title:t.title,value:t.modelValue,class:t.inputClasses,cols:t.cols,disabled:t.disabled,rows:t.rows,placeholder:t.placeholder,onInput:a[0]||(a[0]=(...s)=>p.onInput&&p.onInput(...s))}),null,16,T),t.isValid?g("",!0):(c(),m("span",A))],2)}const N=h(S,[["render",C],["__scopeId","data-v-db028d3b"]]),B="",E=`<TextArea
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
/>`,k={components:{TextArea:N,CodeExample:x},data(){return{codeExample:E,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return B}}},r=o=>(y("data-v-09f42e34"),o=o(),w(),o),U=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),e("code",null,"input"),n(" events and it has a "),e("code",null,"value"),n(". ")])])],-1)),D={class:"grid-container"},z={class:"grid-item-6 inputs"},M=r(()=>e("br",null,null,-1)),P={class:"grid-item-6"},j=r(()=>e("br",null,null,-1)),q=r(()=>e("br",null,null,-1)),F=r(()=>e("br",null,null,-1)),G={class:"grid-container"},H={class:"grid-item-12"};function J(o,a,t,v,l,p){const s=_("TextArea",!0),V=_("CodeExample");return c(),m("div",null,[e("section",null,[U,e("div",D,[e("div",z,[d(s,{modelValue:l.inputValue,"onUpdate:modelValue":a[0]||(a[0]=u=>l.inputValue=u),title:"Insert text"},null,8,["modelValue"]),d(s,{modelValue:l.inputValue2,"onUpdate:modelValue":a[1]||(a[1]=u=>l.inputValue2=u),placeholder:"I'm a placeholder."},null,8,["modelValue"]),d(s,{modelValue:l.inputValue3,"onUpdate:modelValue":a[2]||(a[2]=u=>l.inputValue3=u),"is-valid":!1},null,8,["modelValue"]),M,d(s,{modelValue:l.inputValue4,"onUpdate:modelValue":a[3]||(a[3]=u=>l.inputValue4=u),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),e("div",P,[n(" Input 1: "+i(l.inputValue)+" ",1),j,n(" Input 2: "+i(l.inputValue2)+" ",1),q,n(" Input 3: "+i(l.inputValue3)+" ",1),F,n(" Input 4: "+i(l.inputValue4),1)])])]),e("section",null,[e("div",G,[e("div",H,[d(V,{summary:"Show usage example"},{default:f(()=>[n(i(l.codeExample),1)]),_:1}),d(V,{summary:"Show TextArea.vue source code"},{default:f(()=>[n(i(p.code),1)]),_:1})])])])])}const O=h(k,[["render",J],["__scopeId","data-v-09f42e34"]]);export{O as default};
