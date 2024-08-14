import{_ as x,ay as w,r as d,o as l,c as u,x as p,b as c,t as m,n as f,m as n,q as a,d as b,P as E,a6 as C,F as v,g as S,j as B,w as D,e as N,h as M}from"./index-pv556zpM.js";import{C as k}from"./Checkbox-adSNouuW.js";import{D as I}from"./arrow-dropdown-D5nKo33r.js";const r=1,A=28.5,F=8,P={name:"Multiselect",components:{Checkbox:k,DropdownIcon:I},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},placeholder:{type:String,default:null},isValid:{type:Boolean,default:!0},separator:{type:String,default:", "},summaryMaxItemCount:{type:Number,default:1/0},summaryName:{type:String,default:null},useCustomListBox:{type:Boolean,default:!1},sizeVisibleOptions:{type:Number,default:0,validator(e){return e>=0}},parentFocusElement:{type:Object,default:()=>({})},parentRefocusElementOnClose:{type:Object,default:()=>({})},closeDropdownOnSelection:{type:Boolean,default:!1},compact:{type:Boolean,default:!1}},emits:["update:modelValue","focusOutside"],setup(){return{activeElement:w()}},data(){return{collapsed:!0,focusOptions:[]}},computed:{focusElements(){return[...this.focusOptions,this.parentFocusElement]},summary(){return this.modelValue.length===0?this.placeholder:this.modelValue.length>this.summaryMaxItemCount?`${this.modelValue.length} ${this.summaryName}`:this.possibleValues.filter(({id:e})=>this.modelValue.indexOf(e)>-1).map(({text:e,selectedText:t=e})=>t).join(this.separator)},showOptions(){return!this.collapsed&&this.possibleValues.length>0},useSpecificOptionsHeight(){return this.sizeVisibleOptions>0&&this.sizeVisibleOptions<this.possibleValues.length},optionsHeight(){return this.useSpecificOptionsHeight?{"max-height":`${this.sizeVisibleOptions*A+F}px`}:{}},refocusElementOnClose(){return this.useCustomListBox?this.parentRefocusElementOnClose:this.$refs.toggle}},mounted(){this.updateFocusOptions()},methods:{emitNewSelection(e){this.$emit("update:modelValue",e)},getNextElement(e){return this.focusOptions[this.focusOptions.indexOf(this.activeElement)+e]||(e<0?this.focusOptions[this.focusOptions.length-1]:this.focusOptions[0])},onUpdateModelValue(e,t){t?this.modelValue.indexOf(e)===-1&&this.emitNewSelection([...this.modelValue,e]):this.emitNewSelection(this.modelValue.filter(i=>i!==e)),this.closeDropdownOnSelection&&this.closeOptions()},toggle(){this.collapsed=!this.collapsed,setTimeout(()=>{var e;(e=this.$refs.toggle)==null||e.focus()},r)},isChecked(e){return this.modelValue.includes(e)},closeOptions(e=!0){this.collapsed=!0,e&&setTimeout(()=>{this.refocusElementOnClose.focus()},r)},closeOptionsAndStop(e){this.collapsed||(this.closeOptions(),e.stopPropagation(),e.preventDefault())},onUp(){document.activeElement!==this.$refs.toggle&&this.getNextElement(-1).focus()},onDown(){this.getNextElement(1).focus()},onFocusOut(){setTimeout(()=>{this.focusElements.includes(document.activeElement)||(this.closeOptions(!1),this.useCustomListBox&&this.$emit("focusOutside"))},r)},onMousedown(e){e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()},updateFocusOptions(){this.$refs.option&&(this.focusOptions=this.$refs.option.sort((e,t)=>parseInt(e.$el.dataset.index,10)-parseInt(t.$el.dataset.index,10)).map(e=>e.$el&&e.$el.firstChild))}}},T={key:1};function U(e,t,i,_,h,s){const O=d("DropdownIcon"),g=d("Checkbox");return l(),u("div",{ref:"multiselect",class:f(["multiselect",{collapsed:h.collapsed,invalid:!i.isValid,compact:i.compact}]),onKeydown:[t[2]||(t[2]=n((...o)=>s.closeOptionsAndStop&&s.closeOptionsAndStop(...o),["esc"])),t[3]||(t[3]=n(a((...o)=>s.onUp&&s.onUp(...o),["stop","prevent"]),["up"])),t[4]||(t[4]=n(a((...o)=>s.onDown&&s.onDown(...o),["stop","prevent"]),["down"]))],onFocusout:t[5]||(t[5]=a((...o)=>s.onFocusOut&&s.onFocusOut(...o),["stop"])),onMousedown:t[6]||(t[6]=(...o)=>s.onMousedown&&s.onMousedown(...o))},[i.useCustomListBox?p(e.$slots,"listBox",{key:0},void 0,!0):(l(),u("div",T,[c("div",{ref:"toggle",role:"button",tabindex:"0",class:f({placeholder:!i.modelValue.length}),onClick:t[0]||(t[0]=(...o)=>s.toggle&&s.toggle(...o)),onKeydown:t[1]||(t[1]=n(a((...o)=>s.toggle&&s.toggle(...o),["prevent"]),["space"]))},m(s.summary),35),b(O,{class:"icon"})])),E(c("div",{class:"options",style:M(s.optionsHeight)},[(l(!0),u(v,null,S(i.possibleValues,(o,y)=>(l(),B(g,{ref_for:!0,ref:"option",key:`multiselect-${o.id}`,"data-index":y,"model-value":s.isChecked(o.id),disabled:o.disabled,class:"boxes","onUpdate:modelValue":V=>s.onUpdateModelValue(o.id,V)},{default:D(()=>[N(m(o.text),1)]),_:2},1032,["data-index","model-value","disabled","onUpdate:modelValue"]))),128)),p(e.$slots,"selectAction",{},void 0,!0)],4),[[C,s.showOptions]])],34)}const R=x(P,[["render",U],["__scopeId","data-v-51403833"]]);export{R as M};
