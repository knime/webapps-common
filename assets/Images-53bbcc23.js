import{I as c}from"./ImagePreviews-d547cae6.js";import{C as r}from"./CodeExample-e13e6dfe.js";import{_ as g,o as p,c as l,b as o,d as a,w as d,e as u,t as v,r as t}from"./index-376170fd.js";const b="/webapps-common/assets/KNIME_Logo_gray-1765883b.svg",w="/webapps-common/assets/KNIME_Logo_white-23e517d4.svg",E="/webapps-common/assets/KNIME_Triangle-3e4f15d0.svg",I={components:{ImagePreviews:c,CodeExample:r},data(){return{codeExample:`<img src="~webapps-common/ui/assets/img/KNIME_Logo_gray.svg">

or e.g. inline as base64 in CSS:

<style>
.foo {
  background: url("~webapps-common/ui/assets/img/KNIME_Logo_gray.svg?data") no-repeat 50% 50%;
}
</style>`}},computed:{images(){const e=Object.assign({"../ui/assets/img/KNIME_Logo_gray.svg":b,"../ui/assets/img/KNIME_Logo_white.svg":w,"../ui/assets/img/KNIME_Triangle.svg":E});return Object.keys(e).map(s=>({name:s.replace("../ui/assets/img/",""),src:e[s]}))}}},h={class:"grid-container"},x={class:"grid-item-12"},f=o("h2",null,"Images",-1);function N(e,s,y,K,i,m){const n=t("ImagePreviews"),_=t("CodeExample");return p(),l("section",null,[o("div",h,[o("div",x,[f,a(n,{images:m.images,width:"200px",height:"auto",checkerboard:""},null,8,["images"]),a(_,{summary:"Show usage example"},{default:d(()=>[u(v(i.codeExample),1)]),_:1})])])])}const k=g(I,[["render",N]]);export{k as default};
