import{D as l}from"./arrow-dropdown-1dc426b7.js";import{_ as c,a0 as _,r as n,o as u,c as f,d as o,w as a,u as t,b as x,n as m,y as E}from"./index-69379855.js";import{E as B}from"./ExpandTransition-083fb15d.js";const h={components:{DropdownIcon:l,BaseButton:_,ExpandTransition:B},props:{initiallyExpanded:{type:Boolean,default:!1}},data(){return{isExpanded:this.initiallyExpanded}},methods:{onTrigger(){this.isExpanded=!this.isExpanded}}},w={class:"dropdown"};function C(s,v,g,y,e,d){const i=n("DropdownIcon"),r=n("BaseButton"),p=n("ExpandTransition");return u(),f("div",null,[o(r,{class:"button","aria-expanded":String(e.isExpanded),onClick:E(d.onTrigger,["prevent"])},{default:a(()=>[t(s.$slots,"title",{},void 0,!0),x("div",w,[o(i,{class:m(["dropdown-icon",{flip:e.isExpanded}])},null,8,["class"])])]),_:3},8,["aria-expanded","onClick"]),o(p,{"is-expanded":e.isExpanded},{default:a(()=>[t(s.$slots,"default",{},void 0,!0)]),_:3},8,["is-expanded"])])}const I=c(h,[["render",C],["__scopeId","data-v-eaf78300"]]);export{I as C};
