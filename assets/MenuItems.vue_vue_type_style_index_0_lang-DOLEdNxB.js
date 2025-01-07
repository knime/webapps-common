import{A as X}from"./arrow-next-B5EO9UA4.js";import{j as k,i as L,o as f,c as I,b as N,t as F,n as _,m as x,F as K,_ as P,l as g,w as T,s as R,d as v,H as U,B as z,ao as Y,$ as Z,ap as ee,ai as te,ah as ne,ag as se,aj as oe,r as G,g as ie,h as j,u as q,a3 as ae}from"./index-DlYP37kD.js";import{C as le}from"./Checkbox-BOcXzBqH.js";const ue=(n,e)=>(n%e+e)%e,M=n=>{n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation()},re=({getNextElement:n,getFirstElement:e,getLastElement:o,close:t,disableSpaceToClick:h})=>{const l=k(null),p=()=>{};let u=p;const d=()=>{l.value=null,u=p},m=r=>{l.value=r.index,u=r.onClick},w=r=>{m(n(l.value,r))},C=()=>{d(),t()};return{onKeydown:r=>{switch(r.code){case"ArrowDown":M(r),w(1);break;case"ArrowUp":M(r),w(-1);break;case"Enter":case"Space":{const S=r.code==="Enter",E=r.code==="Space";l.value!==null&&(S||E&&!h)&&(M(r),u());break}case"Home":e&&m(e());break;case"End":o&&m(o());break;case"Escape":M(r),C();break;case"Tab":C();break}},currentIndex:l,resetNavigation:d}},de={key:0,class:"hotkey"},me=L({__name:"BaseMenuItemText",props:{text:{},hotkeyText:{},useMaxMenuWidth:{type:Boolean}},setup(n){return(e,o)=>(f(),I(K,null,[N("span",{class:_(["text",{truncate:e.useMaxMenuWidth}])},F(e.text),3),e.hotkeyText?(f(),I("span",de,F(e.hotkeyText),1)):x("",!0)],64))}}),V=P(me,[["__scopeId","data-v-d1dee545"]]),ce={class:"label"},fe={class:"text-and-hotkey"},he={key:0,class:"description"},pe=L({__name:"BaseMenuItem",props:{item:{},index:{},hasFocus:{type:Boolean},useMaxMenuWidth:{type:Boolean}},setup(n){const e=t=>t.to?"nuxt-link":t.href?"a":"button",o=t=>t.href&&t.download?{download:typeof t.download=="boolean"?"":t.download}:null;return(t,h)=>(f(),g(R(e(t.item)),z({ref:"listItemComponent",tabindex:"-1",class:["list-item",t.item.sectionHeadline?"section-headline":"clickable-item",{disabled:t.item.disabled,selected:t.item.selected,focused:t.hasFocus}],to:t.item.to||void 0,href:t.item.href||void 0},o(t.item)),{default:T(()=>[t.item.icon?(f(),g(R(t.item.icon),{key:0,class:"item-icon"})):x("",!0),N("div",ce,[N("div",fe,[t.item.checkbox?(f(),g(le,{key:0,"model-value":t.item.checkbox.checked,class:"checkbox"},{default:T(()=>[v(V,{text:t.item.text,"use-max-menu-width":t.useMaxMenuWidth,"hotkey-text":t.item.hotkeyText},null,8,["text","use-max-menu-width","hotkey-text"])]),_:1},8,["model-value"])):(f(),I(K,{key:1},[v(V,{text:t.item.text,"use-max-menu-width":t.useMaxMenuWidth,"hotkey-text":t.item.hotkeyText},null,8,["text","use-max-menu-width","hotkey-text"]),U(t.$slots,"submenu",{itemElement:t.$refs.listItemComponent},void 0,!0)],64))]),t.item.description?(f(),I("div",he,F(t.item.description),1)):x("",!0)])]),_:3},16,["class","to","href"]))}}),J=P(pe,[["__scopeId","data-v-387522db"]]);function Ie(n){return!("$el"in n)}const be={name:"BaseMenuItems",components:{BaseMenuItem:J},props:{items:{type:Array,required:!0},focusedItemIndex:{required:!1,type:Number,default:null},menuAriaLabel:{type:String,required:!0},id:{default:()=>`__BaseMenuItems-${Y()}__`,type:String},maxMenuWidth:{type:Number,default:null},positionRelativeToElement:{type:Object,default:null},clippingBoundary:{type:Object,default:document==null?void 0:document.body}},emits:["item-click","item-focused","item-hovered"],setup(n){const e=k([]),o=Z(n,"positionRelativeToElement"),t=k(null);ee(()=>{e.value=[]});const{floatingStyles:h}=o.value?te(o,t,{strategy:"fixed",placement:"right-start",middleware:[ne({boundary:n.clippingBoundary}),se({boundary:n.clippingBoundary})],whileElementsMounted:oe}):{floatingStyles:null};return{listContainerFloatingStyles:h,listContainer:t,listItems:e}},computed:{useMaxMenuWidth(){return!!this.maxMenuWidth},enabledItemsIndices(){return this.items.map((n,e)=>({item:n,index:e})).filter(({item:n})=>!n.disabled).map(({index:n})=>n)}},watch:{focusedItemIndex:{immediate:!0,handler(){this.emitItemFocused()}},items:{deep:!0,handler(){this.emitItemFocused()}}},expose:["getEnabledListItems","scrollTo"],methods:{updateItem(n,e){this.listItems[e]=n},getEnabledListItems(){return this.listItems.map((e,o)=>{const t=e.children[0];return{element:e,index:o,onClick:Ie(t)?()=>t.click():()=>t.$el.click()}}).filter(({index:e})=>this.enabledItemsIndices.includes(e))},scrollTo(n){const e=this.$refs.listContainer;if(e&&e.scrollHeight>e.clientHeight){const o=e.clientHeight+e.scrollTop,t=n.offsetTop+n.offsetHeight;t>o?e.scrollTop=t-e.clientHeight:n.offsetTop<e.scrollTop&&(e.scrollTop=n.offsetTop)}},menuItemId(n){return`menu-item-${this.id}-${n}`},onPointerEnter(n,e,o){this.$emit("item-hovered",e.disabled||e.sectionHeadline?null:e,this.id,o)},onItemClick(n,e,o){var h;if(e.disabled||e.sectionHeadline||(h=e.children)!=null&&h.length)return;if(!(e.href||e.to)&&(n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation()),e.checkbox){const l=!e.checkbox.checked;e.checkbox.setBoolean(l);return}this.$emit("item-click",n,e,o)},emitItemFocused(){if(this.focusedItemIndex===null){this.$emit("item-focused",null,null);return}const n=this.focusedItemIndex;this.$emit("item-focused",this.menuItemId(n),this.items[n])}}},ye=["aria-label"],ke=["data-index","title","onClick","onPointerenter"];function ge(n,e,o,t,h,l){const p=G("BaseMenuItem");return f(),I("ul",{ref:"listContainer","aria-label":o.menuAriaLabel,class:"base-menu-items",style:j(t.listContainerFloatingStyles),role:"menu",tabindex:"-1",onPointerleave:e[0]||(e[0]=u=>n.$emit("item-hovered",null,o.id))},[(f(!0),I(K,null,ie(o.items,(u,d)=>(f(),I("li",{key:d,ref_for:!0,ref:m=>l.updateItem(m,d),"data-index":d,class:_([{separator:u.separator}]),style:j(l.useMaxMenuWidth?{"max-width":`${o.maxMenuWidth}px`}:{}),title:u.title,onClick:m=>l.onItemClick(m,u,o.id),onPointerenter:m=>l.onPointerEnter(m,u,d)},[U(n.$slots,"item",{item:u,index:d,menuId:o.id,menuItemId:l.menuItemId,maxMenuWidth:o.maxMenuWidth,focusedItemIndex:o.focusedItemIndex},()=>[v(p,{id:l.menuItemId(d),item:u,index:d,"use-max-menu-width":!!o.maxMenuWidth,"has-focus":d===o.focusedItemIndex},null,8,["id","item","index","use-max-menu-width","has-focus"])],!0)],46,ke))),128))],44,ye)}const xe=P(be,[["render",ge],["__scopeId","data-v-c7432d19"]]),Be=L({__name:"MenuItems",props:{items:{},menuAriaLabel:{},disableSpaceToClick:{type:Boolean,default:!1},registerKeydown:{type:Boolean,default:!1},clippingBoundary:{default:()=>document.body}},emits:["close","item-click","item-focused","item-hovered","close-submenu"],setup(n,{expose:e,emit:o}){const t=n,h=o,l=k(null),p=k(-1),u=k(null),d=(i,s)=>{if(!l.value)return{onClick:()=>{},index:-1};const c=l.value.getEnabledListItems();let a=c.map(({index:W})=>W).indexOf(i);a===-1&&s===-1&&(a=0);const H=ue(a+s,c.length),{element:A,index:b,onClick:B}=c[H];return l.value.scrollTo(A),{index:b,onClick:B}},{currentIndex:m,onKeydown:w,resetNavigation:C}=re({disableSpaceToClick:t.disableSpaceToClick,getNextElement:d,close:()=>h("close")}),D=(i=0)=>{m.value=i},r=i=>{var a;const s=t.items[i],c=s&&!s.disabled&&((a=s.children)==null?void 0:a.length);p.value=c?i:-1},S=i=>{switch(i.code){case"ArrowLeft":h("close-submenu");break;case"ArrowRight":r(m.value??0),ae(()=>{var s;(s=u.value)==null||s.focusIndex()});break}w(i)},E=(i,s,c)=>{i!==null&&r(c),h("item-hovered",i,s,c)},$=i=>{var c;p.value!==-1?(c=u.value)==null||c.onKeydown(i):S(i)};e({onKeydown:$,resetNavigation:C,focusIndex:D});const O=i=>!i.children||i.children.length===0?!1:!!i.children.find(({selected:s})=>s);return(i,s)=>{const c=G("MenuItems",!0);return f(),g(xe,z({ref_key:"baseMenuItems",ref:l},i.$attrs,{items:t.items,"menu-aria-label":t.menuAriaLabel,"focused-item-index":q(m),"clipping-boundary":i.clippingBoundary,onKeydown:s[5]||(s[5]=a=>t.registerKeydown&&$(a)),onItemClick:s[6]||(s[6]=(...a)=>i.$emit("item-click",...a)),onItemHovered:s[7]||(s[7]=(...a)=>E(...a)),onItemFocused:s[8]||(s[8]=(...a)=>i.$emit("item-focused",...a))}),{item:T(({item:a,menuId:H,menuItemId:A,index:b,maxMenuWidth:B,focusedItemIndex:W})=>[v(J,{id:A(b),item:a,index:b,"use-max-menu-width":!!B,"has-focus":b===W,class:"base-item"},{submenu:T(({itemElement:Q})=>[a.children&&a.children.length?(f(),I("span",{key:0,class:_(["sub-menu-indicator",{highlight:O(a)}])},[v(q(X),{class:"icon"}),p.value===b?(f(),g(c,{key:0,id:`${H}__sub${b}`,ref_key:"subLevelItems",ref:u,class:"menu-items-sub-level","menu-aria-label":`${a.text} sub menu`,items:a.children,"max-menu-width":B,"position-relative-to-element":Q,"clipping-boundary":i.clippingBoundary,"register-keydown":"",onClose:s[0]||(s[0]=y=>p.value=-1),onCloseSubmenu:s[1]||(s[1]=y=>p.value=-1),onItemClick:s[2]||(s[2]=(...y)=>i.$emit("item-click",...y)),onItemHovered:s[3]||(s[3]=(...y)=>i.$emit("item-hovered",...y)),onItemFocused:s[4]||(s[4]=(...y)=>i.$emit("item-focused",...y))},null,8,["id","menu-aria-label","items","max-menu-width","position-relative-to-element","clipping-boundary"])):x("",!0)],2)):x("",!0)]),_:2},1032,["id","item","index","use-max-menu-width","has-focus"])]),_:1},16,["items","menu-aria-label","focused-item-index","clipping-boundary"])}}});export{Be as _};
