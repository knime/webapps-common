import{C as B}from"./CodeExample--IB5OvRr.js";import{_ as p,r as c,o as v,k as g,n as f,c as _,b as e,e as a,d,t as r,w as b}from"./index-Cm1qlS-G.js";import{B as V}from"./BaseRadioButtons-DuC1xvD1.js";import"./v4-C6aID195.js";const z={name:"RadioButtons",components:{BaseRadioButtons:V},props:{id:{type:String,default:null},modelValue:{type:String,default:""},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},alignment:{type:String,default:"horizontal",validator(n){return["horizontal","vertical"].includes(n)}}},emits:["update:modelValue"],methods:{hasSelection(){return this.$refs.radioButton.$refs.input.some(n=>n.checked)}}};function h(n,t,i,x,o,m){const l=c("BaseRadioButtons");return v(),g(l,{id:i.id,ref:"radioButton","possible-values":i.possibleValues,"model-value":i.modelValue,disabled:i.disabled,class:f(["radio-buttons",i.alignment,{disabled:i.disabled}]),"onUpdate:modelValue":t[0]||(t[0]=u=>n.$emit("update:modelValue",u))},null,8,["id","possible-values","model-value","disabled","class"])}const y=p(z,[["render",h],["__scopeId","data-v-4ba43a41"]]),R="",S=`<RadioButtons
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
`,w={components:{RadioButtons:y,CodeExample:B},data(){return{codeExample:S,selected:"bar"}},computed:{code(){return R}}},C={class:"grid-container"},E={class:"grid-item-5"},F={class:"grid-item-5"},U={class:"grid-item-5"},k={class:"grid-item-5"},I={class:"grid-item-2"},N={class:"grid-container"},A={class:"grid-item-5"},D={class:"grid-item-5"},H={class:"grid-item-5"},O={class:"grid-item-5"},T={class:"grid-container"},j={class:"grid-item-12"};function q(n,t,i,x,o,m){const l=c("RadioButtons",!0),u=c("CodeExample");return v(),_("div",null,[e("section",null,[t[6]||(t[6]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),a(" event when something is selected, and it has a "),e("code",null,"value"),a(". ")])])],-1)),e("div",C,[e("div",E,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=s=>o.selected=s),"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",F,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",U,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[2]||(t[2]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",k,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[3]||(t[3]=s=>o.selected=s),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar",disabled:!0},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",I,"selected id: "+r(o.selected),1)]),t[7]||(t[7]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" Horizontal and vertical layout with subtext. Optionally, a margin can be specified by setting the CSS variable "),e("code",null,"--radio-button-margin"),a(", which defaults to 0. ")])])],-1)),e("div",N,[e("div",A,[e("div",D,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[4]||(t[4]=s=>o.selected=s),"possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])]),e("div",H,[e("div",O,[d(l,{modelValue:o.selected,"onUpdate:modelValue":t[5]||(t[5]=s=>o.selected=s),alignment:"vertical",class:"radio-button-margin","possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])])])]),e("section",null,[e("div",T,[e("div",j,[d(u,{summary:"Show usage example"},{default:b(()=>[a(r(o.codeExample),1)]),_:1}),d(u,{summary:"Show RadioButtons.vue source code"},{default:b(()=>[a(r(m.code),1)]),_:1})])])])])}const M=p(w,[["render",q],["__scopeId","data-v-9ef04542"]]);export{M as default};
