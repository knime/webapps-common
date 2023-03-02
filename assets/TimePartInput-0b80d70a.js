import{D as h}from"./arrow-dropdown-5800a229.js";import{_ as f,r as c,o as d,c as m,b as u,n as V,l as v,d as p,y as a}from"./index-0daf2d62.js";const g=t=>Math.max(Math.floor(Math.log10(Math.abs(t))),0)+1;const I=200,E=50,N=1,_={components:{ArrowIcon:h},props:{modelValue:{default:0,type:[Number,String]},id:{type:String,default:null},min:{default:Number.MIN_SAFE_INTEGER,type:Number},max:{default:Number.MAX_SAFE_INTEGER,type:Number},minDigits:{default:0,type:Number},isValid:{default:!0,type:Boolean},inputClasses:{default:"",type:String}},emits:["update:modelValue","bounds"],data(){return{clicked:!1,hovered:!1,localValue:this.modelValue}},computed:{stepSize(){return N},inputClassList(){let t=this.inputClasses;return this.hovered&&(t+=" hover"),t}},watch:{modelValue:{handler(t){this.localValue=this.padValue(t)},immediate:!0}},spinnerArrowTimeout:null,spinnerArrowInterval:null,mounted(){this.initialValue=this.modelValue},methods:{limitBounds(t){return t<this.min?{type:"min",limit:this.min,input:t,value:this.min}:t>this.max?{type:"max",limit:this.max,input:t,value:this.max}:{value:t}},padValue(t){if(isNaN(t)||!t&&t!==0||t<0)return t;const e=t.toString(10);return this.minDigits<1?e:e.padStart(this.minDigits,"0")},getValue(){return parseInt(this.$refs.input.value,10)},onBlur(){this.localValue=this.padValue(this.modelValue)},onInput(t){const e=t.target.value,s=parseInt(e,10);if(e==="")this.localValue="";else{const l=s.toString(10).length;if(e==="")return;if(isNaN(s)||l>g(this.max)){this.$refs.input.value=this.padValue(this.localValue);return}}const r=this.limitBounds(s);r.type?this.$emit("bounds",r):this.$emit("update:modelValue",r.value)},validate(t){let e=!0,s;return t=typeof t>"u"?this.getValue():t,typeof t!="number"||isNaN(t)?(e=!1,s="Current value is not a number."):(this.min>t||this.max<t)&&(e=!1,s="Current value is outside allowed range."),{isValid:e,errorMessage:s}},changeValue(t){let e=this.getValue();this.validate(e).isValid||(e<this.min?e=this.min:e>this.max?e=this.max:e=this.initialValue);let s=e+t;if(s=Math.round(s*10)/10,this.validate(s).isValid)this.$refs.input.value=this.padValue(s),this.onInput({target:this.$refs.input});else{const r=this.limitBounds(s);r.type&&this.$emit("bounds",r)}},mouseEvent(t,e){clearTimeout(this.spinnerArrowInterval),clearInterval(this.spinnerArrowTimeout);let s=this.stepSize;if(e==="decrease"&&(s*=-1),t.type==="mousedown"){this.clicked=!0,this.spinnerArrowTimeout=setTimeout(()=>{this.spinnerArrowInterval=setInterval(()=>{this.changeValue(s)},E)},I);return}this.clicked&&(this.clicked=!1,this.changeValue(s))},toggleHover(){this.hovered=!this.hovered}}},y={class:"wrapper"},M=["id","value","min","max","step"],w={key:0,class:"invalid-marker"};function x(t,e,s,r,l,n){const o=c("ArrowIcon");return d(),m("div",y,[u("input",{id:s.id,ref:"input",type:"number",role:"spinButton",value:l.localValue,min:s.min,max:s.max,step:n.stepSize,class:V(n.inputClassList),onInput:e[0]||(e[0]=(...i)=>n.onInput&&n.onInput(...i)),onBlur:e[1]||(e[1]=(...i)=>n.onBlur&&n.onBlur(...i)),onMouseenter:e[2]||(e[2]=(...i)=>n.toggleHover&&n.toggleHover(...i)),onMouseleave:e[3]||(e[3]=(...i)=>n.toggleHover&&n.toggleHover(...i))},null,42,M),s.isValid?v("",!0):(d(),m("span",w)),u("span",{class:"increase",onMousedown:e[4]||(e[4]=a(i=>n.mouseEvent(i,"increase"),["prevent"])),onMouseup:e[5]||(e[5]=a(i=>n.mouseEvent(i,"increase"),["prevent"])),onMouseleave:e[6]||(e[6]=i=>n.mouseEvent(i,"increase"))},[p(o)],32),u("span",{class:"decrease",onMousedown:e[7]||(e[7]=a(i=>n.mouseEvent(i,"decrease"),["prevent"])),onMouseup:e[8]||(e[8]=a(i=>n.mouseEvent(i,"decrease"),["prevent"])),onMouseleave:e[9]||(e[9]=i=>n.mouseEvent(i,"decrease"))},[p(o)],32)])}const b=f(_,[["render",x],["__scopeId","data-v-0ecaf9cc"]]);export{b as T};
