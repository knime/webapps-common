import{_ as s,o as c,c as i,b as d,H as o,n as u}from"./index-CnBV6_u3.js";const r={name:"Checkbox",props:{id:{type:String,default:null},name:{type:String,default:null},modelValue:{type:Boolean,default:!1},disabled:{default:!1,type:Boolean},invalid:{type:Boolean,default:!1},labelSize:{type:String,default:"regular",validator:e=>["regular","large"].includes(e)}},emits:["update:modelValue"],computed:{classes(){return["checkbox",this.labelSize,{disabled:this.disabled}]}},methods:{onInput(e){const{checked:a}=e.target;consola.trace("Checkbox value changed to",a),this.$emit("update:modelValue",a)},isChecked(){return this.$refs.input.checked}}},f=["id","name","checked","disabled"];function m(e,a,l,h,b,t){return c(),i("label",{class:u([t.classes,{invalid:l.invalid}])},[d("input",{id:l.id,ref:"input",name:l.name,checked:l.modelValue,disabled:l.disabled,type:"checkbox",onChange:a[0]||(a[0]=(...n)=>t.onInput&&t.onInput(...n))},null,40,f),d("span",null,[o(e.$slots,"default",{},void 0,!0)])],2)}const k=s(r,[["render",m],["__scopeId","data-v-eb62c9a6"]]);export{k as C};
