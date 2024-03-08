import{C as X}from"./CodeExample-uqlLlHR2.js";import{o as l,c as s,b as e,z as Q,_ as A,j as e1,k as t1,e as z,t as k,l as L,r as O,d as x,w as D}from"./index-AXHW_TGA.js";import{F as n1}from"./file-text-wXaHV1uc.js";/**
 * filesize
 *
 * @copyright 2022 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 10.0.6
 */const o1="array",i1="bit",P="bits",l1="byte",R="bytes",f="",s1="exponent",h1="function",I="iec",c1="Invalid number",r1="Invalid rounding method",w="jedec",a1="object",Y=".",G="round",d1="s",f1="kbit",m1="kB",K=" ",Z="string",u1="0",S={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function v1(t,{bits:o=!1,pad:a=!1,base:h=-1,round:d=2,locale:c=f,localeOptions:m={},separator:u=f,spacer:T=K,symbols:M={},standard:r=f,output:q=Z,fullform:B=!1,fullforms:$=[],exponent:b=-1,roundingMethod:F=G,precision:_=0}={}){let i=b,p=Number(t),n=[],v=0,E=f;h===-1&&r.length===0?(h=10,r=w):h===-1&&r.length>0?(r=r===I?I:w,h=r===I?2:10):(h=h===2?2:10,r=h===10||r===w?w:I);const y=h===10?1e3:1024,J=B===!0,j=p<0,H=Math[F];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(c1);if(typeof H!==h1)throw new TypeError(r1);if(j&&(p=-p),(i===-1||isNaN(i))&&(i=Math.floor(Math.log(p)/Math.log(y)),i<0&&(i=0)),i>8&&(_>0&&(_+=8-i),i=8),q===s1)return i;if(p===0)n[0]=0,E=n[1]=S.symbol[r][o?P:R][i];else{v=p/(h===2?Math.pow(2,i*10):Math.pow(1e3,i)),o&&(v=v*8,v>=y&&i<8&&(v=v/y,i++));const g=Math.pow(10,i>0?d:0);n[0]=H(v*g)/g,n[0]===y&&i<8&&b===-1&&(n[0]=1,i++),E=n[1]=h===10&&i===1?o?f1:m1:S.symbol[r][o?P:R][i]}if(j&&(n[0]=-n[0]),_>0&&(n[0]=n[0].toPrecision(_)),n[1]=M[n[1]]||n[1],c===!0?n[0]=n[0].toLocaleString():c.length>0?n[0]=n[0].toLocaleString(c,m):u.length>0&&(n[0]=n[0].toString().replace(Y,u)),a&&Number.isInteger(n[0])===!1&&d>0){const g=u||Y,V=n[0].toString().split(g),N=V[1]||f,C=N.length,W=d-C;n[0]=`${V[0]}${g}${N.padEnd(C+W,u1)}`}return J&&(n[1]=$[i]?$[i]:S.fullform[r][i]+(o?i1:l1)+(n[0]===1?f:d1)),q===o1?n:q===a1?{value:n[0],symbol:n[1],exponent:i,unit:E}:n.join(T)}function U({bits:t=!1,pad:o=!1,base:a=-1,round:h=2,locale:d=f,localeOptions:c={},separator:m=f,spacer:u=K,symbols:T={},standard:M=f,output:r=Z,fullform:q=!1,fullforms:B=[],exponent:$=-1,roundingMethod:b=G,precision:F=0}={}){return _=>v1(_,{bits:t,pad:o,base:a,round:h,locale:d,localeOptions:c,separator:m,spacer:u,symbols:T,standard:M,output:r,fullform:q,fullforms:B,exponent:$,roundingMethod:b,precision:F})}const _1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},p1=e("path",{fill:"#000",stroke:"none",d:"M11.936 25.375a1.23 1.23 0 0 1-.843.252 1.06 1.06 0 0 1-.931-.467 2.4 2.4 0 0 1-.317-1.355v-.485a2.27 2.27 0 0 1 .34-1.331 1.11 1.11 0 0 1 .954-.454 1.14 1.14 0 0 1 .811.262 1.36 1.36 0 0 1 .344.853h.948a2.05 2.05 0 0 0-.643-1.391 2.12 2.12 0 0 0-1.459-.49 2.2 2.2 0 0 0-1.187.319 2.07 2.07 0 0 0-.788.91 3.2 3.2 0 0 0-.274 1.365v.512a3.2 3.2 0 0 0 .282 1.325 2.03 2.03 0 0 0 .769.882 2.14 2.14 0 0 0 1.158.318 2.2 2.2 0 0 0 1.5-.491 1.98 1.98 0 0 0 .647-1.367h-.95a1.3 1.3 0 0 1-.361.833m5.223-1.764a4.2 4.2 0 0 0-1.027-.433 3.2 3.2 0 0 1-.918-.392.6.6 0 0 1-.278-.5.67.67 0 0 1 .257-.557 1.16 1.16 0 0 1 .724-.2 1.11 1.11 0 0 1 .77.242.86.86 0 0 1 .269.672h.944a1.54 1.54 0 0 0-.256-.863 1.67 1.67 0 0 0-.7-.6 2.4 2.4 0 0 0-1.019-.21 2.2 2.2 0 0 0-1.4.429 1.34 1.34 0 0 0-.54 1.091 1.41 1.41 0 0 0 .749 1.227 4.5 4.5 0 0 0 1.053.443 3 3 0 0 1 .916.4.67.67 0 0 1 .254.558.66.66 0 0 1-.249.533 1.18 1.18 0 0 1-.747.2 1.35 1.35 0 0 1-.884-.256.89.89 0 0 1-.309-.723h-.952a1.5 1.5 0 0 0 .276.9 1.85 1.85 0 0 0 .775.607 2.7 2.7 0 0 0 1.093.22 2.27 2.27 0 0 0 1.424-.4 1.3 1.3 0 0 0 .524-1.089 1.45 1.45 0 0 0-.181-.735 1.6 1.6 0 0 0-.568-.564m5.951-2.766-1.971 5.477h-.922l-1.963-5.477H19.3l1.376 4.284 1.393-4.284z",class:"text"},null,-1),x1=e("path",{d:"M5.813 29V3h15.152l5.222 5.222V29zM26.187 8.222h-5.222V3"},null,-1),q1=[p1,x1];function g1(t,o){return l(),s("svg",_1,[...q1])}const w1={render:g1},z1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},k1=e("path",{fill:"#000",stroke:"none",d:"M9.396 26.321v-5.477h1.618q.726 0 1.288.323c.562.323.665.521.871.918q.308.594.308 1.361v.274q0 .78-.31 1.369a2.18 2.18 0 0 1-.884.911q-.573.32-1.314.319H9.396zm.952-4.71v3.95h.621q.749 0 1.149-.469t.408-1.345v-.305q0-.891-.388-1.361c-.388-.47-.633-.471-1.125-.471zm8.452 2.115q0 .805-.278 1.413-.279.607-.796.933c-.517.326-.742.325-1.19.325q-.665 0-1.187-.325a2.13 2.13 0 0 1-.805-.928q-.284-.6-.288-1.388v-.309q0-.802.284-1.414.284-.614.801-.938c.517-.324.741-.325 1.187-.325s.841.106 1.186.321.611.522.8.926q.282.603.286 1.404zm-.952-.287q0-.909-.344-1.396-.344-.484-.976-.484-.617 0-.965.483c-.348.483-.351.777-.355 1.367v.315q0 .904.352 1.396.351.493.976.493.631 0 .973-.481.34-.481.34-1.407zm6.079 1.099q-.084.877-.647 1.367c-.563.49-.876.491-1.501.491q-.654 0-1.152-.311-.499-.31-.77-.882c-.271-.572-.274-.824-.282-1.328v-.512q0-.776.274-1.365.276-.59.788-.91a2.2 2.2 0 0 1 1.188-.319q.906 0 1.459.49t.644 1.391h-.948q-.068-.591-.344-.853-.277-.261-.811-.262-.621 0-.954.454c-.333.454-.335.746-.34 1.331v.485q0 .889.317 1.355c.317.466.522.467.931.467q.561 0 .843-.252.283-.252.357-.839h.948zm2.735-1.715 1.15-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.182 2.009h-1.105l1.696-2.761-1.659-2.716h1.099z",class:"text"},null,-1),$1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),b1=[k1,$1];function y1(t,o){return l(),s("svg",z1,[...b1])}const I1={render:y1},T1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},M1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),B1=e("path",{fill:"#000",stroke:"none",d:"M12.797 20.844h.948v5.477h-.948v-2.43h-2.449v2.43h-.952v-5.477h.952v2.279h2.449zm1.576.767h1.692v4.71h.944v-4.71h1.708v-.767h-4.344zm7.876 3.43-1.58-4.197h-1.233v5.477h.947v-1.806l-.094-2.411 1.614 4.217h.681l1.617-4.221-.094 2.415v1.806h.947v-5.477h-1.229zm4.883.52v-4.717h-.952v5.477h3.438v-.76z",class:"text"},null,-1),F1=[M1,B1];function E1(t,o){return l(),s("svg",T1,[...F1])}const S1={render:E1},j1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H1=e("path",{fill:"#000",stroke:"none",d:"m11.825 20.845 1.58 4.197 1.576-4.197h1.23v5.477h-.948v-1.806l.094-2.415-1.618 4.221h-.681l-1.614-4.217.094 2.411v1.806h-.948v-5.477zm5.51 5.476v-5.477h1.617q.726 0 1.288.323c.562.323.665.521.871.918s.309.85.309 1.361v.274q0 .78-.311 1.369a2.18 2.18 0 0 1-.884.911q-.574.32-1.314.319h-1.576zm.951-4.71v3.95h.621q.749 0 1.149-.469t.408-1.345v-.305q0-.891-.388-1.361-.389-.47-1.125-.471z",class:"text"},null,-1),V1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),N1=[H1,V1];function C1(t,o){return l(),s("svg",j1,[...N1])}const L1={render:C1},O1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},D1=e("path",{fill:"#000",stroke:"none",d:"M13.235 23.726q0 .805-.278 1.413a2.1 2.1 0 0 1-.796.933 2.2 2.2 0 0 1-1.19.325q-.666 0-1.187-.325a2.13 2.13 0 0 1-.805-.928q-.284-.6-.288-1.388v-.309q0-.802.284-1.414.284-.614.801-.938c.517-.324.741-.325 1.187-.325s.842.106 1.187.321.611.522.799.926q.283.603.286 1.404zm-.952-.287q0-.909-.344-1.396-.344-.484-.976-.484-.618 0-.965.483c-.347.483-.35.778-.355 1.368v.315q0 .904.352 1.396.352.493.976.493.632 0 .973-.481.34-.482.34-1.407zm1.9 2.882v-5.477h1.618q.726 0 1.288.323c.562.323.665.521.871.918s.309.85.309 1.361v.274q0 .78-.311 1.369a2.18 2.18 0 0 1-.884.911q-.573.32-1.314.319h-1.577zm.952-4.71v3.95h.621q.749 0 1.149-.469t.408-1.345v-.305q0-.891-.388-1.361-.387-.47-1.125-.471zm5.032 2.679v2.031h-.951v-5.477h2.095q.918 0 1.458.478.54.479.54 1.266 0 .805-.529 1.254c-.529.449-.846.448-1.479.448zm0-.768h1.144q.508 0 .775-.238c.267-.238.267-.39.267-.69q0-.444-.271-.709c-.271-.265-.429-.268-.745-.273h-1.17z",class:"text"},null,-1),P1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),R1=[D1,P1];function Y1(t,o){return l(),s("svg",O1,[...R1])}const U1={render:Y1},A1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},G1=e("path",{fill:"#000",stroke:"none",d:"M13.375 23.726q0 .805-.278 1.413a2.1 2.1 0 0 1-.796.933 2.2 2.2 0 0 1-1.19.325q-.666 0-1.187-.325a2.13 2.13 0 0 1-.805-.928q-.284-.6-.288-1.388v-.309q0-.802.284-1.414.284-.614.801-.938c.517-.324.741-.325 1.187-.325s.842.106 1.187.321.611.522.799.926q.283.603.286 1.404zm-.952-.287q0-.909-.344-1.396-.344-.484-.976-.484-.618 0-.965.483c-.347.483-.351.778-.356 1.368v.315q0 .904.352 1.396.351.493.976.493.632 0 .973-.481.34-.482.34-1.407zm1.899 2.882v-5.477h1.618q.726 0 1.288.323c.562.323.665.521.871.918q.308.594.308 1.361v.274q0 .78-.31 1.369a2.2 2.2 0 0 1-.885.911q-.573.32-1.314.319h-1.576zm.952-4.71v3.95h.621q.749 0 1.149-.469.401-.468.408-1.345v-.305q0-.891-.388-1.361-.387-.47-1.124-.471zm6.944 3.3q0-.361-.254-.558-.255-.195-.916-.395c-.661-.2-.793-.281-1.054-.443q-.748-.47-.748-1.227 0-.662.539-1.091.54-.429 1.401-.429.572 0 1.02.21.448.211.703.601.256.39.256.863h-.947q0-.429-.27-.672-.269-.242-.77-.242-.466 0-.724.199c-.258.199-.258.318-.258.557q0 .3.278.502t.918.392 1.027.433.567.557.181.735q0 .684-.524 1.089c-.524.405-.824.404-1.424.404q-.594 0-1.093-.22c-.499-.22-.591-.35-.775-.607a1.52 1.52 0 0 1-.276-.903h.952q0 .467.309.723.308.256.884.256.497 0 .746-.201a.65.65 0 0 0 .252-.533",class:"text"},null,-1),K1=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),Z1=[G1,K1];function J1(t,o){return l(),s("svg",A1,[...Z1])}const W1={render:J1},X1={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q1=e("path",{fill:"#000",stroke:"none",d:"M13.463 23.726q0 .805-.278 1.413a2.1 2.1 0 0 1-.796.933 2.2 2.2 0 0 1-1.19.325q-.665 0-1.187-.325a2.13 2.13 0 0 1-.805-.928q-.284-.6-.288-1.388v-.309q0-.802.284-1.414.284-.614.801-.938c.517-.324.741-.325 1.187-.325s.842.106 1.187.321.611.522.799.926q.283.603.286 1.404zm-.952-.287q0-.909-.344-1.396-.344-.484-.976-.484-.617 0-.965.483c-.348.483-.35.778-.355 1.368v.315q0 .904.352 1.396.351.493.976.493.632 0 .973-.481.34-.482.34-1.407zm1.9 2.882v-5.477h1.618q.726 0 1.288.323c.562.323.665.521.871.918s.309.85.309 1.361v.274q0 .78-.311 1.369a2.18 2.18 0 0 1-.884.911q-.573.32-1.314.319h-1.577zm.952-4.71v3.95h.621q.749 0 1.149-.469t.408-1.345v-.305q0-.891-.388-1.361-.387-.47-1.125-.471zm7.718 0h-1.707v4.71h-.944v-4.71h-1.692v-.767h4.344z",class:"text"},null,-1),e2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),t2=[Q1,e2];function n2(t,o){return l(),s("svg",X1,[...t2])}const o2={render:n2},i2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},l2=e("path",{fill:"#000",stroke:"none",d:"M10.233 24.29v2.031h-.951v-5.477h2.095q.918 0 1.458.478c.54.478.54.741.54 1.266q0 .805-.529 1.254t-1.48.448zm0-.768h1.144q.507 0 .775-.238c.268-.238.267-.39.267-.69q0-.444-.271-.709-.27-.265-.745-.273h-1.17zm3.972 2.799v-5.477h1.618q.726 0 1.288.323c.562.323.665.521.871.918s.309.85.309 1.361v.274q0 .78-.311 1.369a2.18 2.18 0 0 1-.884.911q-.573.32-1.314.319h-1.577zm.952-4.71v3.95h.621q.749 0 1.149-.469t.408-1.345v-.305q0-.891-.388-1.361-.387-.47-1.125-.471zM22.395 24H20.19v2.321h-.951v-5.477h3.479v.767H20.19v1.629h2.205z",class:"text"},null,-1),s2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),h2=[l2,s2];function c2(t,o){return l(),s("svg",i2,[...h2])}const r2={render:c2},a2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},d2=e("path",{fill:"#000",stroke:"none",d:"M10.348 24.29v2.031h-.952v-5.477h2.095q.918 0 1.458.478c.54.478.54.741.54 1.266q0 .805-.529 1.254t-1.48.448zm0-.768h1.144q.508 0 .775-.238c.267-.238.267-.39.267-.69q0-.444-.271-.709-.27-.265-.745-.273h-1.17zm4.923.768v2.031h-.952v-5.477h2.095q.917 0 1.458.478.54.479.54 1.266 0 .805-.529 1.254c-.529.449-.846.448-1.479.448zm0-.768h1.144q.507 0 .775-.238.267-.24.267-.69 0-.444-.271-.709c-.271-.265-.429-.268-.745-.273h-1.17v1.91m7.93-1.911h-1.708v4.71h-.945v-4.71h-1.692v-.767h4.345zm2.603 1.212 1.15-1.979h1.099l-1.655 2.717 1.693 2.761h-1.11l-1.177-2.009-1.182 2.009h-1.105l1.696-2.761-1.659-2.716h1.099z",class:"text"},null,-1),f2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),m2=[d2,f2];function u2(t,o){return l(),s("svg",a2,[...m2])}const v2={render:u2},_2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},p2=e("path",{fill:"#000",stroke:"none",d:"M12.583 24.29v2.031h-.952v-5.477h2.095q.918 0 1.458.478c.54.478.54.741.54 1.266q0 .805-.529 1.254t-1.48.448zm0-.768h1.144q.508 0 .775-.238c.267-.238.267-.39.267-.69q0-.444-.271-.709-.27-.265-.745-.273h-1.17zm6.835 1.389q0-.361-.254-.558-.255-.195-.916-.395c-.661-.2-.792-.281-1.053-.443q-.749-.47-.749-1.227 0-.662.54-1.091c.54-.429.827-.429 1.401-.429q.571 0 1.02.21.448.211.703.601.256.39.256.863h-.947q0-.429-.27-.672-.269-.242-.77-.242-.466 0-.724.199a.67.67 0 0 0-.257.557q0 .3.278.502.279.202.917.392.64.19 1.027.433.387.242.567.557.18.314.181.735 0 .684-.524 1.089c-.524.405-.824.404-1.424.404q-.594 0-1.093-.22a1.85 1.85 0 0 1-.775-.607 1.52 1.52 0 0 1-.276-.903h.952q0 .467.309.723.308.255.884.256.497 0 .746-.201a.65.65 0 0 0 .251-.533",class:"text"},null,-1),x2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),q2=[p2,x2];function g2(t,o){return l(),s("svg",_2,[...q2])}const w2={render:g2},z2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},k2=e("path",{fill:"#000",stroke:"none",d:"m11.658 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H9.371l1.696-2.761-1.659-2.716h1.098zm3.942 2.739h2.486v.76h-3.438v-5.477h.952zm6.079-.651q0-.361-.254-.558-.254-.195-.916-.395c-.662-.2-.792-.281-1.053-.443q-.749-.47-.749-1.227 0-.662.54-1.091t1.401-.429q.572 0 1.02.21.447.212.703.602t.256.863h-.948q0-.429-.269-.672-.27-.242-.77-.242-.467 0-.725.199a.67.67 0 0 0-.257.557q0 .3.278.502t.918.392 1.026.433q.387.242.568.557.18.314.181.735 0 .684-.525 1.089c-.525.405-.824.404-1.424.404q-.594 0-1.093-.22a1.84 1.84 0 0 1-.774-.607 1.5 1.5 0 0 1-.276-.903h.951q0 .467.309.723.308.255.884.256.496 0 .747-.201a.65.65 0 0 0 .251-.534",class:"text"},null,-1),$2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),b2=[k2,$2];function y2(t,o){return l(),s("svg",z2,[...b2])}const I2={render:y2},T2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},M2=e("path",{fill:"#000",stroke:"none",d:"m11.683 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H9.396l1.696-2.761-1.659-2.716h1.098zm3.942 2.739h2.486v.76h-3.438v-5.477h.952zm6.078-.651q0-.361-.254-.558-.254-.195-.916-.395c-.662-.2-.792-.281-1.053-.443q-.749-.47-.749-1.227 0-.662.54-1.091t1.401-.429q.572 0 1.02.21.447.211.703.601t.256.863h-.948q0-.429-.269-.672-.27-.242-.77-.242-.467 0-.725.199a.67.67 0 0 0-.257.557q0 .3.278.502t.918.392 1.026.433q.387.242.568.557.18.314.181.735 0 .684-.525 1.089c-.525.405-.824.404-1.424.404q-.594 0-1.093-.22a1.84 1.84 0 0 1-.774-.607 1.5 1.5 0 0 1-.276-.903h.951q0 .467.309.723.308.256.884.256.496 0 .747-.201a.65.65 0 0 0 .251-.533m3.671-2.088 1.151-1.979h1.099l-1.655 2.716 1.692 2.761h-1.109l-1.178-2.009-1.181 2.009h-1.106l1.696-2.761-1.658-2.716h1.098z",class:"text"},null,-1),B2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222v10.55m0-10.55h-5.222V3"},null,-1),F2=[M2,B2];function E2(t,o){return l(),s("svg",T2,[...F2])}const S2={render:E2},j2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H2=e("path",{fill:"#000",stroke:"none",d:"m10.558 22.823 1.151-1.979h1.099l-1.655 2.716 1.693 2.761h-1.11l-1.177-2.009-1.181 2.009H8.271l1.696-2.761-1.659-2.716h1.098zm4.224-1.978 1.58 4.197 1.575-4.197h1.23v5.477h-.948v-1.806l.095-2.415-1.618 4.221h-.681l-1.614-4.217.094 2.411v1.806h-.948v-5.477zm6.461 4.717h2.486v.76h-3.437v-5.477h.951v4.717",class:"text"},null,-1),V2=e("path",{d:"M26.187 29H5.813V3h15.152l5.222 5.222zm0-20.778h-5.222V3"},null,-1),N2=[H2,V2];function C2(t,o){return l(),s("svg",j2,[...N2])}const L2={render:C2},O2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round","stroke-miterlimit":"10",viewBox:"0 0 32 32"},D2=e("path",{fill:"#000",stroke:"none",d:"M11.507 25.929h3.039v.789h-4.234v-.641l2.941-4.25h-2.922v-.797h4.121v.625zm4.93.789h-.984V21.03h.984zm2.203-2.11v2.109h-.988V21.03h2.176q.954 0 1.514.497.561.497.561 1.313 0 .838-.549 1.303-.548.465-1.537.465H.64zm0-.796h1.188q.528 0 .805-.248.278-.247.277-.717 0-.461-.281-.736c-.281-.275-.445-.277-.773-.283H18.64z",class:"text"},null,-1),P2=e("path",{d:"m21.156 2.5 5.423 5.423h-5.423zm5.423 27H5.421v-27h15.735l5.423 5.423zM13 2.775v11.363m0-3.558h1.936M13 7.488h1.936M13 4.396h1.936m-3.872 7.73H13m-1.936-3.092H13m-1.936-3.092H13m-1.936 8.196v2.357c0 .557.867 1.009 1.936 1.009s1.936-.452 1.936-1.009v-2.357z"},null,-1),R2=[D2,P2];function Y2(t,o){return l(),s("svg",O2,[...R2])}const U2={render:Y2},A2={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round","stroke-miterlimit":"10",viewBox:"0 0 32 32"},G2=e("path",{fill:"#000",stroke:"none",d:"M12.94 24.179h-2.336v1.75h2.73v.789H9.616V21.03h3.691v.797h-2.703v1.57h2.336zm3.157-1.094 1.195-2.055h1.141l-1.719 2.82 1.758 2.867H17.32l-1.223-2.086-1.227 2.086h-1.148l1.762-2.867-1.723-2.82h1.141zm6.429 1.094H20.19v1.75h2.73v.789h-3.719V21.03h3.691v.797H20.19v1.57h2.336z",class:"text"},null,-1),K2=e("path",{d:"m21.156 2.5 5.423 5.423h-5.423zm5.423 27H5.421v-27h15.735l5.423 5.423zM13 2.775v11.363m0-3.558h1.936M13 7.488h1.936M13 4.396h1.936m-3.872 7.73H13m-1.936-3.092H13m-1.936-3.092H13m-1.936 8.196v2.357c0 .557.867 1.009 1.936 1.009s1.936-.452 1.936-1.009v-2.357z"},null,-1),Z2=[G2,K2];function J2(t,o){return l(),s("svg",A2,[...Z2])}const W2={render:J2},X2={csvIcon:w1,docxIcon:I1,htmlIcon:S1,mdIcon:L1,odpIcon:U1,odsIcon:W1,odtIcon:o2,pdfIcon:r2,pptxIcon:v2,psIcon:w2,xlsIcon:I2,xlsxIcon:S2,xmlIcon:L2,zipIcon:U2,exeIcon:W2,txtIcon:n1,fileIcon:Q},Q2={components:{...X2},props:{text:{type:String,required:!0},href:{type:String,required:!0},fileExt:{type:String,default:""},mimeType:{type:String,default:"application/octet-stream"},size:{type:Number,default:0}},computed:{icon(){let t=`${this.fileExt}Icon`;return this.fileExt&&this.$options.components[t]?t:"fileIcon"},humanFileSizeObject(){return U({output:"object",standard:"jedec",base:2})(this.size)},humanFileSizeUnitFull(){return U({output:"object",standard:"jedec",base:2,fullform:!0})(this.size).symbol},hasFileInfo(){return this.size||this.fileExt},fileInfoText(){let t="";return this.hasFileInfo&&(this.fileExt&&(t+=this.fileExt),this.size&&(t+=`, ${this.humanFileSizeObject.value} `)),t},linkHtmlTitle(){let t=this.text;return this.fileInfoText&&(t+=` (${this.fileInfoText}${this.size?this.humanFileSizeObject.symbol:""})`),t}}},e0={class:"file-link"},t0=["href","title","type"],n0={key:0},o0=["title"];function i0(t,o,a,h,d,c){return l(),s("figure",e0,[e("a",{href:a.href,download:"",title:c.linkHtmlTitle,type:a.mimeType},[(l(),e1(t1(c.icon))),z(k(a.text||"Download File"),1)],8,t0),c.hasFileInfo?(l(),s("figcaption",n0,[z(" ("+k(c.fileInfoText),1),a.size?(l(),s("abbr",{key:0,title:c.humanFileSizeUnitFull},k(c.humanFileSizeObject.symbol),9,o0)):L("",!0),z(") ")])):L("",!0)])}const l0=A(Q2,[["render",i0],["__scopeId","data-v-407bd6d8"]]),s0=`<script>
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
`,h0=`
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
`,c0={components:{FileLink:l0,CodeExample:X},data(){return{fileLinkCode:s0,codeExample:h0}}},r0={class:"grid-container"},a0={class:"grid-item-12"},d0=e("p",null," The file link is a regular link with support for file icons and size display. ",-1);function f0(t,o,a,h,d,c){const m=O("FileLink",!0),u=O("CodeExample");return l(),s("section",null,[e("div",r0,[e("div",a0,[d0,e("div",null,[x(m,{href:"https://example.com/file.pdf","file-ext":"pdf","mime-type":"application/pdf",size:250,text:"SomeFile"}),x(m,{href:"https://example.com/x.docx","file-ext":"docx",text:"WordFile"}),x(m,{href:"https://example.com/0342as","file-ext":"bin",text:"Download Me","file-name":"firmware.bin"}),x(m,{href:"https://example.com/unkown.file",text:"Another File"})]),x(u,{summary:"Show usage example"},{default:D(()=>[z(k(d.codeExample),1)]),_:1}),x(u,{summary:"Show FileLink.vue source code"},{default:D(()=>[z(k(d.fileLinkCode),1)]),_:1})])])])}const _0=A(c0,[["render",f0]]);export{_0 as default};
