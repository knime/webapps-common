import{B as k,C as f}from"./knimeColors-bc78b9c7.js";import{_ as n,o as h,c as d,v as c}from"./index-76afb58e.js";const u=k,y=f,_=Object.freeze(Object.defineProperty({__proto__:null,flowVariable:y,table:u},Symbol.toStringTag,{value:"Module"})),l=9,p=1.4,C={props:{type:{type:String,default:"table"},color:{type:String,default:""},filled:{type:Boolean,default:!0}},computed:{portSize(){return l},strokeWidth(){return p},trianglePath(){let[r,i,e,s]=[-l/2,-l/2,l/2,l/2];const a=Math.sqrt(5)/2,t=a/2+1/4;let{strokeWidth:o}=this;return r+=o/2,e-=o*a,i+=o*t,s-=o*t,`${r},${i} ${e},${0} ${r},${s}`},portColor(){return _[this.type]||this.color},fillColor(){return this.filled?this.portColor:"transparent"}}},S=["points","fill","stroke","stroke-width"],W=["r","fill","stroke","stroke-width"],g=["width","height","x","y","fill","stroke","stroke-width"];function w(r,i,e,s,a,t){return e.type==="table"?(h(),d("polygon",c({key:0,points:t.trianglePath,fill:t.fillColor,stroke:t.portColor,"stroke-width":t.strokeWidth},r.$attrs),null,16,S)):e.type==="flowVariable"?(h(),d("circle",c({key:1,r:t.portSize/2-t.strokeWidth/2,fill:t.fillColor,stroke:t.portColor,"stroke-width":t.strokeWidth},r.$attrs),null,16,W)):(h(),d("rect",c({key:2,width:t.portSize-t.strokeWidth,height:t.portSize-t.strokeWidth,x:-t.portSize/2+t.strokeWidth/2,y:-t.portSize/2+t.strokeWidth/2,fill:t.fillColor,stroke:t.portColor,"stroke-width":t.strokeWidth},r.$attrs),null,16,g))}const z=n(C,[["render",w]]);export{z as P};
