import{C as X}from"./CodeExample-cb0879f3.js";import{o as s,c as l,b as e,z as Q,_ as G,j as e1,k as t1,e as k,t as $,l as O,r as D,d as x,w as P}from"./index-01285c81.js";import{F as n1}from"./file-text-41c4396a.js";/**
 * filesize
 *
 * @copyright 2022 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 10.0.6
 */const o1="array",i1="bit",R="bits",s1="byte",Y="bytes",f="",l1="exponent",c1="function",T="iec",h1="Invalid number",r1="Invalid rounding method",w="jedec",a1="object",U=".",K="round",d1="s",f1="kbit",m1="kB",Z=" ",q="string",v1="0",S={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function u1(t,{bits:o=!1,pad:a=!1,base:c=-1,round:d=2,locale:h=f,localeOptions:m={},separator:v=f,spacer:M=Z,symbols:V={},standard:r=f,output:z=q,fullform:B=!1,fullforms:b=[],exponent:y=-1,roundingMethod:F=K,precision:_=0}={}){let i=y,p=Number(t),n=[],u=0,E=f;c===-1&&r.length===0?(c=10,r=w):c===-1&&r.length>0?(r=r===T?T:w,c=r===T?2:10):(c=c===2?2:10,r=c===10||r===w?w:T);const I=c===10?1e3:1024,J=B===!0,j=p<0,H=Math[F];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(h1);if(typeof H!==c1)throw new TypeError(r1);if(j&&(p=-p),(i===-1||isNaN(i))&&(i=Math.floor(Math.log(p)/Math.log(I)),i<0&&(i=0)),i>8&&(_>0&&(_+=8-i),i=8),z===l1)return i;if(p===0)n[0]=0,E=n[1]=S.symbol[r][o?R:Y][i];else{u=p/(c===2?Math.pow(2,i*10):Math.pow(1e3,i)),o&&(u=u*8,u>=I&&i<8&&(u=u/I,i++));const g=Math.pow(10,i>0?d:0);n[0]=H(u*g)/g,n[0]===I&&i<8&&y===-1&&(n[0]=1,i++),E=n[1]=c===10&&i===1?o?f1:m1:S.symbol[r][o?R:Y][i]}if(j&&(n[0]=-n[0]),_>0&&(n[0]=n[0].toPrecision(_)),n[1]=V[n[1]]||n[1],h===!0?n[0]=n[0].toLocaleString():h.length>0?n[0]=n[0].toLocaleString(h,m):v.length>0&&(n[0]=n[0].toString().replace(U,v)),a&&Number.isInteger(n[0])===!1&&d>0){const g=v||U,N=n[0].toString().split(g),L=N[1]||f,C=L.length,W=d-C;n[0]=`${N[0]}${g}${L.padEnd(C+W,v1)}`}return J&&(n[1]=b[i]?b[i]:S.fullform[r][i]+(o?i1:s1)+(n[0]===1?f:d1)),z===o1?n:z===a1?{value:n[0],symbol:n[1],exponent:i,unit:E}:n.join(M)}function A({bits:t=!1,pad:o=!1,base:a=-1,round:c=2,locale:d=f,localeOptions:h={},separator:m=f,spacer:v=Z,symbols:M={},standard:V=f,output:r=q,fullform:z=!1,fullforms:B=[],exponent:b=-1,roundingMethod:y=K,precision:F=0}={}){return _=>u1(_,{bits:t,pad:o,base:a,round:c,locale:d,localeOptions:h,separator:m,spacer:v,symbols:M,standard:V,output:r,fullform:z,fullforms:B,exponent:b,roundingMethod:y,precision:F})}const _1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},p1=e("path",{fill:"#000",stroke:"none",d:"M11.936 25.375a1.231 1.231 0 0 1-.843.252 1.055 1.055 0 0 1-.931-.467 2.4 2.4 0 0 1-.317-1.355v-.485a2.268 2.268 0 0 1 .34-1.331 1.111 1.111 0 0 1 .954-.454 1.141 1.141 0 0 1 .811.262 1.355 1.355 0 0 1 .344.853h.948a2.054 2.054 0 0 0-.643-1.391 2.116 2.116 0 0 0-1.459-.49 2.2 2.2 0 0 0-1.187.319 2.073 2.073 0 0 0-.788.91 3.2 3.2 0 0 0-.274 1.365v.512a3.169 3.169 0 0 0 .282 1.325 2.03 2.03 0 0 0 .769.882 2.136 2.136 0 0 0 1.158.318 2.206 2.206 0 0 0 1.5-.491 1.975 1.975 0 0 0 .647-1.367h-.95a1.312 1.312 0 0 1-.361.833zm5.223-1.764a4.2 4.2 0 0 0-1.027-.433 3.189 3.189 0 0 1-.918-.392.6.6 0 0 1-.278-.5.665.665 0 0 1 .257-.557 1.159 1.159 0 0 1 .724-.2 1.114 1.114 0 0 1 .77.242.861.861 0 0 1 .269.672h.944a1.535 1.535 0 0 0-.256-.863 1.668 1.668 0 0 0-.7-.6 2.37 2.37 0 0 0-1.019-.21 2.184 2.184 0 0 0-1.4.429 1.335 1.335 0 0 0-.54 1.091 1.407 1.407 0 0 0 .749 1.227 4.478 4.478 0 0 0 1.053.443 3.069 3.069 0 0 1 .916.4.665.665 0 0 1 .254.558.655.655 0 0 1-.249.533 1.176 1.176 0 0 1-.747.2 1.354 1.354 0 0 1-.884-.256.886.886 0 0 1-.309-.723h-.952a1.519 1.519 0 0 0 .276.9 1.853 1.853 0 0 0 .775.607 2.675 2.675 0 0 0 1.093.22 2.271 2.271 0 0 0 1.424-.4 1.306 1.306 0 0 0 .524-1.089 1.451 1.451 0 0 0-.181-.735 1.618 1.618 0 0 0-.568-.564zm5.951-2.766-1.971 5.477h-.922l-1.963-5.477H19.3l1.376 4.284 1.393-4.284z",class:"text"},null,-1),x1=e("path",{d:"M5.813 29V3h15.152l5.222 5.222V29zM26.187 8.222h-5.222V3"},null,-1),z1=[p1,x1];function g1(t,o){return s(),l("svg",_1,z1)}const w1={render:g1},k1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},$1=e("path",{fill:"#000",stroke:"none",d:"M9.396 26.321v-5.477h1.618c.484 0 .913.107 1.288.323s.665.521.871.918c.206.396.308.85.308 1.361v.274c0 .52-.103.976-.31 1.369a2.176 2.176 0 0 1-.884.911c-.382.213-.82.319-1.314.319H9.396v.002zm.952-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.267-.312.403-.76.408-1.345v-.305c0-.594-.129-1.048-.388-1.361s-.633-.471-1.125-.471l-.665.001zm8.452 2.115c0 .537-.093 1.008-.278 1.413-.186.404-.451.716-.796.933s-.742.325-1.19.325c-.444 0-.839-.108-1.187-.325a2.129 2.129 0 0 1-.805-.928c-.189-.4-.285-.863-.288-1.388v-.309c0-.534.095-1.006.284-1.414.189-.409.457-.722.801-.938s.741-.325 1.187-.325.841.106 1.186.321.611.522.8.926c.188.402.283.87.286 1.404v.305zm-.952-.287c0-.606-.114-1.071-.344-1.396-.229-.323-.555-.484-.976-.484-.412 0-.733.161-.965.483s-.351.777-.355 1.367v.315c0 .603.117 1.067.352 1.396.234.329.56.493.976.493.421 0 .745-.16.973-.481.227-.321.34-.79.34-1.407v-.286h-.001zm6.079 1.099c-.056.585-.271 1.04-.647 1.367s-.876.491-1.501.491c-.436 0-.82-.104-1.152-.311-.333-.207-.589-.501-.77-.882s-.274-.824-.282-1.328v-.512c0-.517.092-.972.274-1.365.184-.394.446-.697.788-.91a2.202 2.202 0 0 1 1.188-.319c.604 0 1.091.163 1.459.49.369.327.583.791.644 1.391h-.948c-.045-.395-.16-.678-.344-.853-.185-.174-.455-.262-.811-.262-.414 0-.732.151-.954.454s-.335.746-.34 1.331v.485c0 .593.105 1.044.317 1.355s.522.467.931.467c.374 0 .655-.084.843-.252.188-.168.308-.447.357-.839h.948v.002zm2.735-1.715 1.15-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.182 2.009h-1.105l1.696-2.761-1.659-2.716h1.099l1.151 1.979z",class:"text"},null,-1),b1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),y1=[$1,b1];function I1(t,o){return s(),l("svg",k1,y1)}const T1={render:I1},M1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},V1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),B1=e("path",{fill:"#000",stroke:"none",d:"M12.797 20.844h.948v5.477h-.948v-2.43h-2.449v2.43h-.952v-5.477h.952v2.279h2.449v-2.279zm1.576.767h1.692v4.71h.944v-4.71h1.708v-.767h-4.344v.767zm7.876 3.43-1.58-4.197h-1.233v5.477h.947v-1.806l-.094-2.411 1.614 4.217h.681l1.617-4.221-.094 2.415v1.806h.947v-5.477h-1.229l-1.576 4.197zm4.883.52v-4.717h-.952v5.477h3.438v-.76h-2.486z",class:"text"},null,-1),F1=[V1,B1];function E1(t,o){return s(),l("svg",M1,F1)}const S1={render:E1},j1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H1=e("path",{fill:"#000",stroke:"none",d:"m11.825 20.845 1.58 4.197 1.576-4.197h1.23v5.477h-.948v-1.806l.094-2.415-1.618 4.221h-.681l-1.614-4.217.094 2.411v1.806h-.948v-5.477h1.235zm5.51 5.476v-5.477h1.617c.484 0 .913.107 1.288.323s.665.521.871.918.309.85.309 1.361v.274c0 .52-.104.976-.311 1.369a2.176 2.176 0 0 1-.884.911c-.383.213-.82.319-1.314.319h-1.576v.002zm.951-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.267-.312.402-.76.408-1.345v-.305c0-.594-.13-1.048-.388-1.361-.259-.313-.634-.471-1.125-.471l-.665.001z",class:"text"},null,-1),N1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),L1=[H1,N1];function C1(t,o){return s(),l("svg",j1,L1)}const O1={render:C1},D1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},P1=e("path",{fill:"#000",stroke:"none",d:"M13.235 23.726c0 .537-.093 1.008-.278 1.413a2.113 2.113 0 0 1-.796.933 2.188 2.188 0 0 1-1.19.325c-.444 0-.839-.108-1.187-.325a2.129 2.129 0 0 1-.805-.928c-.189-.4-.285-.863-.288-1.388v-.309c0-.534.095-1.006.284-1.414.189-.409.457-.722.801-.938s.741-.325 1.187-.325.842.106 1.187.321.611.522.799.926c.188.402.284.87.286 1.404v.305zm-.952-.287c0-.606-.115-1.071-.344-1.396-.229-.323-.555-.484-.976-.484-.412 0-.733.161-.965.483s-.35.778-.355 1.368v.315c0 .603.117 1.067.352 1.396.234.329.56.493.976.493.421 0 .746-.16.973-.481.227-.321.34-.79.34-1.407l-.001-.287zm1.9 2.882v-5.477h1.618c.484 0 .913.107 1.288.323s.665.521.871.918.309.85.309 1.361v.274c0 .52-.104.976-.311 1.369a2.176 2.176 0 0 1-.884.911c-.382.213-.82.319-1.314.319h-1.577v.002zm.952-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.267-.312.402-.76.408-1.345v-.305c0-.594-.13-1.048-.388-1.361-.258-.313-.633-.471-1.125-.471l-.665.001zm5.032 2.679v2.031h-.951v-5.477h2.095c.612 0 1.098.159 1.458.478.359.319.54.741.54 1.266 0 .537-.177.955-.529 1.254s-.846.448-1.479.448h-1.134zm0-.768h1.144c.339 0 .597-.079.775-.238s.267-.39.267-.69c0-.296-.09-.532-.271-.709s-.429-.268-.745-.273h-1.17v1.91z",class:"text"},null,-1),R1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),Y1=[P1,R1];function U1(t,o){return s(),l("svg",D1,Y1)}const A1={render:U1},G1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},K1=e("path",{fill:"#000",stroke:"none",d:"M13.375 23.726c0 .537-.093 1.008-.278 1.413a2.113 2.113 0 0 1-.796.933 2.188 2.188 0 0 1-1.19.325c-.444 0-.839-.108-1.187-.325a2.129 2.129 0 0 1-.805-.928c-.189-.4-.285-.863-.288-1.388v-.309c0-.534.095-1.006.284-1.414.189-.409.457-.722.801-.938s.741-.325 1.187-.325.842.106 1.187.321.611.522.799.926c.188.402.284.87.286 1.404v.305zm-.952-.287c0-.606-.115-1.071-.344-1.396-.229-.323-.555-.484-.976-.484-.412 0-.733.161-.965.483s-.351.778-.356 1.368v.315c0 .603.117 1.067.352 1.396.234.329.56.493.976.493.421 0 .746-.16.973-.481.227-.321.34-.79.34-1.407v-.287zm1.899 2.882v-5.477h1.618c.484 0 .913.107 1.288.323s.665.521.871.918c.205.396.308.85.308 1.361v.274c0 .52-.103.976-.31 1.369a2.178 2.178 0 0 1-.885.911c-.382.213-.82.319-1.314.319h-1.576v.002zm.952-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.268-.312.403-.76.408-1.345v-.305c0-.594-.129-1.048-.388-1.361-.258-.313-.633-.471-1.124-.471l-.666.001zm6.944 3.3c0-.241-.085-.427-.254-.558-.17-.13-.475-.262-.916-.395s-.793-.281-1.054-.443c-.499-.313-.748-.723-.748-1.227 0-.441.18-.805.539-1.091.36-.286.827-.429 1.401-.429.381 0 .721.07 1.02.21.299.141.533.341.703.601.171.26.256.547.256.863h-.947c0-.286-.09-.51-.27-.672-.179-.161-.436-.242-.77-.242-.311 0-.552.066-.724.199s-.258.318-.258.557c0 .2.093.368.278.502.186.135.491.265.918.392.427.126.769.271 1.027.433.258.161.447.347.567.557.12.209.181.454.181.735 0 .456-.175.819-.524 1.089s-.824.404-1.424.404c-.396 0-.761-.073-1.093-.22s-.591-.35-.775-.607a1.52 1.52 0 0 1-.276-.903h.952c0 .312.103.552.309.723.205.17.5.256.884.256.331 0 .58-.067.746-.201a.65.65 0 0 0 .252-.533z",class:"text"},null,-1),Z1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),q1=[K1,Z1];function J1(t,o){return s(),l("svg",G1,q1)}const W1={render:J1},X1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q1=e("path",{fill:"#000",stroke:"none",d:"M13.463 23.726c0 .537-.093 1.008-.278 1.413a2.113 2.113 0 0 1-.796.933 2.188 2.188 0 0 1-1.19.325c-.444 0-.839-.108-1.187-.325a2.129 2.129 0 0 1-.805-.928c-.189-.4-.285-.863-.288-1.388v-.309c0-.534.095-1.006.284-1.414.189-.409.457-.722.801-.938s.741-.325 1.187-.325.842.106 1.187.321.611.522.799.926c.188.402.284.87.286 1.404v.305zm-.952-.287c0-.606-.115-1.071-.344-1.396-.229-.323-.555-.484-.976-.484-.412 0-.733.161-.965.483s-.35.778-.355 1.368v.315c0 .603.117 1.067.352 1.396.234.329.56.493.976.493.421 0 .746-.16.973-.481.227-.321.34-.79.34-1.407v-.287h-.001zm1.9 2.882v-5.477h1.618c.484 0 .913.107 1.288.323s.665.521.871.918.309.85.309 1.361v.274c0 .52-.104.976-.311 1.369a2.176 2.176 0 0 1-.884.911c-.382.213-.82.319-1.314.319h-1.577v.002zm.952-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.267-.312.402-.76.408-1.345v-.305c0-.594-.13-1.048-.388-1.361-.258-.313-.633-.471-1.125-.471l-.665.001zm7.718 0h-1.707v4.71h-.944v-4.71h-1.692v-.767h4.344l-.001.767z",class:"text"},null,-1),e2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),t2=[Q1,e2];function n2(t,o){return s(),l("svg",X1,t2)}const o2={render:n2},i2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},s2=e("path",{fill:"#000",stroke:"none",d:"M10.233 24.29v2.031h-.951v-5.477h2.095c.612 0 1.098.159 1.458.478s.54.741.54 1.266c0 .537-.176.955-.529 1.254-.352.299-.846.448-1.48.448h-1.133zm0-.768h1.144c.338 0 .597-.079.775-.238s.267-.39.267-.69c0-.296-.09-.532-.271-.709-.18-.177-.429-.268-.745-.273h-1.17v1.91zm3.972 2.799v-5.477h1.618c.484 0 .913.107 1.288.323s.665.521.871.918.309.85.309 1.361v.274c0 .52-.104.976-.311 1.369a2.176 2.176 0 0 1-.884.911c-.382.213-.82.319-1.314.319h-1.577v.002zm.952-4.71v3.95h.621c.499 0 .882-.156 1.149-.469.267-.312.402-.76.408-1.345v-.305c0-.594-.13-1.048-.388-1.361-.258-.313-.633-.471-1.125-.471l-.665.001zM22.395 24H20.19v2.321h-.951v-5.477h3.479v.767H20.19v1.629h2.205V24z",class:"text"},null,-1),l2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),c2=[s2,l2];function h2(t,o){return s(),l("svg",i2,c2)}const r2={render:h2},a2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},d2=e("path",{fill:"#000",stroke:"none",d:"M10.348 24.29v2.031h-.952v-5.477h2.095c.612 0 1.098.159 1.458.478s.54.741.54 1.266c0 .537-.176.955-.529 1.254-.352.299-.846.448-1.48.448h-1.132zm0-.768h1.144c.338 0 .597-.079.775-.238s.267-.39.267-.69c0-.296-.09-.532-.271-.709-.18-.177-.429-.268-.745-.273h-1.17v1.91zm4.923.768v2.031h-.952v-5.477h2.095c.612 0 1.097.159 1.458.478.359.319.54.741.54 1.266 0 .537-.177.955-.529 1.254s-.846.448-1.479.448h-1.133zm0-.768h1.144c.338 0 .596-.079.775-.238.178-.159.267-.39.267-.69 0-.296-.09-.532-.271-.709s-.429-.268-.745-.273h-1.17V23.522zm7.93-1.911h-1.708v4.71h-.945v-4.71h-1.692v-.767h4.345v.767zm2.603 1.212 1.15-1.979h1.099l-1.655 2.717 1.693 2.761h-1.11l-1.177-2.009-1.182 2.009h-1.105l1.696-2.761-1.659-2.716h1.099l1.151 1.978z",class:"text"},null,-1),f2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),m2=[d2,f2];function v2(t,o){return s(),l("svg",a2,m2)}const u2={render:v2},_2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},p2=e("path",{fill:"#000",stroke:"none",d:"M12.583 24.29v2.031h-.952v-5.477h2.095c.612 0 1.098.159 1.458.478s.54.741.54 1.266c0 .537-.176.955-.529 1.254-.352.299-.846.448-1.48.448h-1.132zm0-.768h1.144c.338 0 .597-.079.775-.238s.267-.39.267-.69c0-.296-.09-.532-.271-.709-.18-.177-.429-.268-.745-.273h-1.17v1.91zm6.835 1.389c0-.241-.085-.427-.254-.558-.17-.13-.475-.262-.916-.395s-.792-.281-1.053-.443c-.499-.313-.749-.723-.749-1.227 0-.441.18-.805.54-1.091s.827-.429 1.401-.429c.381 0 .721.07 1.02.21.299.141.533.341.703.601.171.26.256.547.256.863h-.947c0-.286-.09-.51-.27-.672-.179-.161-.436-.242-.77-.242-.311 0-.552.066-.724.199a.665.665 0 0 0-.257.557c0 .2.093.368.278.502.186.135.491.265.917.392.427.126.769.271 1.027.433.258.161.447.347.567.557.12.209.181.454.181.735 0 .456-.175.819-.524 1.089s-.824.404-1.424.404c-.396 0-.76-.073-1.093-.22a1.853 1.853 0 0 1-.775-.607 1.52 1.52 0 0 1-.276-.903h.952c0 .312.103.552.309.723.206.17.5.256.884.256.331 0 .58-.067.746-.201a.651.651 0 0 0 .251-.533z",class:"text"},null,-1),x2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),z2=[p2,x2];function g2(t,o){return s(),l("svg",_2,z2)}const w2={render:g2},k2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},$2=e("path",{fill:"#000",stroke:"none",d:"m11.658 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H9.371l1.696-2.761-1.659-2.716h1.098l1.152 1.979zm3.942 2.739h2.486v.76h-3.438v-5.477h.952v4.717zm6.079-.651c0-.241-.085-.427-.254-.558-.169-.13-.475-.262-.916-.395s-.792-.281-1.053-.443c-.499-.313-.749-.723-.749-1.227 0-.441.18-.805.54-1.091.359-.286.827-.429 1.401-.429.381 0 .721.07 1.02.21.298.142.532.342.703.602.17.26.256.547.256.863h-.948c0-.286-.09-.51-.269-.672-.18-.161-.437-.242-.77-.242-.311 0-.553.066-.725.199a.665.665 0 0 0-.257.557c0 .2.093.368.278.502.186.135.491.265.918.392.426.126.769.271 1.026.433.259.161.447.347.568.557.12.209.181.454.181.735 0 .456-.176.819-.525 1.089s-.824.404-1.424.404c-.396 0-.76-.073-1.093-.22a1.844 1.844 0 0 1-.774-.607 1.512 1.512 0 0 1-.276-.903h.951c0 .312.104.552.309.723.206.17.5.256.884.256.331 0 .58-.067.747-.201a.652.652 0 0 0 .251-.534z",class:"text"},null,-1),b2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),y2=[$2,b2];function I2(t,o){return s(),l("svg",k2,y2)}const T2={render:I2},M2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},V2=e("path",{fill:"#000",stroke:"none",d:"m11.683 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H9.396l1.696-2.761-1.659-2.716h1.098l1.152 1.979zm3.942 2.739h2.486v.76h-3.438v-5.477h.952v4.717zm6.078-.651c0-.241-.085-.427-.254-.558-.169-.13-.475-.262-.916-.395s-.792-.281-1.053-.443c-.499-.313-.749-.723-.749-1.227 0-.441.18-.805.54-1.091.359-.286.827-.429 1.401-.429.381 0 .721.07 1.02.21.298.141.532.341.703.601.17.26.256.547.256.863h-.948c0-.286-.09-.51-.269-.672-.18-.161-.437-.242-.77-.242-.311 0-.553.066-.725.199a.665.665 0 0 0-.257.557c0 .2.093.368.278.502.186.135.491.265.918.392.426.126.769.271 1.026.433.259.161.447.347.568.557.12.209.181.454.181.735 0 .456-.176.819-.525 1.089s-.824.404-1.424.404c-.396 0-.76-.073-1.093-.22a1.844 1.844 0 0 1-.774-.607 1.512 1.512 0 0 1-.276-.903h.951c0 .312.104.552.309.723.206.17.5.256.884.256.331 0 .58-.067.747-.201a.649.649 0 0 0 .251-.533zm3.671-2.088 1.151-1.979h1.099l-1.655 2.716 1.692 2.761h-1.109l-1.178-2.009-1.181 2.009h-1.106l1.696-2.761-1.658-2.716h1.098l1.151 1.979z",class:"text"},null,-1),B2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),F2=[V2,B2];function E2(t,o){return s(),l("svg",M2,F2)}const S2={render:E2},j2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H2=e("path",{fill:"#000",stroke:"none",d:"m10.558 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H8.271l1.696-2.761-1.659-2.716h1.098l1.152 1.979zm4.224-1.978 1.58 4.197 1.575-4.197h1.23v5.477h-.948v-1.806l.095-2.415-1.618 4.221h-.681l-1.614-4.217.094 2.411v1.806h-.948v-5.477h1.235zm6.461 4.717h2.486v.76h-3.437v-5.477h.951v4.717z",class:"text"},null,-1),N2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222V29zm0-20.778h-5.222V3"},null,-1),L2=[H2,N2];function C2(t,o){return s(),l("svg",j2,L2)}const O2={render:C2},D2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round","stroke-miterlimit":"10",viewBox:"0 0 32 32"},P2=e("path",{fill:"#000",stroke:"none",d:"M11.507 25.929h3.039v.789h-4.234v-.641l2.941-4.25h-2.922v-.797h4.121v.625l-2.945 4.274zm4.93.789h-.984V21.03h.984v5.688zm2.203-2.11v2.109h-.988V21.03h2.176c.636 0 1.141.166 1.514.497.374.331.561.769.561 1.313 0 .559-.183.992-.549 1.303-.365.31-.878.465-1.537.465H.64zm0-.796h1.188c.352 0 .62-.082.805-.248.186-.165.277-.404.277-.717 0-.307-.094-.553-.281-.736s-.445-.277-.773-.283H18.64v1.984z",class:"text"},null,-1),R2=e("path",{d:"m21.156 2.5 5.423 5.423h-5.423zm5.423 27H5.421v-27h15.735l5.423 5.423zM13 2.775v11.363m0-3.558h1.936M13 7.488h1.936M13 4.396h1.936m-3.872 7.73H13m-1.936-3.092H13m-1.936-3.092H13m-1.936 8.196v2.357c0 .557.867 1.009 1.936 1.009s1.936-.452 1.936-1.009v-2.357h-3.872z"},null,-1),Y2=[P2,R2];function U2(t,o){return s(),l("svg",D2,Y2)}const A2={render:U2},G2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round","stroke-miterlimit":"10",viewBox:"0 0 32 32"},K2=e("path",{fill:"#000",stroke:"none",d:"M12.94 24.179h-2.336v1.75h2.73v.789H9.616V21.03h3.691v.797h-2.703v1.57h2.336v.782zm3.157-1.094 1.195-2.055h1.141l-1.719 2.82 1.758 2.867H17.32l-1.223-2.086-1.227 2.086h-1.148l1.762-2.867-1.723-2.82h1.141l1.195 2.055zm6.429 1.094H20.19v1.75h2.73v.789h-3.719V21.03h3.691v.797H20.19v1.57h2.336v.782z",class:"text"},null,-1),Z2=e("path",{d:"m21.156 2.5 5.423 5.423h-5.423zm5.423 27H5.421v-27h15.735l5.423 5.423zM13 2.775v11.363m0-3.558h1.936M13 7.488h1.936M13 4.396h1.936m-3.872 7.73H13m-1.936-3.092H13m-1.936-3.092H13m-1.936 8.196v2.357c0 .557.867 1.009 1.936 1.009s1.936-.452 1.936-1.009v-2.357h-3.872z"},null,-1),q2=[K2,Z2];function J2(t,o){return s(),l("svg",G2,q2)}const W2={render:J2},X2={csvIcon:w1,docxIcon:T1,htmlIcon:S1,mdIcon:O1,odpIcon:A1,odsIcon:W1,odtIcon:o2,pdfIcon:r2,pptxIcon:u2,psIcon:w2,xlsIcon:T2,xlsxIcon:S2,xmlIcon:O2,zipIcon:A2,exeIcon:W2,txtIcon:n1,fileIcon:Q};const Q2={components:{...X2},props:{text:{type:String,required:!0},href:{type:String,required:!0},fileExt:{type:String,default:""},mimeType:{type:String,default:"application/octet-stream"},size:{type:Number,default:0}},computed:{icon(){let t=`${this.fileExt}Icon`;return this.fileExt&&this.$options.components[t]?t:"fileIcon"},humanFileSizeObject(){return A({output:"object",standard:"jedec",base:2})(this.size)},humanFileSizeUnitFull(){return A({output:"object",standard:"jedec",base:2,fullform:!0})(this.size).symbol},hasFileInfo(){return this.size||this.fileExt},fileInfoText(){let t="";return this.hasFileInfo&&(this.fileExt&&(t+=this.fileExt),this.size&&(t+=`, ${this.humanFileSizeObject.value} `)),t},linkHtmlTitle(){let t=this.text;return this.fileInfoText&&(t+=` (${this.fileInfoText}${this.size?this.humanFileSizeObject.symbol:""})`),t}}},e0={class:"file-link"},t0=["href","title","type"],n0={key:0},o0=["title"];function i0(t,o,a,c,d,h){return s(),l("figure",e0,[e("a",{href:a.href,download:"",title:h.linkHtmlTitle,type:a.mimeType},[(s(),e1(t1(h.icon))),k($(a.text||"Download File"),1)],8,t0),h.hasFileInfo?(s(),l("figcaption",n0,[k(" ("+$(h.fileInfoText),1),a.size?(s(),l("abbr",{key:0,title:h.humanFileSizeUnitFull},$(h.humanFileSizeObject.symbol),9,o0)):O("",!0),k(") ")])):O("",!0)])}const s0=G(Q2,[["render",i0],["__scopeId","data-v-407bd6d8"]]),l0=`<script>
import { partial } from "filesize";
import { icons } from "../util/fileTypeIcons";

export default {
  components: {
    ...icons,
  },
  props: {
    /** display text for the download link */
    text: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    /** extension based file type: exe, txt, zip, docx etc. */
    fileExt: {
      type: String,
      default: "",
    },
    mimeType: {
      type: String,
      default: "application/octet-stream",
    },
    /** size in kilobytes */
    size: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    icon() {
      let candidate = \`\${this.fileExt}Icon\`;
      return this.fileExt && this.$options.components[candidate]
        ? candidate
        : "fileIcon";
    },
    humanFileSizeObject() {
      return partial({
        output: "object",
        standard: "jedec",
        base: 2,
      })(this.size);
    },
    humanFileSizeUnitFull() {
      return partial({
        output: "object",
        standard: "jedec",
        base: 2,
        fullform: true,
      })(this.size).symbol;
    },
    hasFileInfo() {
      return this.size || this.fileExt;
    },
    fileInfoText() {
      let infoText = "";
      if (!this.hasFileInfo) {
        return infoText;
      }
      if (this.fileExt) {
        infoText += this.fileExt;
      }
      if (this.size) {
        infoText += \`, \${this.humanFileSizeObject.value} \`;
      }
      return infoText;
    },
    linkHtmlTitle() {
      let titleText = this.text;
      if (this.fileInfoText) {
        titleText += \` (\${this.fileInfoText}\${
          this.size ? this.humanFileSizeObject.symbol : ""
        })\`;
      }
      return titleText;
    },
  },
};
<\/script>

<template>
  <figure class="file-link">
    <a :href="href" download :title="linkHtmlTitle" :type="mimeType"
      ><Component :is="icon" />{{ text || "Download File" }}</a
    >
    <figcaption v-if="hasFileInfo">
      ({{ fileInfoText
      }}<abbr v-if="size" :title="humanFileSizeUnitFull">{{
        humanFileSizeObject.symbol
      }}</abbr
      >)
    </figcaption>
  </figure>
</template>

<style lang="postcss" scoped>
.file-link {
  /* figure has browser default margin which is not reset */
  margin: 0;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  & abbr {
    cursor: help;
  }

  & figcaption {
    display: inline-block;
    margin-left: 0.5ch;
  }

  & :deep(svg) {
    margin-right: 0.8ch;
    vertical-align: middle;
    stroke: var(--theme-text-link-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }

  & a {
    background: var(--theme-text-link-background-color);
    color: var(--theme-text-link-foreground-color);

    &:hover {
      background: var(--theme-text-link-background-color-hover);
      color: var(--theme-text-link-foreground-color-hover);

      & :deep(svg) {
        stroke: var(--theme-text-link-foreground-color-hover);

        /* text on file icons use fill in path with class text */
        & path.text {
          fill: var(--theme-text-link-foreground-color-hover);
        }
      }
    }

    &:focus {
      background: var(--theme-text-link-background-color-focus);
      color: var(--theme-text-link-foreground-color-focus);

      & :deep(svg) {
        stroke: var(--theme-text-link-foreground-color-focus);

        /* text on file icons use fill in path with class text */
        & path.text {
          fill: var(--theme-text-link-foreground-color-focus);
        }
      }
    }
  }
}
</style>
`,c0=`
<FileLink
  href="https://example.com/file.pdf"
  file-ext="pdf"
  mime-type="application/pdf"
  :size="250"
  text="SomeFile"
/>

<FileLink
  href="https://example.com/x.docx"
  file-ext="docx"
  text="WordFile"
/>

<FileLink
  href="https://example.com/0342as"
  file-ext="bin"
  text="Download Me"
  file-name="firmware.bin"
/>

<FileLink
  href="https://example.com/unkown.file"
  text="Another File"
/>
`,h0={components:{FileLink:s0,CodeExample:X},data(){return{fileLinkCode:l0,codeExample:c0}}},r0={class:"grid-container"},a0={class:"grid-item-12"},d0=e("p",null," The file link is a regular link with support for file icons and size display. ",-1);function f0(t,o,a,c,d,h){const m=D("FileLink",!0),v=D("CodeExample");return s(),l("section",null,[e("div",r0,[e("div",a0,[d0,e("div",null,[x(m,{href:"https://example.com/file.pdf","file-ext":"pdf","mime-type":"application/pdf",size:250,text:"SomeFile"}),x(m,{href:"https://example.com/x.docx","file-ext":"docx",text:"WordFile"}),x(m,{href:"https://example.com/0342as","file-ext":"bin",text:"Download Me","file-name":"firmware.bin"}),x(m,{href:"https://example.com/unkown.file",text:"Another File"})]),x(v,{summary:"Show usage example"},{default:P(()=>[k($(d.codeExample),1)]),_:1}),x(v,{summary:"Show FileLink.vue source code"},{default:P(()=>[k($(d.fileLinkCode),1)]),_:1})])])])}const _0=G(h0,[["render",f0]]);export{_0 as default};
