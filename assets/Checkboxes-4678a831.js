import{C as i}from"./Checkbox-22ba75cb.js";import{_ as u,r as f,o as l,c as r,F as p,g as _,j as h,w as m,e as x,t as b,n as y}from"./index-4c2fa59f.js";const k={components:{Checkbox:i},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},disabled:{type:Boolean,default:!1},modelValue:{type:Array,default:()=>[]}},emits:["update:modelValue"],methods:{onUpdateModelValue(e,t){let a=Array.from(this.modelValue);t?a.indexOf(e)===-1&&a.push(e):a=a.filter(s=>s!==e),consola.trace("Checkboxes value changed to",a),this.$emit("update:modelValue",a)},hasSelection(){return this.$refs.boxes.some(e=>e.isChecked())}}};function V(e,t,a,s,C,d){const n=f("Checkbox");return l(),r("div",{class:y(["checkboxes",a.alignment])},[(l(!0),r(p,null,_(a.possibleValues,o=>(l(),h(n,{ref_for:!0,ref:"boxes",key:`checkboxes-${o.id}`,"model-value":a.modelValue.indexOf(o.id)>-1,title:o.text,disabled:a.disabled,class:"box","onUpdate:modelValue":c=>d.onUpdateModelValue(o.id,c)},{default:m(()=>[x(b(o.text),1)]),_:2},1032,["model-value","title","disabled","onUpdate:modelValue"]))),128))],2)}const A=u(k,[["render",V],["__scopeId","data-v-ebcb5c12"]]);export{A as C};
