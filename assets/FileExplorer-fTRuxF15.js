import{B as S,G as de,J as xe,E as _,u as X,W as We,X as te,H as K,Z as Ye,P as qe,$ as ze,o as R,c as $,x as U,d as N,h as Ge,a0 as p,_ as J,b as m,n as G,j as L,w as O,l as P,k as Se,F as me,t as le,I as Xe,q as V,a1 as ie,r as Ce,p as ge,f as fe,a2 as Q,a3 as Je,m as ee,g as je,a4 as _e,e as F,y as Ze,a5 as Qe,a6 as Re}from"./index-C9vqjUQ1.js";import{C as ae}from"./Checkbox-BfgAW5hu.js";import{B as et}from"./Button-BDGZ-sSG.js";import{O as tt,D as nt}from"./Dropdown-B1IWX9Fc.js";import{g as ce}from"./navigator-DMd1zw5x.js";import{o as ot,u as st,_ as at,a as lt}from"./MenuItems.vue_vue_type_script_setup_true_lang-hsolBkxc.js";import{F as it}from"./folder-BpbTagkr.js";import{F as rt}from"./file-text-B1ImqHiT.js";import{u as ct}from"./useClickOutside-Fww3O3mT.js";import"./arrow-dropdown-CseSplwP.js";import"./arrow-next-DUOdSYwJ.js";const ut=["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Enter"],dt=(t=ut)=>{const o=S(!1),e=a=>{t.includes(a.key)&&(o.value=!0)},c=()=>{o.value=!1};return de(()=>{document.addEventListener("keydown",e),document.addEventListener("mousedown",c)}),xe(()=>{document.removeEventListener("keydown",e),document.removeEventListener("mousedown",c)}),o},mt=/[*?#:";<>%~|/\\]/,gt=255,ft="Name is already in use",pt=t=>{const o=w=>w.trim(),e=_(()=>o(t.name.value)),c=_(()=>e.value.startsWith(".")),a=_(()=>e.value.endsWith(".")),s=_(()=>!c.value&&!a.value&&!mt.test(e.value)&&e.value.length<=gt),i=_(()=>!t.blacklistedNames.value.includes(e.value)),h=_(()=>s.value&&i.value),b=_(()=>c.value?"Name cannot start with a dot (.)":a.value?"Name cannot end with a dot (.)":s.value?i.value?"":t.unavailableNameMessage||ft:'Name contains invalid characters *?#:";<>%~|/\\ or exceeds 255 characters');return{isValid:h,errorMessage:b,cleanedName:e}},ue=()=>({anchorHistory:[],anchorExceptions:[],selectionRanges:[]}),H=(t,o)=>({...t,...o}),vt=(t,o)=>{const{selectionRanges:e}=t;if(e.length===1){const[c]=e,{from:a,to:s}=c;if(a===s&&a===o)return!1}return e.length!==0},Ee=(t,o)=>{const{selectionRanges:e,anchorExceptions:c}=t;return!!e.find(s=>s.from<=o&&s.to>=o)&&!c.includes(o)},ht=(t,o)=>{const{anchorHistory:e,selectionRanges:c,anchorExceptions:a}=t,s=H(t,{anchorHistory:[...e,o]}),i=Ee(t,o);if(!i){const h={from:o,to:o},w=c.find(({from:D,to:E})=>D<=h.from&&h.to<=E)?c:[...c,h];return H(s,{selectionRanges:w,anchorExceptions:a.filter(D=>D!==o)})}return i?H(s,{anchorExceptions:[...a,o]}):t},bt=(t,o)=>{const{anchorHistory:e,selectionRanges:c,anchorExceptions:a}=t;if(c.length===0){const w={from:o,to:o};return H(t,{selectionRanges:[...c,w],anchorHistory:[...e,o]})}const[s]=e.slice(-1),i=a.filter(w=>{const D=Math.min(s,o),E=Math.max(s,o);return!(D<=w&&w<=E)}),h=H(t,{anchorExceptions:i});if(c.find(({from:w,to:D})=>w===s||D===s)){const w=c.map(({from:D,to:E})=>D===s||E===s?{from:Math.min(s,o),to:Math.max(s,o)}:{from:D,to:E});return H(h,{selectionRanges:w})}else{const w={from:Math.min(s,o),to:Math.max(s,o)};return H(h,{selectionRanges:[...c,w]})}},yt=t=>{const o={anchorExceptions:[],anchorHistory:[t],selectionRanges:[{from:t,to:t}]};return H(ue(),o)},wt=t=>{const{anchorExceptions:o,selectionRanges:e}=t;return o.reduce((a,s)=>{const i=a.find(({from:h,to:b})=>h<=s&&s<=b);if(i){const{from:h,to:b}=i;return a.reduce((D,E)=>{if(E.from===h&&E.to===b){const M=s===h,k=s===b,g={from:M?s:h,to:M?s:s-1},l={from:k?s:s+1,to:k?s:b};return D.concat(g,l)}return D.concat(E)},[])}return a},e).filter(a=>!o.includes(a.from)&&!o.includes(a.to))},Dt=t=>{const o=wt(t);if(o.length===0)return[];const e=o.sort((s,i)=>s.from===i.from?s.to-i.to:s.from-i.from),c=[];let a=e[0];for(let s=1;s<e.length;s++){const i=e[s];i.from<=a.to?a.to=Math.max(a.to,i.to):(c.push(a),a=i)}return c.push(a),c},It=t=>Dt(t).reduce((e,c)=>{const{to:a,from:s}=c,i=a-s,h=new Array(i).fill(0).reduce(b=>{const[w]=b.slice(-1);return b.concat(w+1)},[s]);return e.concat(h)},[]),Me=15,kt=-1/0,Ct=t=>{const o=S(ue()),e=S(kt),c=u=>Ee(o.value,u),a=_(()=>It(o.value)),s=u=>vt(o.value,u),i=(u=0)=>{const M=t.numberOfItems.value-1;e.value=Math.min(Math.max(u,t.startIndex.value),M),o.value=ue()},h=u=>{o.value=yt(u)},b=u=>{o.value=ht(o.value,u)},w=u=>{o.value=bt(o.value,u)},D=(u,M=null,k=!0)=>{if(t.disabled||u<t.startIndex.value||u>=t.numberOfItems.value)return;if(e.value=u,u===-1){i(-1);return}if(!M||t.singleSelectionOnly.value){h(u);return}const g=ce();if(M.shiftKey){w(u);return}if(M[g]){k&&b(u);return}h(u)};return{multiSelectionState:o,isSelected:c,selectedIndexes:a,isMultipleSelectionActive:s,resetSelection:i,handleSelectionClick:D,ctrlClickItem:b,handleKeyboardNavigation:u=>{if(!u)return;const M=ce();["Enter"," ","ArrowUp","ArrowDown","PageUp","PageDown","End","Home"].includes(u.key)&&(u.preventDefault(),(u[M]||u.shiftKey)&&u.stopPropagation());const g=Math.max(e.value,t.startIndex.value),l=t.numberOfItems.value-1;switch(u.key){case"ArrowUp":D(g-1,u,!1);break;case"PageUp":D(Math.max(g-Me,0),u,!1);break;case"PageDown":D(Math.min(g+Me,l),u,!1);break;case"End":D(l,u,!1);break;case"Home":D(0,u,!1);break;case"ArrowDown":D(g+1,u,!1);break;case"Enter":u[M]&&!t.singleSelectionOnly.value&&b(g);break;case" ":t.singleSelectionOnly.value||b(g);break}},focusedIndex:e}},Rt=X({__name:"FileExplorerContextMenu",props:{position:{},anchor:{},selectedItems:{}},emits:["itemClick","close"],setup(t,{emit:o}){We(I=>({"836eb018":I.$props.position.x,"836eb016":I.$props.position.y}));const e=t,{position:c}=te(e),a=_(()=>e.anchor.element),s=S(null),i=S(!0),h=_(()=>{var I,C;return((C=(I=s.value)==null?void 0:I.getBoundingClientRect())==null?void 0:C.height)??0});let b;de(()=>{var I;if(b=new IntersectionObserver(([C])=>{i.value=C.isIntersecting}),b.observe(e.anchor.element),i.value){const C=(I=s.value)==null?void 0:I.querySelector('[tabindex="-1"]');C==null||C.focus()}}),xe(()=>{b.disconnect()});const w=_(()=>{const I=a.value.getBoundingClientRect();return e.position.x-I.left}),D=_(()=>{const I=a.value.getBoundingClientRect(),C=e.position.y-I.top;return(window.innerHeight-e.position.y<h.value?C:C+h.value)*-1}),E=_(()=>[ot({mainAxis:D.value,crossAxis:w.value})]),{floatingStyles:u,update:M}=st(a,s,{placement:"top-start",strategy:"fixed",middleware:E,whileElementsMounted:lt});K(c,()=>M(),{deep:!0}),K(h,()=>{M()});const k=o,g=(I,C={})=>({id:"rename",text:"Rename",...C,disabled:!I.canBeRenamed||e.selectedItems.length>1||C.disabled||!1}),l=(I,C={})=>{const T=e.selectedItems.some(B=>!B.canBeDeleted);return{id:"delete",text:"Delete",...C,disabled:!I.canBeDeleted||T||C.disabled||!1}},v=I=>{const C=I,{id:T}=C,B=T==="rename",ne=T==="delete";B&&!e.anchor.item.canBeRenamed||ne&&!e.anchor.item.canBeDeleted||k("itemClick",{contextMenuItem:C,anchorItem:e.anchor.item,isDelete:ne,isRename:B})},r=_(()=>[g(e.anchor.item),l(e.anchor.item)]),A=()=>{k("close")};return Ye(s,A),(I,C)=>qe((R(),$("div",{ref_key:"menuWrapper",ref:s,style:Ge(p(u)),class:"menu-wrapper"},[U(I.$slots,"default",{items:r.value,createRenameOption:g,createDeleteOption:l,onItemClick:v},()=>[N(at,{"menu-aria-label":"File explorer context menu","register-keydown":"",items:r.value,onClose:A,onItemClick:C[0]||(C[0]=(T,B)=>v(B))},null,8,["items"])],!0)],4)),[[ze,i.value]])}}),Mt=J(Rt,[["__scopeId","data-v-c6c51645"]]),xt=X({props:{isSelected:{type:Boolean,required:!0},isDragging:{type:Boolean,required:!0}}}),St={class:"item-icon"};function _t(t,o,e,c,a,s){return R(),$("tr",{class:G(["file-explorer-item-base",{selected:!t.isDragging&&t.isSelected,dragging:t.isDragging&&t.isSelected}]),"data-test-id":"file-explorer-item"},[m("td",St,[U(t.$slots,"icon")]),U(t.$slots,"default")],2)}const Fe=J(xt,[["render",_t],["__scopeId","data-v-781c1900"]]),Et={key:0,class:"open-indicator"},Ft=["title"],$t={key:0},Bt={key:0,class:"item-error"},Ot=X({__name:"FileExplorerItem",props:{blacklistedNames:{},item:{},isSelected:{type:Boolean},isDragging:{type:Boolean},isRenameActive:{type:Boolean},isDraggingEnabled:{type:Boolean,default:!0}},emits:["dblclick","click","dragstart","dragenter","dragover","drag","dragleave","dragend","drop","contextmenu","rename:submit","rename:clear"],setup(t,{emit:o}){const e=t,c=l=>l.isDirectory?it:rt,{isRenameActive:a,blacklistedNames:s}=te(e),i=o,h=S(null),b=S(""),{isValid:w,errorMessage:D,cleanedName:E}=pt({blacklistedNames:s,name:b}),u=async()=>{var v,r;b.value=e.item.name,await ie();const l=(r=(v=h.value)==null?void 0:v.$refs)==null?void 0:r.input;l==null||l.setSelectionRange(0,b.value.length),l==null||l.focus()};K(a,async l=>{l&&await u()});const M=S(),k=async()=>{var l;await ie(),(l=M.value)==null||l.$el.focus()},g=(l,v=!1)=>{if(l.key==="Escape"&&(i("rename:clear"),k()),(l.key==="Enter"||v)&&w.value){const r=E.value,A=r===e.item.name;if(r===""||A){i("rename:clear"),k();return}i("rename:submit",{itemId:e.item.id,newName:r}),i("rename:clear"),k()}};return(l,v)=>(R(),L(Fe,{ref_key:"baseItem",ref:M,class:"file-explorer-item","is-dragging":l.isDragging,"is-selected":l.isSelected,draggable:l.isDraggingEnabled&&!p(a),onDragstart:v[3]||(v[3]=r=>!p(a)&&i("dragstart",r)),onDragenter:v[4]||(v[4]=r=>!p(a)&&i("dragenter",r)),onDragover:v[5]||(v[5]=r=>i("dragover",r)),onDragleave:v[6]||(v[6]=r=>!p(a)&&i("dragleave",r)),onDragend:v[7]||(v[7]=r=>!p(a)&&i("dragend",r)),onDrag:v[8]||(v[8]=r=>i("drag",r)),onClick:v[9]||(v[9]=r=>i("click",r)),onContextmenu:v[10]||(v[10]=V(r=>!p(a)&&i("contextmenu",r),["prevent"])),onDrop:v[11]||(v[11]=V(r=>!p(a)&&i("drop",r),["prevent"])),onDblclick:v[12]||(v[12]=r=>!p(a)&&i("dblclick",r))},{icon:O(()=>[l.item.isOpen?(R(),$("span",Et)):P("",!0),U(l.$slots,"icon",{},()=>[(R(),L(Se(c(l.item))))],!0)]),default:O(()=>[m("td",{class:G(["item-content",{light:!l.item.isDirectory,"rename-active":p(a)}]),title:l.item.name},[l.$slots.default?U(l.$slots,"default",{key:0,isRenameActive:p(a),isSelected:l.isSelected},void 0,!0):(R(),$(me,{key:1},[p(a)?(R(),L(p(tt),{key:1,onTrigger:v[2]||(v[2]=r=>g(r,!0))},{default:O(()=>[m("div",null,[N(Xe,{ref_key:"renameInput",ref:h,modelValue:b.value,"onUpdate:modelValue":v[0]||(v[0]=r=>b.value=r),class:"rename-input",type:"text",title:"rename","is-valid":p(w),onKeydown:v[1]||(v[1]=V(r=>g(r),["stop"]))},null,8,["modelValue","is-valid"]),p(w)?P("",!0):(R(),$("div",Bt,[m("span",null,le(p(D)),1)]))])]),_:1})):(R(),$("span",$t,le(l.item.name),1))],64))],10,Ft)]),_:3},8,["is-dragging","is-selected","draggable"]))}}),At=J(Ot,[["__scopeId","data-v-d2b56eb9"]]),Nt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Vt=m("path",{d:"M11.772 22.665 3.5 14.393l8.272-8.272M3.5 14.393h18.256m0 0a6.744 6.744 0 0 1 6.744 6.744v4.741"},null,-1),Ut=[Vt];function Pt(t,o){return R(),$("svg",Nt,[...Ut])}const Tt={render:Pt},Kt=X({components:{ArrowIcon:Tt,FileExplorerItemBase:Fe},props:{isDragging:{type:Boolean,required:!0}}}),Ht=t=>(ge("data-v-5d3949ff"),t=t(),fe(),t),Lt=Ht(()=>m("td",{class:"item-name hidden"},"Go back to parent directory",-1));function Wt(t,o,e,c,a,s){const i=Ce("ArrowIcon"),h=Ce("FileExplorerItemBase");return R(),L(h,{"is-dragging":t.isDragging,"is-selected":!1,class:"file-explorer-item-back",title:"Go back"},{icon:O(()=>[N(i,{class:"arrow-icon"})]),default:O(()=>[Lt]),_:1},8,["is-dragging"])}const Yt=J(Kt,[["render",Wt],["__scopeId","data-v-5d3949ff"]]),qt=t=>(ge("data-v-bda3ec24"),t=t(),fe(),t),zt=qt(()=>m("thead",null,[m("tr",null,[m("th",{scope:"col"},"Type"),m("th",{class:"name",scope:"col"},"Name")])],-1)),Gt={key:1,class:"empty"},Xt=X({__name:"FileExplorer",props:{mode:{default:"normal"},fullPath:{default:""},items:{},isRootFolder:{type:Boolean,default:!0},activeRenamedItemId:{default:null},disableContextMenu:{type:Boolean,default:!1},disableMultiSelect:{type:Boolean,default:!1},disableSelection:{type:Boolean,default:!1},disableDragging:{type:Boolean,default:!1},draggingAnimationMode:{default:"auto"},clickOutsideException:{default:null},selectedItemIds:{default:()=>[]}},emits:["update:selectedItemIds","changeDirectory","openFile","deleteItems","moveItems","dragend","drag","renameFile"],setup(t,{emit:o}){const e=t,c=o,a=n=>n.isDirectory,s=n=>n.isOpenableFile,i=n=>{c("changeDirectory",n)},h=S([]),b=S(null),w=S(null),D=Ct({singleSelectionOnly:Q(e,"disableMultiSelect"),numberOfItems:_(()=>e.items.length),startIndex:_(()=>b.value?-1:0),disabled:e.disableSelection}),{multiSelectionState:E,handleSelectionClick:u,handleKeyboardNavigation:M,isSelected:k,focusedIndex:g,selectedIndexes:l,isMultipleSelectionActive:v,resetSelection:r,ctrlClickItem:A}=D,I=_(()=>l.value.map(n=>e.items[n])),C=n=>{var d;return(d=h.value[n])==null?void 0:d.$el},T=n=>{var y;const d=n.map(Z=>e.items.findIndex(Le=>Le.id===Z)).filter(Z=>Z!==-1);if(d.every(k))return;r(),d.forEach(Z=>A(Z));const f=d.slice().sort().at(0)??-1,x=(y=h.value[f])==null?void 0:y.$el;x==null||x.scrollIntoView({behavior:"smooth",block:"center"})};K(Q(e,"selectedItemIds"),T),K(E,()=>{const n=I.value.map(d=>d.id);c("update:selectedItemIds",n)}),K(Q(e,"items"),n=>{g.value>=n.length&&r(g.value),T(e.selectedItemIds)},{immediate:!0});const B=S(null),ne=_(()=>e.items.filter(n=>n.id!==B.value).map(({name:n})=>n)),{activeRenamedItemId:$e}=te(e);K($e,()=>{B.value=e.activeRenamedItemId});const Be=S(null),pe=S(null),{isDragging:ve,onDragStart:Oe,onDragEnter:he,onDragOver:be,onDrag:Ae,onDragLeave:ye,onDragEnd:Ne,onDrop:we}=Je({itemBACK:_(()=>b.value?b.value.$el:null),itemRefs:_(()=>h.value?h.value.map(({$el:n})=>n):null),draggingAnimationMode:Q(e,"draggingAnimationMode"),isDirectory:a,items:te(e).items,multiSelection:D,shouldUseCustomDragPreview:_(()=>!pe.value&&e.draggingAnimationMode!=="disabled"),getCustomPreviewEl:()=>document.querySelector(".custom-preview")}),oe=(n,d)=>{d!==null&&c(n,d)},re=dt(["Tab"," ","ArrowUp","ArrowDown","PageUp","PageDown","End","Home"]),j=(n,d=!0)=>{var f,x;if(n===-1){(f=b.value)==null||f.$el.focus();return}if(e.items.length===0&&b.value){b.value.$el.focus();return}(x=C(n))==null||x.focus(),d&&(g.value=n)},Ve=n=>{var d;(d=w.value)!=null&&d.contains(n.relatedTarget)||j(g.value,!1)};K(g,async n=>{await ie(),j(n,!1)});const se=S(!1),Y=S({x:0,y:0}),q=S(null),z=(n=!0)=>{se.value=!1,q.value=null,n&&j(g.value,!1)},{fullPath:Ue}=te(e);K(Ue,async()=>{r(),z(),await ie(),j(0)});const De=(n,d,f)=>{const x=C(f);if(n instanceof MouseEvent)Y.value.x=n.clientX,Y.value.y=n.clientY;else{const y=x.getBoundingClientRect();Y.value.x=y.x+y.width*.8,Y.value.y=y.y+y.height/2}q.value={item:d,index:f,element:x},k(f)||u(f),se.value=!0},Ie=()=>{const n=I.value.length===0;I.value.some(f=>!f.canBeDeleted)||n||(c("deleteItems",{items:I.value}),r(g.value),j(g.value,!1))},Pe=(n,d)=>{n.canBeRenamed&&(k(d)||u(d),B.value=n.id)},Te=n=>{const{isDelete:d,isRename:f,anchorItem:x}=n;if(d){Ie(),z(!1);return}f&&(B.value=x.id),z(!1)},Ke=(n,d,f)=>{B.value!==n.id&&u(f,d),z(!1)},ke=n=>{if(a(n)){i(n.id);return}s(n)&&c("openFile",n)},He=(n,d)=>{const f=ce();n[f]||ke(d)};return ct({targets:[w,Q(e,"clickOutsideException")],callback:()=>r(g.value)}),(n,d)=>(R(),$("table",{ref_key:"table",ref:w,tabindex:"0",class:G({"keyboard-focus":p(re)}),"aria-label":"list of files in the current folder",onFocus:Ve,onKeydown:d[8]||(d[8]=(...f)=>p(M)&&p(M)(...f))},[zt,m("tbody",{class:G(n.mode)},[n.isRootFolder?P("",!0):(R(),L(Yt,{key:0,ref_key:"itemBack",ref:b,tabindex:"-1",class:G({"keyboard-focus":p(re)}),"is-dragging":p(ve),onDragenter:d[0]||(d[0]=f=>p(he)(f,-1,!0)),onDragleave:d[1]||(d[1]=f=>p(ye)(f,-1,!0)),onDragover:p(be),onDrop:d[2]||(d[2]=V(f=>oe("moveItems",p(we)(f,-1,!0)),["prevent"])),onKeydown:d[3]||(d[3]=ee(V(f=>i(".."),["stop","prevent"]),["enter"])),onClick:d[4]||(d[4]=f=>i(".."))},null,8,["class","is-dragging","onDragover"])),(R(!0),$(me,null,je(n.items,(f,x)=>(R(),L(At,{key:x,ref_for:!0,ref_key:"itemRefs",ref:h,tabindex:"-1",class:G({"keyboard-focus":p(re)}),item:f,title:f.name,"is-dragging":p(ve),"is-selected":p(k)(x),"is-rename-active":f.id===B.value,"blacklisted-names":ne.value,"is-dragging-enabled":!n.disableDragging,onDragstart:y=>p(Oe)(y,x),onDragenter:y=>p(he)(y,x),onDragover:p(be),onDragleave:y=>p(ye)(y,x),onDragend:y=>oe("dragend",p(Ne)(y,f)),onDrag:y=>oe("drag",p(Ae)(y,f)),onClick:y=>Ke(f,y,x),onContextmenu:y=>De(y,f,x),onKeydown:[ee(V(y=>De(y,f,x),["shift"]),["f10"]),ee(V(Ie,["stop","prevent"]),["delete"]),ee(V(y=>Pe(f,x),["stop","prevent"]),["f2"]),ee(V(y=>He(y,f),["prevent"]),["enter"])],onDrop:y=>oe("moveItems",p(we)(y,x)),onDblclick:y=>ke(f),"onRename:submit":d[5]||(d[5]=y=>c("renameFile",y)),"onRename:clear":d[6]||(d[6]=y=>B.value=null)},_e({_:2},[n.$slots.itemIcon?{name:"icon",fn:O(()=>[U(n.$slots,"itemIcon",{item:f},void 0,!0)]),key:"0"}:void 0,n.$slots.itemContent?{name:"default",fn:O(y=>[U(n.$slots,"itemContent",{item:f,isRenameActive:y.isRenameActive,isSelected:y.isSelected},void 0,!0)]),key:"1"}:void 0]),1032,["class","item","title","is-dragging","is-selected","is-rename-active","blacklisted-names","is-dragging-enabled","onDragstart","onDragenter","onDragover","onDragleave","onDragend","onDrag","onClick","onContextmenu","onKeydown","onDrop","onDblclick"]))),128)),n.items.length===0?(R(),$("tr",Gt,[m("td",null,[U(n.$slots,"emptyFolder",{},()=>[F("Folder is empty")],!0)])])):P("",!0)],2),n.draggingAnimationMode!=="disabled"?(R(),$("div",{key:0,ref_key:"customPreviewContainer",ref:Be,class:"custom-preview"},[U(n.$slots,"customDragPreview",{},()=>[m("div",{ref_key:"customDragPreviewPlaceholder",ref:pe},null,512)],!0)],512)):P("",!0),!e.disableContextMenu&&se.value&&q.value?(R(),L(Mt,{key:1,position:Y.value,anchor:q.value,"selected-items":I.value,onItemClick:Te,onClose:d[7]||(d[7]=()=>z())},{default:O(f=>[U(n.$slots,"contextMenu",Ze({isContextMenuVisible:se.value,position:Y.value,anchor:q.value,closeContextMenu:()=>z(),isMultipleSelectionActive:p(v)(q.value.index)},f),void 0,!0)]),_:3},8,["position","anchor","selected-items"])):P("",!0)],34))}}),Jt=J(Xt,[["__scopeId","data-v-bda3ec24"]]),W=t=>(ge("data-v-1f7f3bb9"),t=t(),fe(),t),jt={class:"grid-container"},Zt={class:"grid-item-12 options"},Qt={class:"grid-container"},en={class:"grid-item-6"},tn=W(()=>m("div",null," The FileExplorer has built-in custom behavior when handling drag operations. When an item is dropped in an invalid target, the ghost will animate back to the original position. However, there are exceptions to this behavior which are controlled by the animation modes. ",-1)),nn={key:0},on=W(()=>m("ul",null,[m("li",null," When dropping an item to a directory (aka a move), the ghosts will be automatically removed, as if the move was successful "),m("li",null," When dropping an item to an element outside the FileExplorer, if said element handles drag events (prevents browser defaults), then the ghosts will be automatically removed because the component assumes the drop was successful ")],-1)),sn={key:1},an=W(()=>m("ul",null,[m("li",null,[F(" When dropping an item to a directory (aka a move) the ghosts will NOT be removed. Instead the consumer will have to call an "),m("code",null,"onComplete"),F(" callback provided in the "),m("strong",null,"drop"),F(" event payload to determine whether the move was successful or not. (Useful for async operations) ")]),m("li",null,[F(" Similarly, when dropping an item to an element outside the FileExplorer the ghosts will also NOT be removed unless the "),m("code",null,"onComplete"),F(" provided in the "),m("strong",null,"dragend"),F(" event is called and stating whether dropping on this external element is valid or not ")])],-1)),ln={key:2},rn=W(()=>m("ul",null,[m("li",null," This mode will disable the custom drag ghosts and revert to using the native browser drag ghosts. "),m("li",null,"This will also disable the custom preview feature")],-1)),cn={class:"grid-item-6"},un={class:"demo"},dn={class:"grid-container"},mn={class:"grid-item-6 wrapper"},gn=W(()=>m("div",{class:"custom-preview-element"},"I am a custom drag preview",-1)),fn={class:"custom-context-menu"},pn={class:"menu-footer"},vn=["onClick"],hn={key:0},bn={class:"grid-item-6"},yn=W(()=>m("strong",null,"Output:",-1)),wn=W(()=>m("br",null,null,-1)),Dn=X({__name:"FileExplorer",setup(t){const o=[{id:"0",name:"Folder 1",meta:{type:"Folder"},isDirectory:!0,isOpenableFile:!1,isOpen:!1,canBeRenamed:!0,canBeDeleted:!0},{id:"1",name:"Folder 2",meta:{type:"Folder"},isDirectory:!0,isOpenableFile:!1,isOpen:!1,canBeRenamed:!0,canBeDeleted:!0},{id:"2",name:"This item cannot be renamed",meta:{type:"Workflow"},isDirectory:!1,isOpenableFile:!0,isOpen:!1,canBeRenamed:!1,canBeDeleted:!0},{id:"3",name:"File 2 (openable)",meta:{type:"Workflow"},isDirectory:!1,isOpenableFile:!0,isOpen:!1,canBeRenamed:!0,canBeDeleted:!0},{id:"4",name:"File 3",meta:{type:"Component"},isDirectory:!1,isOpenableFile:!1,isOpen:!1,canBeRenamed:!0,canBeDeleted:!0},{id:"5",name:"File 3 (this item cannot be deleted)",meta:{type:"Metanode"},isDirectory:!1,isOpenableFile:!1,isOpen:!1,canBeRenamed:!0,canBeDeleted:!1}],e=Qe({disableContextMenu:!1,disableMultiSelect:!1,disableDragging:!1,useCustomContextMenu:!1}),c=S("auto"),a=S(null),s=S(!1),i=S(null),h=S(null),b=()=>{h.value?h.value=null:h.value="1"};de(()=>{i.value=a.value.getBoundingClientRect()});const w=({event:k})=>{const{clientX:g,clientY:l}=k,v=document.elementFromPoint(g,l),r=a.value===v;s.value=r},D=({anchor:k,onItemClick:g,createRenameOption:l,createDeleteOption:v})=>({render(){const r=this.items.map(A=>Re("li",{onClick:()=>{if(A.id==="custom-option"){window.alert("Rejoice! you clicked a custom context menu option");return}g(A)}},A.text));return Re("ul",r)},computed:{items(){const r=l(k.item),A=v(k.item);return[r,A,{id:"custom-option",text:"My awesome custom option"}]}}}),E=k=>{window.alert(`You renamed: >> ${JSON.stringify(k)}`)},u=k=>{window.alert(`You deleted: >> ${JSON.stringify(k)}`)},M=k=>{window.alert(`You opened: >> ${JSON.stringify(k)}`)};return(k,g)=>(R(),$(me,null,[m("section",null,[m("div",jt,[m("div",Zt,[N(p(ae),{modelValue:e.disableContextMenu,"onUpdate:modelValue":g[0]||(g[0]=l=>e.disableContextMenu=l)},{default:O(()=>[F(" Disable context menu ")]),_:1},8,["modelValue"]),N(p(ae),{modelValue:e.disableMultiSelect,"onUpdate:modelValue":g[1]||(g[1]=l=>e.disableMultiSelect=l)},{default:O(()=>[F(" Disable multi-select ")]),_:1},8,["modelValue"]),N(p(ae),{modelValue:e.disableDragging,"onUpdate:modelValue":g[2]||(g[2]=l=>e.disableDragging=l)},{default:O(()=>[F(" Disable dragging ")]),_:1},8,["modelValue"]),N(p(ae),{modelValue:e.useCustomContextMenu,"onUpdate:modelValue":g[3]||(g[3]=l=>e.useCustomContextMenu=l)},{default:O(()=>[F(" Custom context menu ")]),_:1},8,["modelValue"]),m("div",null,[F(" Toggle programmatic rename "),N(p(et),{compact:"",primary:"",onClick:b},{default:O(()=>[F(le(h.value?"Deactivate":"Activate"),1)]),_:1})])])]),m("div",Qt,[m("div",en,[tn,c.value==="auto"?(R(),$("span",nn,[F(" AUTO: "),on])):P("",!0),c.value==="manual"?(R(),$("span",sn,[F(" MANUAL: "),an])):P("",!0),c.value==="disabled"?(R(),$("span",ln,[F(" DISABLED: "),rn])):P("",!0)]),m("div",cn,[m("div",null,[F(" Dragging animation mode "),N(p(nt),{modelValue:c.value,"onUpdate:modelValue":g[4]||(g[4]=l=>c.value=l),ariaLabel:"A List","possible-values":[{id:"auto",text:"Auto"},{id:"manual",text:"Manual"},{id:"disabled",text:"Disabled"}]},null,8,["modelValue"])])])])]),m("section",un,[m("div",dn,[m("div",mn,[N(p(Jt),{"disable-context-menu":e.disableContextMenu,"disable-multi-select":e.disableMultiSelect,items:o,"disable-dragging":e.disableDragging,"dragging-animation-mode":c.value,"is-root-folder":!1,"active-renamed-item-id":h.value,onOpenFile:M,onDrag:w,onRenameFile:E,onDeleteItems:u},_e({_:2},[s.value?{name:"customDragPreview",fn:O(()=>[gn]),key:"0"}:void 0,e.useCustomContextMenu?{name:"contextMenu",fn:O(({createRenameOption:l,createDeleteOption:v,anchor:r,onItemClick:A,isMultipleSelectionActive:I,closeContextMenu:C})=>[m("div",fn,[(R(),L(Se(D({anchor:r,createRenameOption:l,createDeleteOption:v,onItemClick:A})))),m("div",pn,[m("button",{onClick:C}," click me to close the menu programmatically ",8,vn),e.disableMultiSelect?P("",!0):(R(),$("span",hn," You can also know inside the menu if the multi-selection is active: -> "+le(I),1))])])]),key:"1"}:void 0]),1032,["disable-context-menu","disable-multi-select","disable-dragging","dragging-animation-mode","active-renamed-item-id"])]),m("div",bn,[yn,wn,m("div",{ref_key:"customDragPreviewTarget",ref:a,dropzone:"copy",class:"custom-drag-preview-target",onDragover:g[5]||(g[5]=V(()=>{},["prevent"]))}," Drag an item from the file explorer over me to see something nice 😉 ",544)])])])],64))}}),Bn=J(Dn,[["__scopeId","data-v-1f7f3bb9"]]);export{Bn as default};
