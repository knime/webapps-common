import{I as n}from"./ImagePreviews-3709a0e1.js";import{C as c}from"./CodeExample-ab3ea217.js";import{_ as m,r as a,o as l,c as p,b as o,d as t,w as d,e as u,t as v}from"./index-19536967.js";const E="/assets/KNIME_Logo_gray-1765883b.svg",I="/assets/KNIME_Logo_white-23e517d4.svg",h="/assets/KNIME_Triangle-3e4f15d0.svg",b={components:{ImagePreviews:n,CodeExample:c},data(){return{codeExample:`<img src="~webapps-common/ui/assets/img/KNIME_Logo_gray.svg">

or e.g. inline as base64 in CSS:

<style>
.foo {
  background: url("~webapps-common/ui/assets/img/KNIME_Logo_gray.svg?data") no-repeat 50% 50%;
}
</style>`}},computed:{images(){const e=Object.assign({"../ui/assets/img/KNIME_Logo_gray.svg":E,"../ui/assets/img/KNIME_Logo_white.svg":I,"../ui/assets/img/KNIME_Triangle.svg":h});return Object.keys(e).map(s=>({name:s.replace("../ui/assets/img/",""),src:e[s]}))}}},x={class:"grid-container"},f={class:"grid-item-12"},w=o("h2",null,"Images",-1);function N(e,s,y,K,i,_){const r=a("ImagePreviews"),g=a("CodeExample");return l(),p("section",null,[o("div",x,[o("div",f,[w,t(r,{images:_.images,width:"200px",height:"auto",checkerboard:""},null,8,["images"]),t(g,{summary:"Show usage example"},{default:d(()=>[u(v(i.codeExample),1)]),_:1})])])])}const k=m(b,[["render",N]]);export{k as default};
