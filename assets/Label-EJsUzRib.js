import{_ as o,o as l,c as a,n as d,t as n,l as i,x as u}from"./index-G11fb1C6.js";let r=0;const b={inject:{largeLabels:{default:!1}},props:{generateId:{type:Boolean,default:!0},idPrefix:{type:String,default:"comp"},text:{default:"",type:String},large:{type:Boolean,default:!1},active:{type:Boolean,default:!0}},emits:["labelForId"],computed:{labelFor(){return this.generateId?`${this.idPrefix}-${this.labelForId}`:null},labelId(){return this.generateId?`label-${this.labelFor}`:null},isLarge(){return this.large||this.largeLabels}},beforeCreate(){r+=1,this.labelForId=r},mounted(){this.$emit("labelForId",this.labelFor)}},c={class:"label-wrapper"},f=["id","for","textContent"];function _(s,g,t,h,p,e){return l(),a("div",c,[t.active?(l(),a("label",{key:0,id:e.labelId,for:e.labelFor,class:d(["label-text",{large:e.isLarge}]),textContent:n(t.text)},null,10,f)):i("",!0),u(s.$slots,"default",{labelForId:e.labelFor},void 0,!0)])}const I=o(b,[["render",_],["__scopeId","data-v-df56b9bd"]]);export{I as L};
