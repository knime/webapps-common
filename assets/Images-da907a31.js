import{I as c}from"./ImagePreviews-026b3650.js";import{C as _}from"./CodeExample-ee2511aa.js";import{_ as g,r as o,o as p,c as l,b as a,d as t,w as d,e as u,t as v}from"./index-84c9b40b.js";const b="/webapps-common/assets/KNIME_Logo_gray-1765883b.svg",w="/webapps-common/assets/KNIME_Logo_white-23e517d4.svg",E="/webapps-common/assets/KNIME_Triangle-3e4f15d0.svg",I={components:{ImagePreviews:c,CodeExample:_},data(){return{codeExample:`<img src="~webapps-common/ui/assets/img/KNIME_Logo_gray.svg">

or e.g. inline as base64 in CSS:

<style>
.foo {
  background: url("~webapps-common/ui/assets/img/KNIME_Logo_gray.svg?data") no-repeat 50% 50%;
}
</style>`}},computed:{images(){const e=Object.assign({"../ui/assets/img/KNIME_Logo_gray.svg":b,"../ui/assets/img/KNIME_Logo_white.svg":w,"../ui/assets/img/KNIME_Triangle.svg":E});return Object.keys(e).map(s=>({name:s.replace("../ui/assets/img/",""),src:e[s]}))}}},x={class:"grid-container"},f={class:"grid-item-12"};function h(e,s,N,y,i,m){const n=o("ImagePreviews"),r=o("CodeExample");return p(),l("section",null,[a("div",x,[a("div",f,[t(n,{images:m.images,width:"200px",height:"auto",checkerboard:""},null,8,["images"]),t(r,{summary:"Show usage example"},{default:d(()=>[u(v(i.codeExample),1)]),_:1})])])])}const L=g(I,[["render",h]]);export{L as default};
