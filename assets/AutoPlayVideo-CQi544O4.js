import{i,j as n,o as s,c as r,b as e,k as l,l as p,w as d,u,A as _,m,d as h,e as v,t as y,p as f,f as g,_ as x}from"./index-7ysoRW6Q.js";import{C as V}from"./CodeExample-C--sA7Q5.js";const c=o=>(f("data-v-8aa644d5"),o=o(),g(),o),k={class:"grid-container"},B={class:"grid-item-12"},b=c(()=>e("p",null," Plays a video on render. Videos have a fixed aspect ratio 256:135 or 16:10 or 16:9. ",-1)),w={class:"toggle"},A={class:"examples"},P=c(()=>e("source",{src:"https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",type:"video/mp4"},null,-1)),C=`<AutoPlayVideo aspect-ratio="16:9">
  <source
    src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4"
    type="video/mp4"
  />
  </AutoPlayVideo>`,S=i({__name:"AutoPlayVideo",setup(o){const a=n(!1);return(I,t)=>(s(),r("section",null,[e("div",k,[e("div",B,[b,e("p",w,[e("a",{href:"#",onClick:t[0]||(t[0]=l(N=>a.value=!a.value,["prevent"]))},"Toggle AutoPlayVideo component")]),e("div",A,[a.value?(s(),p(u(_),{key:0,"aspect-ratio":"16:9"},{default:d(()=>[P]),_:1})):m("",!0)]),h(V,{summary:"Show usage example"},{default:d(()=>[v(y(C))]),_:1})])])]))}}),$=x(S,[["__scopeId","data-v-8aa644d5"]]);export{$ as default};
