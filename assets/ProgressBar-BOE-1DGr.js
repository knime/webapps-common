import{_ as c,r as d,o as l,c as a,b as s,d as t}from"./index-DdvEyJbO.js";import{P as g}from"./ProgressBar-FyZhwECV.js";const _={components:{ProgressBar:g},data(){return{progress:0,progressing:!1,intervalId:null}},methods:{startProgress(){this.intervalId&&clearInterval(this.intervalId),this.progress=0,this.progressing=!0,this.intervalId=setInterval(()=>{this.progress<100?this.progress+=1:(clearInterval(this.intervalId),this.progressing=!1)},100)}}},p={class:"grid-container"},h={class:"grid-item-12"},m=["disabled"],u=s("br",null,null,-1),v={class:"grid-container"},b={class:"grid-item-12"},P=s("div",{class:"grid-item-6"},[s("p",null,"Progress bar")],-1),f={class:"grid-item-6"},I=s("br",null,null,-1),B={class:"grid-container"},k={class:"grid-item-12"},w=s("div",{class:"grid-item-6"},[s("p",null,"Progress bar with compact mode")],-1),x={class:"grid-item-6"},C=s("br",null,null,-1),N={class:"grid-container"},V={class:"grid-item-12"},E=s("div",{class:"grid-item-6"},[s("p",null,"Progress bar with indeterminate progress")],-1),S={class:"grid-item-6"},j=s("br",null,null,-1),q={class:"grid-container"},y={class:"grid-item-12"},z=s("div",{class:"grid-item-6"},[s("p",null,"Indeterminate progress bar with compact mode")],-1),A={class:"grid-item-6"};function D(F,i,G,H,e,o){const r=d("ProgressBar",!0);return l(),a("div",null,[s("section",null,[s("div",p,[s("div",h,[s("button",{disabled:e.progressing,onClick:i[0]||(i[0]=(...n)=>o.startProgress&&o.startProgress(...n))}," Start progress ",8,m)])]),u,s("div",v,[s("div",b,[P,s("div",f,[t(r,{percentage:e.progress},null,8,["percentage"])])])]),I,s("div",B,[s("div",k,[w,s("div",x,[t(r,{percentage:e.progress,compact:!0},null,8,["percentage"])])])]),C,s("div",N,[s("div",V,[E,s("div",S,[t(r,{percentage:e.progress,indeterminate:!0},null,8,["percentage"])])])]),j,s("div",q,[s("div",y,[z,s("div",A,[t(r,{percentage:e.progress,indeterminate:!0,compact:!0},null,8,["percentage"])])])])])])}const L=c(_,[["render",D]]);export{L as default};
