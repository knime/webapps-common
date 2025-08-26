import{C as g}from"./CodeExample-DgrpEoF9.js";import{_ as v,c as r,o as p,b as l,l as I,y as _,g as y,r as V,e as a,d as s,t as i,w as f}from"./index-C9nwT2dq.js";const b={name:"TextArea",props:{modelValue:{default:"",type:[Number,String]},id:{type:String,default:null},name:{type:String,default:null},isValid:{default:!0,type:Boolean},cols:{default:12,type:Number},rows:{default:4,type:Number},placeholder:{default:null,type:String},inputClasses:{default:"",type:String},title:{default:null,type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],methods:{getValue(){return this.$refs.input.value},onInput(){this.$emit("update:modelValue",this.getValue())}}},h=["id","name","title","value","cols","disabled","rows","placeholder"],w={key:0,class:"invalid-marker"};function T(m,e,n,x,t,d){return p(),r("div",{class:y({disabled:n.disabled})},[l("textarea",_(m.$attrs,{id:n.id,ref:"input",name:n.name,title:n.title,value:n.modelValue,class:n.inputClasses,cols:n.cols,disabled:n.disabled,rows:n.rows,placeholder:n.placeholder,onInput:e[0]||(e[0]=(...o)=>d.onInput&&d.onInput(...o))}),null,16,h),n.isValid?I("",!0):(p(),r("span",w))],2)}const A=v(b,[["render",T],["__scopeId","data-v-db028d3b"]]),C="",S=`<TextArea
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
/>`,N={components:{TextArea:A,CodeExample:g},data(){return{codeExample:S,inputValue:"Default settings",inputValue2:"",inputValue3:"Invalid style",inputValue4:"I have 8 rows (4 is default) and 48 columns (12 is the default)."}},computed:{code(){return C}}},E={class:"grid-container"},B={class:"grid-item-6 inputs"},k={class:"grid-item-6"},U={class:"grid-container"},D={class:"grid-item-12"};function z(m,e,n,x,t,d){const o=V("TextArea",!0),c=V("CodeExample");return p(),r("div",null,[l("section",null,[e[8]||(e[8]=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,[a(" Multi-line string input with optional invalid styling. It acts as a form element, so it emits "),l("code",null,"input"),a(" events and it has a "),l("code",null,"value"),a(". ")])])],-1)),l("div",E,[l("div",B,[s(o,{modelValue:t.inputValue,"onUpdate:modelValue":e[0]||(e[0]=u=>t.inputValue=u),title:"Insert text"},null,8,["modelValue"]),s(o,{modelValue:t.inputValue2,"onUpdate:modelValue":e[1]||(e[1]=u=>t.inputValue2=u),placeholder:"I'm a placeholder."},null,8,["modelValue"]),s(o,{modelValue:t.inputValue3,"onUpdate:modelValue":e[2]||(e[2]=u=>t.inputValue3=u),"is-valid":!1},null,8,["modelValue"]),e[4]||(e[4]=l("br",null,null,-1)),s(o,{modelValue:t.inputValue4,"onUpdate:modelValue":e[3]||(e[3]=u=>t.inputValue4=u),placeholder:"I'm a placeholder.",cols:48,rows:8},null,8,["modelValue"])]),l("div",k,[a(" Input 1: "+i(t.inputValue)+" ",1),e[5]||(e[5]=l("br",null,null,-1)),a(" Input 2: "+i(t.inputValue2)+" ",1),e[6]||(e[6]=l("br",null,null,-1)),a(" Input 3: "+i(t.inputValue3)+" ",1),e[7]||(e[7]=l("br",null,null,-1)),a(" Input 4: "+i(t.inputValue4),1)])])]),l("section",null,[l("div",U,[l("div",D,[s(c,{summary:"Show usage example"},{default:f(()=>[a(i(t.codeExample),1)]),_:1}),s(c,{summary:"Show TextArea.vue source code"},{default:f(()=>[a(i(d.code),1)]),_:1})])])])])}const j=v(N,[["render",z],["__scopeId","data-v-09f42e34"]]);export{j as default};
