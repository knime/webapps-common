import{B as x,_ as B,o as i,c as h,F as $,g as M,n as _,h as L,j as k,w as E,k as v,l as g,b as p,t as y,q as C,v as N,Q as A}from"./index-69379855.js";const b=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()},P=({getNextElement:e,close:t})=>{const s=x(null),d=x(null),m=()=>{s.value=null,d.value=null},o=a=>{const{element:f,index:u}=e(s.value,a);s.value=u,d.value=f};return{onKeydown:a=>{switch(a.code){case"ArrowDown":b(a),o(1);break;case"ArrowUp":b(a),o(-1);break;case"Enter":case"Space":d.value&&(b(a),d.value.click());break;case"Escape":case"Tab":m(),t();break}},currentIndex:s,resetNavigation:m}},H=(e,t)=>(e%t+t)%t,T={props:{items:{type:Array,required:!0},focusedItemIndex:{required:!1,type:Number,default:null},menuAriaLabel:{type:String,required:!0},id:{default:"",type:String},maxMenuWidth:{type:Number,default:null}},emits:["item-click","arrow-down","arrow-up","item-focused","item-hovered"],computed:{useMaxMenuWidth(){return Boolean(this.maxMenuWidth)},enabledItemsIndices(){return this.items.map((e,t)=>({item:e,index:t})).filter(({item:e})=>!e.disabled).map(({index:e})=>e)}},watch:{focusedItemIndex:{immediate:!0,handler(e){this.$emit("item-focused",e===null?null:this.menuItemId(e))}}},expose:["getEnabledListItems"],methods:{getEnabledListItems(){return this.$refs.listItem.map((t,s)=>({element:t.$el||t,index:s})).filter(({index:t})=>this.enabledItemsIndices.includes(t))},linkTagByType(e){return e.to?"nuxt-link":e.href?"a":"button"},menuItemId(e){return`menu-item-${this.id}-${e}`},onItemClick(e,t){if(t.disabled||t.sectionHeadline)return;!(t.href||t.to)&&(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()),this.$emit("item-click",e,t,this.id)}}};const W=["aria-label"],D=["title","onClick","onPointerenter"],S={class:"label"},q={key:0,class:"hotkey"};function j(e,t,s,d,m,o){return i(),h("ul",{"aria-label":s.menuAriaLabel,role:"menu",tabindex:"0",onPointerleave:t[0]||(t[0]=n=>e.$emit("item-hovered",null,s.id))},[(i(!0),h($,null,M(s.items,(n,a)=>(i(),h("li",{key:a,class:_([{separator:n.separator}]),style:L(o.useMaxMenuWidth?{"max-width":`${s.maxMenuWidth}px`}:{}),title:n.title,onClick:f=>o.onItemClick(f,n),onPointerenter:f=>e.$emit("item-hovered",n.disabled||n.sectionHeadline?null:n,s.id)},[(i(),k(v(o.linkTagByType(n)),{id:o.menuItemId(a),ref_for:!0,ref:"listItem",tabindex:"-1",class:_(["list-item",n.sectionHeadline?"section-headline":"clickable-item",{disabled:n.disabled,selected:n.selected,focused:a===s.focusedItemIndex}]),to:n.to||null,href:n.href||null},{default:E(()=>[n.icon?(i(),k(v(n.icon),{key:0,class:"item-icon"})):g("",!0),p("div",S,[p("span",{class:_(["text",{truncate:o.useMaxMenuWidth}])},y(n.text),3),n.hotkeyText?(i(),h("span",q,y(n.hotkeyText),1)):g("",!0)])]),_:2},1032,["id","class","to","href"]))],46,D))),128))],40,W)}const z=B(T,[["render",j],["__scopeId","data-v-eeb7d73b"]]),X=C({__name:"MenuItems",props:{items:null,menuAriaLabel:null},emits:["close","item-click","item-focused","item-hovered"],setup(e,{expose:t,emit:s}){const d=e,m=x(null),o=(u,r)=>{const l=m.value.getEnabledListItems();let c=l.map(({index:w})=>w).indexOf(u);c===-1&&r===-1&&(c=0);const I=H(c+r,l.length);return l[I]},{currentIndex:n,onKeydown:a,resetNavigation:f}=P({getNextElement:o,close:()=>s("close")});return t({onKeydown:a,resetNavigation:f}),(u,r)=>(i(),k(z,N({ref_key:"menuItemsBase",ref:m},u.$attrs,{items:d.items,"menu-aria-label":d.menuAriaLabel,"focused-item-index":A(n),onItemClick:r[0]||(r[0]=(l,c,I)=>u.$emit("item-click",l,c,I)),onItemHovered:r[1]||(r[1]=(l,c)=>u.$emit("item-hovered",l,c)),onItemFocused:r[2]||(r[2]=l=>u.$emit("item-focused",l))}),null,16,["items","menu-aria-label","focused-item-index"]))}}),F={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},K=p("path",{d:"M15.267 25.94H4.445V6.06h10.822m6.85 4.503L27.555 16l-5.438 5.437M27.555 16h-12"},null,-1),V=[K];function O(e,t){return i(),h("svg",F,V)}const Y={render:O},Q={xmlns:"http://www.w3.org/2000/svg",stroke:"#000",viewBox:"0 0 32 32"},U=p("path",{fill:"none","stroke-linejoin":"round",d:"M15.9 27.6 4.5 15.9c-2.6-2.6-2.6-6.9 0-9.5s6.9-2.6 9.5 0l1.9 2.1 2-2.1c2.6-2.6 6.9-2.6 9.5 0s2.6 6.9 0 9.5L15.9 27.6z"},null,-1),G=[U];function J(e,t){return i(),h("svg",Q,G)}const Z={render:J};export{Z as H,Y as L,X as _};
