import{_ as o,o as a,j as r,w as s,u as d,b as i,C as f,ai as h,N as c}from"./index-DdvEyJbO.js";const l={name:"ExpandTransition",props:{isExpanded:{type:Boolean,default:!1}},methods:{onBeforeEnter(e){e.style.height=0},onEnter(e){e.style.height=`${e.scrollHeight}px`},onAfterEnter(e){e.style.height=""},onBeforeLeave(e){e.style.height=`${e.scrollHeight}px`,getComputedStyle(e).height},onLeave(e){e.style.height=0}}},E={class:"panel"};function p(e,_,n,v,B,t){return a(),r(c,{name:"expand",onBeforeEnter:t.onBeforeEnter,onEnter:t.onEnter,onBeforeLeave:t.onBeforeLeave,onLeave:t.onLeave,onAfterEnter:t.onAfterEnter},{default:s(()=>[d(i("div",E,[f(e.$slots,"default",{},void 0,!0)],512),[[h,n.isExpanded]])]),_:3},8,["onBeforeEnter","onEnter","onBeforeLeave","onLeave","onAfterEnter"])}const x=o(l,[["render",p],["__scopeId","data-v-a832694d"]]);export{x as E};
