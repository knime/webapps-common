import{_ as r,o,c as s,b as n,n as c,t as d,u as i}from"./index-19536967.js";let t=0;const u={inject:{compactLabels:{default:!1}},props:{generateId:{type:Boolean,default:!0},idPrefix:{type:String,default:"comp"},text:{default:"",type:String},compact:{type:Boolean,default:!1}},computed:{labelFor(){return this.generateId?`${this.idPrefix}-${this.labelForId}`:null},labelId(){return this.generateId?`label-${this.labelFor}`:null},isCompact(){return this.compact||this.compactLabels}},beforeCreate(){t+=1,this.labelForId=t}},p={class:"label-wrapper"},_=["id","for","textContent"];function f(a,b,l,m,h,e){return o(),s("div",p,[n("label",{id:e.labelId,for:e.labelFor,class:c(["label-text",{compact:e.isCompact}]),textContent:d(l.text)},null,10,_),i(a.$slots,"default",{labelForId:e.labelFor},void 0,!0)])}const I=r(u,[["render",f],["__scopeId","data-v-1e38ac59"]]);export{I as L};
