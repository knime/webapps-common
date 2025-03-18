import{C as g}from"./CodeExample-oiKQAf57.js";import{_,o as l,c as d,b as t,n as m,m as c,h as f,t as u,r as v,d as s,w as y,e as x,p as k,f as V}from"./index-CnBV6_u3.js";import{Y as p,A as S}from"./knimeColors-Bti-OEOH.js";const w=p,D=S,C={name:"DonutChart",props:{value:{type:[Number,Object],required:!0},secondaryValue:{type:[Number,Object],default:0},maxValue:{type:Number,required:!0},acceptValuesLargerThanMax:{type:Boolean,default:!1},radius:{type:Number,default:50},innerRadius:{type:Number,default:30},displayValues:{type:Boolean,default:!1},additionalLabel:{type:String,default:null},animate:{type:Boolean,default:!0}},data(){return{backgroundStrokeOffset:.5,smallLabelFontSize:20,regularLabelFontSize:30,regularLabelMaxValue:999}},computed:{primarySegment(){return typeof this.value=="number"?{value:this.value,color:w}:this.value},secondarySegment(){return typeof this.secondaryValue=="number"?{value:this.secondaryValue,color:D}:this.secondaryValue},clippedValue(){const r=Math.max(0,this.primarySegment.value);return this.acceptValuesLargerThanMax?r:Math.min(r,this.maxValue)},secondaryClippedValue(){const r=Math.max(0,this.secondarySegment.value+this.clippedValue);return this.acceptValuesLargerThanMax?r:Math.min(r,this.maxValue)},strokeWidth(){return this.radius-this.innerRadius},backgroundStrokeWidth(){return this.strokeWidth-this.backgroundStrokeOffset},r(){return this.radius-this.strokeWidth/2},diameter(){return 2*this.radius},viewBox(){return`0 0 ${this.diameter} ${this.diameter}`},circumference(){return 2*Math.PI*this.r},strokeDashOffset(){return this.calcStrokeDashOffset(this.clippedValue)},secondaryStrokeDashOffset(){return this.calcStrokeDashOffset(this.secondaryClippedValue)},transformWedge(){return`rotate(-90, ${this.radius}, ${this.radius})`},displayLabel(){return!!(this.displayValues&&this.additionalLabel)},maxValueString(){return Number.isFinite(this.maxValue)?String(this.maxValue):"∞"},containerStyle(){return`width: ${this.diameter}px; height: ${this.diameter}px;`},labelStyle(){const r=this.clippedValue>this.regularLabelMaxValue,n=Number.isFinite(this.maxValue)&&this.maxValue>this.regularLabelMaxValue,a=r||n?this.smallLabelFontSize:this.regularLabelFontSize;return`font-size: ${a}px; line-height: ${a}px;`},disabled(){return!Number.isFinite(this.maxValue)}},methods:{calcStrokeDashOffset(r){if(this.maxValue<=0||!Number.isFinite(this.maxValue))return this.circumference;const n=Math.min(r/this.maxValue*this.circumference,this.circumference);return Math.max(this.circumference-n,0)}}},L=["height","width","viewBox"],O=["cx","cy","r"],B=["cx","cy","r"],M=["height","width","viewBox"],N=["cx","cy","r","stroke-width"],E=["cx","cy","r","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],F=["cx","cy","r","stroke","stroke-width","stroke-dasharray","stroke-dashoffset","transform"],I={class:"label-container"},W={key:1,class:"additional-label"};function z(r,n,a,b,o,e){return l(),d("div",{class:"donut-container",style:f(e.containerStyle)},[e.disabled?(l(),d("svg",{key:0,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"disabled-circle",cx:a.radius,cy:a.radius,r:a.radius-.5,"stroke-width":"1",fill:"transparent"},null,8,O),t("circle",{class:"disabled-inner-circle",cx:a.radius,cy:a.radius,r:a.innerRadius+.5,"stroke-width":"1",fill:"transparent"},null,8,B)],8,L)):(l(),d("svg",{key:1,height:e.diameter,width:e.diameter,viewBox:e.viewBox,class:"donut-chart"},[t("circle",{class:"background-circle",cx:a.radius,cy:a.radius,r:e.r,"stroke-width":e.backgroundStrokeWidth,fill:"transparent"},null,8,N),e.secondarySegment?(l(),d("circle",{key:0,class:m(["value-wedge",{animate:a.animate}]),cx:a.radius,cy:a.radius,r:e.r,stroke:e.secondarySegment.color,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.secondaryStrokeDashOffset,fill:"transparent",transform:e.transformWedge},null,10,E)):c("",!0),t("circle",{class:m(["value-wedge",{animate:a.animate}]),cx:a.radius,cy:a.radius,r:e.r,stroke:e.primarySegment.color,"stroke-width":e.strokeWidth,"stroke-dasharray":e.circumference,"stroke-dashoffset":e.strokeDashOffset,fill:"transparent",transform:e.transformWedge},null,10,F)],8,M)),t("div",I,[a.displayValues?(l(),d("div",{key:0,class:"value-label",style:f(e.labelStyle)},u(`${e.clippedValue} / ${e.maxValueString}`),5)):c("",!0),e.displayLabel?(l(),d("div",W,u(a.additionalLabel),1)):c("",!0)])],4)}const R=_(C,[["render",z],["__scopeId","data-v-5ddba22d"]]),A="",T=`<DonutChart
  :value="3"
  :max-value="5"
  display-values
  additional-label="some metric"
  :inner-radius="70"
  :radius="100"
/>`,Y={components:{DonutChart:R,CodeExample:g},data(){return{codeExample:T}},computed:{code(){return A}}},j=r=>(k("data-v-633de085"),r=r(),V(),r),q=j(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Displays a donut chart. It can display the current and max value as well as display an additional label. Also supports a secondary value to be displayed. Passed values can either be a number or an object containing the value and color. ")])])],-1)),P={class:"grid-container"},U={class:"grid-item-12 demo"},G={class:"grid-container"},H={class:"grid-item-12 demo"},J={class:"grid-container"},K={class:"grid-item-12"};function Q(r,n,a,b,o,e){const i=v("DonutChart",!0),h=v("CodeExample");return l(),d("div",null,[q,t("section",null,[t("div",P,[t("div",U,[s(i,{value:1,"max-value":6,"inner-radius":70,radius:100}),s(i,{value:2,"max-value":6,"inner-radius":70,radius:100,"display-values":""}),s(i,{value:3,"max-value":5,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100}),s(i,{value:8,"max-value":1/0,"display-values":"","additional-label":"some metric","inner-radius":70,radius:100,"accept-values-larger-than-max":""}),s(i,{value:{value:33,color:"hsl(206, 74%, 90%)"},"secondary-value":{value:33,color:"hsl(263, 40.4%, 77.6%)"},"display-values":"","additional-label":"custom colors","max-value":100,"inner-radius":70,radius:100})])])]),t("section",null,[t("div",G,[t("div",H,[s(i,{value:1,"max-value":6,radius:22.5,"inner-radius":11}),s(i,{value:2,"secondary-value":2.5,"max-value":6,radius:22.5,"inner-radius":11}),s(i,{value:3,"max-value":5,"additional-label":"some metric",radius:22.5,"inner-radius":11}),s(i,{value:8,"max-value":1/0,"additional-label":"some metric",radius:22.5,"inner-radius":11,"accept-values-larger-than-max":""})])])]),t("section",null,[t("div",J,[t("div",K,[s(h,{summary:"Show usage example"},{default:y(()=>[x(u(o.codeExample),1)]),_:1}),s(h,{summary:"Show DonutChart.vue source code"},{default:y(()=>[x(u(e.code),1)]),_:1})])])])])}const ee=_(Y,[["render",Q],["__scopeId","data-v-633de085"]]);export{ee as default};
