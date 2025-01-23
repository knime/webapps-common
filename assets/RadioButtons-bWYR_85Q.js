import{C as B}from"./CodeExample-pewhKcZw.js";import{_ as p,r as c,o as v,l as g,n as f,c as V,b as e,d as i,t as r,w as b,e as n,p as h,f as z}from"./index-DEvE_v6q.js";import{B as y}from"./BaseRadioButtons-5aAZ_7Sh.js";const S={name:"RadioButtons",components:{BaseRadioButtons:y},props:{id:{type:String,default:null},modelValue:{type:String,default:""},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},alignment:{type:String,default:"horizontal",validator(l){return["horizontal","vertical"].includes(l)}}},emits:["update:modelValue"],methods:{hasSelection(){return this.$refs.radioButton.$refs.input.some(l=>l.checked)}}};function R(l,t,a,_,o,m){const d=c("BaseRadioButtons");return v(),g(d,{id:a.id,ref:"radioButton","possible-values":a.possibleValues,"model-value":a.modelValue,disabled:a.disabled,class:f(["radio-buttons",a.alignment,{disabled:a.disabled}]),"onUpdate:modelValue":t[0]||(t[0]=u=>l.$emit("update:modelValue",u))},null,8,["id","possible-values","model-value","disabled","class"])}const w=p(S,[["render",R],["__scopeId","data-v-4ba43a41"]]),C="",E=`<RadioButtons
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
<RadioButtons
  v-model="selected"
  alignment="vertical"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
`,F={components:{RadioButtons:w,CodeExample:B},data(){return{codeExample:E,selected:"bar"}},computed:{code(){return C}}},x=l=>(h("data-v-9ef04542"),l=l(),z(),l),U=x(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),n(" event when something is selected, and it has a "),e("code",null,"value"),n(". ")])])],-1)),I={class:"grid-container"},k={class:"grid-item-5"},N={class:"grid-item-5"},A={class:"grid-item-5"},D={class:"grid-item-5"},H={class:"grid-item-2"},O=x(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" Horizontal and vertical layout with subtext. Optionally, a margin can be specified by setting the CSS variable "),e("code",null,"--radio-button-margin"),n(", which defaults to 0. ")])])],-1)),T={class:"grid-container"},j={class:"grid-item-5"},q={class:"grid-item-5"},G={class:"grid-item-5"},J={class:"grid-item-5"},K={class:"grid-container"},L={class:"grid-item-12"};function M(l,t,a,_,o,m){const d=c("RadioButtons",!0),u=c("CodeExample");return v(),V("div",null,[e("section",null,[U,e("div",I,[e("div",k,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=s=>o.selected=s),"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",N,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",A,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[2]||(t[2]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",D,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[3]||(t[3]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar",disabled:!0},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",H,"selected id: "+r(o.selected),1)]),O,e("div",T,[e("div",j,[e("div",q,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[4]||(t[4]=s=>o.selected=s),"possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])]),e("div",G,[e("div",J,[i(d,{modelValue:o.selected,"onUpdate:modelValue":t[5]||(t[5]=s=>o.selected=s),alignment:"vertical",class:"radio-button-margin","possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])])])]),e("section",null,[e("div",K,[e("div",L,[i(u,{summary:"Show usage example"},{default:b(()=>[n(r(o.codeExample),1)]),_:1}),i(u,{summary:"Show RadioButtons.vue source code"},{default:b(()=>[n(r(m.code),1)]),_:1})])])])])}const X=p(F,[["render",M],["__scopeId","data-v-9ef04542"]]);export{X as default};
