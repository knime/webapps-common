import{C as o}from"./CodeExample-82751790.js";import{_ as d,o as i,c as t,b as e,d as c,w as r,e as h,t as p,r as _,p as m,f as u}from"./index-3d337762.js";const v=`<h1>Headline 1</h1>
<h2>Headline 2</h2>
<h3>Headline 3</h3>
<h4>Headline 4</h4>
<h5>Headline 5</h5>
<h6>Headline 6</h6>
<!-- HTML does not know a h7 element, but we can use the following;
cf. https://www.w3.org/WAI/GL/wiki/Using_role%3Dheading#Example_2 -->
<div
  class="h7"
  role="heading"
  aria-level="7"
>
  Headline 7
</div>
`,H={components:{CodeExample:o},data(){return{codeExample:v}}},n=a=>(m("data-v-7624b557"),a=a(),u(),a),g=n(()=>e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," There are seven pre-defined headline sizes. There is no need to use dedicated components. ")])])],-1)),x=n(()=>e("section",{class:"demo"},[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h1",null,"Headline 1"),e("h2",null,"Headline 2"),e("h3",null,"Headline 3"),e("h4",null,"Headline 4"),e("h5",null,"Headline 5"),e("h6",null,"Headline 6"),e("div",{class:"h7",role:"heading","aria-level":"7"},"Headline 7")])])],-1)),f={class:"grid-container"},w={class:"grid-item-12"};function E(a,C,b,I,s,S){const l=_("CodeExample");return i(),t("div",null,[g,x,e("section",null,[e("div",f,[e("div",w,[c(l,{summary:"Show usage example"},{default:r(()=>[h(p(s.codeExample),1)]),_:1})])])])])}const T=d(H,[["render",E],["__scopeId","data-v-7624b557"]]);export{T as default};
