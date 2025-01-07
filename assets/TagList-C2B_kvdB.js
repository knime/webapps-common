import{C as R}from"./CodeExample-BNmL0nwg.js";import{a7 as $,a8 as D,a9 as F,aa as K,ab as N,ac as I,i as G,o as g,c as k,H as M,l as C,u as V,ad as j,m as A,n as H,_ as B,j as L,Z,$ as z,U as T,F as U,g as Y,w as _,e as m,t as y,k as b,v as S,a3 as q,r as x,b as c,d as w}from"./index-DlYP37kD.js";import{S as J,c as Q}from"./_cacheHas-D5dt8Aoy.js";import{b as W}from"./_baseIndexOf-BTknn6Gb.js";function X(e,a){var n=e==null?0:e.length;return!!n&&W(e,a,0)>-1}var E=$?$.isConcatSpreadable:void 0;function ee(e){return D(e)||F(e)||!!(E&&e&&e[E])}function ae(e,a,n,h,s){var o=-1,r=e.length;for(n||(n=ee),s||(s=[]);++o<r;){var u=e[o];n(u)&&K(s,u)}return s}var te=200;function ne(e,a,n,h){var s=-1,o=X,r=!0,u=e.length,f=[],v=a.length;if(!u)return f;a.length>=te&&(o=Q,r=!1,a=new J(a));e:for(;++s<u;){var d=e[s],t=d;if(d=d!==0?d:0,r&&t===t){for(var l=v;l--;)if(a[l]===t)continue e;f.push(d)}else o(a,t,h)||f.push(d)}return f}var se=N(function(e,a){return I(e)?ne(e,ae(a,1,I)):[]});const ie=G({__name:"Tag",props:{clickable:{type:Boolean,default:!1},active:{type:Boolean,default:!1}},setup(e){return(a,n)=>(g(),k("span",{tabindex:"0",class:H(["tag",{clickable:a.clickable,active:a.active}])},[M(a.$slots,"default",{},void 0,!0),a.clickable&&a.active?(g(),C(V(j),{key:0,class:"checkmark"})):A("",!0)],2))}}),O=B(ie,[["__scopeId","data-v-5cae68ff"]]),le={key:0,class:"wrapper"},oe=5,ce=G({__name:"TagList",props:{numberOfInitialTags:{default:oe},tags:{default:()=>[]},activeTags:{default:()=>[]},clickable:{type:Boolean,default:!1},showAll:{type:Boolean,default:!1},sortByActive:{type:Boolean,default:!1}},emits:["click","update:showAll"],setup(e,{emit:a}){const n=e,h=a,s=L(!1);Z(z(n,"showAll"),t=>{s.value=t});const o=T(()=>{const{tags:t,sortByActive:l,activeTags:i}=n;return l?[...i.map(p=>({name:p,isActive:!0})),...se(t,i).map(p=>({name:p,isActive:!1}))]:t.map(p=>({isActive:i.includes(p),name:p}))}),r=T(()=>s.value?o.value:o.value.slice(0,n.numberOfInitialTags)),u=T(()=>!s.value&&n.tags.length>n.numberOfInitialTags),f=t=>{n.clickable&&h("click",t)},v=L(),d=async t=>{var l,i;s.value=!0,h("update:showAll",!0),await q(),(i=(l=v.value)==null?void 0:l[t])==null||i.$el.focus()};return(t,l)=>t.tags.length?(g(),k("div",le,[(g(!0),k(U,null,Y(r.value,(i,p)=>(g(),C(O,{ref_for:!0,ref_key:"tagInstances",ref:v,key:p,active:i.isActive,clickable:t.clickable,onClick:b(P=>f(i.name),["prevent"]),onKeydown:S(b(P=>f(i.name),["stop","prevent"]),["enter"])},{default:_(()=>[m(y(i.name)+" ",1),M(t.$slots,"icon",{},void 0,!0)]),_:2},1032,["active","clickable","onClick","onKeydown"]))),128)),u.value?(g(),C(O,{key:0,class:"more-tags",clickable:"",onClick:l[0]||(l[0]=b(i=>d(r.value.length),["prevent","stop"])),onKeydown:l[1]||(l[1]=S(b(i=>d(r.value.length),["stop","prevent"]),["enter"]))},{default:_(()=>[m(" +"+y(t.tags.length-t.numberOfInitialTags),1)]),_:1})):A("",!0)])):A("",!0)}}),re=B(ce,[["__scopeId","data-v-0217a339"]]),ue="",de=`<TagList
  :tags="['Apple', 'Banana', 'Guanábana', 'Papaya', 'Mango', 'Granadilla']"
  :number-of-initial-tags="3"
  clickable
  activeTags="['Banana', 'Papaya']"
  @click="onTagClick"
/>`,pe={components:{TagList:re,CodeExample:R},data(){return{codeExample:de}},computed:{code(){return ue}},methods:{onTagClick(e){alert(`clicked tag: ${e}`)}}},fe=c("div",{class:"grid-container"},[c("div",{class:"grid-item-12"},[c("p",null,[m(" Displays a list of tags with support for only showing a maximal number of tags via the "),c("code",null,"numberOfInitialTags"),m(" prop. Optionally it is possible to display active tags. Tags can be clickable by enabling the "),c("code",null,"clickable"),m(" prop. ")])])],-1),ge={class:"grid-container"},me={class:"grid-item-12"},he={class:"grid-container"},ve={class:"grid-item-12"};function be(e,a,n,h,s,o){const r=x("TagList",!0),u=x("CodeExample");return g(),k("div",null,[c("section",null,[fe,c("div",ge,[c("div",me,[w(r,{tags:["Apple","Banana","Guanábana","Papaya","Mango","Granadilla"],"number-of-initial-tags":3,clickable:"","active-tags":"['Banana', 'Papaya']",onClick:o.onTagClick},null,8,["onClick"])])])]),c("section",null,[c("div",he,[c("div",ve,[w(u,{summary:"Show usage example"},{default:_(()=>[m(y(s.codeExample),1)]),_:1}),w(u,{summary:"Show TagList.vue source code"},{default:_(()=>[m(y(o.code),1)]),_:1})])])])])}const we=B(pe,[["render",be]]);export{we as default};
