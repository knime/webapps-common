import{B as l}from"./BaseRadioButtons-BkhUiZow.js";import{u as t,_ as d,r as n,o as i,j as u,w as p,x as r,az as m,aA as f,n as c}from"./index-pv556zpM.js";const B=t({name:"ValueSwitch",components:{BaseRadioButtons:l},props:{id:{type:String,default:null},modelValue:{type:String,default:null},name:{type:String,default:null},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},compact:{type:Boolean,default:!1}},emits:["update:modelValue"]});function b(e,o,V,v,y,S){const s=n("BaseRadioButtons");return i(),u(s,{id:e.id,ref:"radioButton","possible-values":e.possibleValues,"model-value":e.modelValue,name:e.name,disabled:e.disabled,class:c(["value-switch",{disabled:e.disabled,compact:e.compact,normal:!e.compact}]),"onUpdate:modelValue":o[0]||(o[0]=a=>e.$emit("update:modelValue",a))},{default:p(a=>[r(e.$slots,"default",m(f(a)),void 0,!0)]),_:3},8,["id","possible-values","model-value","name","disabled","class"])}const g=d(B,[["render",b],["__scopeId","data-v-f7dab3d3"]]);export{g as V};
