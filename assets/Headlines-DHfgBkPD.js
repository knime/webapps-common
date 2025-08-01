import{C as i}from"./CodeExample-ytjrgJ7P.js";import{_ as s,r as d,o,c as t,b as e,d as r,w as c,e as h,t as p}from"./index-7x0lt_p4.js";const m=`<h1>Headline 1</h1>
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
`,u={components:{CodeExample:i},data(){return{codeExample:m}}},H={class:"grid-container"},_={class:"grid-item-12"};function v(g,n,x,f,a,w){const l=d("CodeExample");return o(),t("div",null,[n[0]||(n[0]=e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," There are seven pre-defined headline sizes. There is no need to use dedicated components. ")])])],-1)),n[1]||(n[1]=e("section",{class:"demo"},[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h1",null,"Headline 1"),e("h2",null,"Headline 2"),e("h3",null,"Headline 3"),e("h4",null,"Headline 4"),e("h5",null,"Headline 5"),e("h6",null,"Headline 6"),e("div",{class:"h7",role:"heading","aria-level":"7"},"Headline 7")])])],-1)),e("section",null,[e("div",H,[e("div",_,[r(l,{summary:"Show usage example"},{default:c(()=>[h(p(a.codeExample),1)]),_:1})])])])])}const k=s(u,[["render",v],["__scopeId","data-v-7624b557"]]);export{k as default};
