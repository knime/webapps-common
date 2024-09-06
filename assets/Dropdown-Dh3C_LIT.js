import{C as B}from"./CodeExample-Cfkh82Tb.js";import{o as n,c as u,b as e,_ as V,r as _,d as s,t as d,w as p,e as a,j as D,k as y,a as z,p as I,f as k}from"./index-CbvFh1bW.js";import{D as A}from"./Dropdown-CjQw21Wf.js";import{L as E}from"./LoadingIcon-DnBnbRNx.js";import"./arrow-dropdown-CUeKLWGw.js";import"./useSearch-LFF7jTHh.js";import"./svgWithTitle-kdOWnKTM.js";const G={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},T=e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1),M=[T];function U(r,i){return n(),u("svg",G,[...M])}const b={render:U},L={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=e("path",{d:"M15.935 25.421c1.97-.503 4.186-1.836 6.674-4.325 9.805-9.805 6.442-17.866 6.442-17.866s-2.94-1.227-7.428-.039c-2.944.779-6.554 2.597-10.438 6.481-2.489 2.489-3.822 4.704-4.325 6.674zm9.125-7.087c1.379 1.379.76 4.234-1.382 6.376l-4.227 4.227-3.516-3.516M13.949 7.223c-1.379-1.379-4.234-.76-6.376 1.382l-4.227 4.227 3.514 3.514m22.392-6.371-6.947-6.948M9.238 18.724 5.502 22.46m-1.495 1.495-.854.854m4.864-.545-5.409 5.409m9.004-4.839-3.79 3.79"},null,-1),F=e("circle",{cx:"20.06",cy:"11.961",r:"3.858"},null,-1),N=[C,F];function j(r,i){return n(),u("svg",L,[...N])}const x={render:j},P={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},H=e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1),W=[H];function R(r,i){return n(),u("svg",P,[...W])}const g={render:R},K={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},O=e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),q=e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1),J=[O,q];function Q(r,i){return n(),u("svg",K,[...J])}const w={render:Q},X="",Y=`<Dropdown
  v-model="selected"
  aria-label="A Dropdown"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>`,Z=`<Dropdown
  v-model="slottedSelected"
  aria-label="A Slotted dropdown"
  :possible-values="[{
      id: '1',
      text: 'The Sundering',
      slotData: {
          icon: DisconnectIcon,
          title: 'The Sundering',
          subtitle: 'Gods of the Earth',
          year: '2008'
      }
  }, {
      id: '2',
      text: 'Iron Swan',
      slotData: {
          icon: RocketIcon,
          title: 'Iron Swan',
          subtitle: 'Age of Winters',
          year: '2006'
      }
  }, {
      id: '3',
      text: 'The Dreamthieves',
      slotData: {
          icon: DiamondIcon,
          title: 'The Dreamthieves',
          subtitle: 'Low Country',
          year: '2016'
      }
  }, {
      id: '4',
      text: 'Twilight Sunrise',
      slotData: {
          icon: EarlyBirdIcon,
          title: 'Twilight Sunrise',
          subtitle: 'Used Future',
          year: '2018'
      }
  }]"
>
  <template
    #option="{ slotData: { icon, title, subtitle, year } } = {
      slotData: {},
    }"
  >
    <div class="slot-option">
      <component :is="icon" />
      <div class="description">
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <div class="year">{{ year }}</div>
    </div>
  </template>
</Dropdown>
`,$={components:{Dropdown:A,CodeExample:B,LoadingIcon:E,DisconnectIcon:b,RocketIcon:x,DiamondIcon:g,EarlyBirdIcon:w},data(){return{codeExample:Y,slottedCodeExample:Z,selected:"Id 123",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:""}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:b,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:x,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:g,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:w,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return X}}},c=r=>(I("data-v-f986d5b8"),r=r(),k(),r),ee=z('<div class="grid-container" data-v-f986d5b8><div class="grid-item-12" data-v-f986d5b8><p data-v-f986d5b8> A list of choices the user must choose one of them, so it emits an <code data-v-f986d5b8>input</code> event when something is selected, and it has a <code data-v-f986d5b8>value</code>. Keyboard navigation works (<code data-v-f986d5b8>Enter</code><code data-v-f986d5b8>Up</code>/<code data-v-f986d5b8>Down</code> and <code data-v-f986d5b8>Home</code>/<code data-v-f986d5b8>End</code>, leave with <code data-v-f986d5b8>Esc</code>). </p></div></div>',1),te={class:"grid-container"},oe={class:"grid-item-5"},ie={class:"grid-item-5"},de={class:"grid-item-2"},se=c(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The "),e("code",null,"placeholder"),a(" will be shown when no or empty "),e("code",null,"value"),a(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),a(") state. ")])])],-1)),le={class:"grid-container"},ae={class:"grid-item-5"},re={class:"grid-item-5"},ne={class:"grid-item-2"},ce=c(()=>e("br",null,null,-1)),ue={class:"grid-container"},pe={class:"grid-item-5"},me={class:"grid-item-2"},he=c(()=>e("br",null,null,-1)),_e={class:"grid-container"},ve={class:"grid-item-5"},be={class:"grid-item-2"},xe=c(()=>e("br",null,null,-1)),ge={class:"grid-container"},we={class:"grid-item-5"},Se={class:"grid-item-2"},fe=c(()=>e("br",null,null,-1)),Be={class:"grid-container"},Ve={class:"grid-item-5"},De={class:"grid-item-2"},ye=c(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The optional "),e("code",null,"direction"),a(" property can be used to display the dropdown above the input field. ")])])],-1)),ze={class:"grid-container"},Ie={class:"grid-item-5"},ke={class:"grid-item-2"},Ae=c(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),Ee={class:"grid-container"},Ge={class:"grid-item-5"},Te={class:"grid-item-2"},Me=c(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[a(" The optional "),e("code",null,"slotData"),a(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1)),Ue={class:"grid-container"},Le={class:"grid-item-12"},Ce={class:"grid-container"},Fe={class:"grid-item-5"},Ne={key:0,class:"slot-option"},je={class:"description"},Pe={class:"title"},He={key:1,class:"slot-option"},We={class:"description"},Re={class:"title"},Ke={class:"subtitle"},Oe={class:"year"},qe={class:"grid-item-2"},Je={class:"grid-container"},Qe={class:"grid-item-12"};function Xe(r,i,Ye,Ze,t,v){const l=_("Dropdown",!0),S=_("LoadingIcon"),h=_("CodeExample");return n(),u("div",null,[e("section",null,[ee,e("div",te,[e("div",oe,[s(l,{modelValue:t.selected,"onUpdate:modelValue":i[0]||(i[0]=o=>t.selected=o),"aria-label":"A List","possible-values":Array.from({length:1e3},(o,m)=>({id:`Id ${m}`,text:`Option ${m}`}))},null,8,["modelValue","possible-values"])]),e("div",ie,[s(l,{modelValue:t.selected,"onUpdate:modelValue":i[1]||(i[1]=o=>t.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",de,"selected id: "+d(t.selected),1)]),se,e("div",le,[e("div",ae,[s(l,{modelValue:t.placeholderModel,"onUpdate:modelValue":i[2]||(i[2]=o=>t.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",re,[s(l,{modelValue:t.placeholderModel,"onUpdate:modelValue":i[3]||(i[3]=o=>t.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ne,"selected id: "+d(t.placeholderModel),1)]),ce,e("div",ue,[e("div",pe,[s(l,{modelValue:t.disabledSelected,"onUpdate:modelValue":i[4]||(i[4]=o=>t.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",me,"selected id: "+d(t.disabledSelected),1)]),he,e("div",_e,[e("div",ve,[s(l,{modelValue:t.disabledSelected,"onUpdate:modelValue":i[5]||(i[5]=o=>t.disabledSelected=o),placeholder:"No values present","aria-label":"A List"},null,8,["modelValue"])]),e("div",be,"selected id: "+d(t.disabledSelected),1)]),xe,e("div",ge,[e("div",we,[s(l,{modelValue:t.withSlotsSelected,"onUpdate:modelValue":i[6]||(i[6]=o=>t.withSlotsSelected=o),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":p(()=>[s(S)]),_:1},8,["modelValue"])]),e("div",Se,"selected id: "+d(t.withSlotsSelected),1)]),fe,e("div",Be,[e("div",Ve,[s(l,{modelValue:t.withSlotsSelected,"onUpdate:modelValue":i[7]||(i[7]=o=>t.withSlotsSelected=o),placeholder:"In compact mode","aria-label":"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",De,"selected id: "+d(t.withSlotsSelected),1)]),ye,e("div",ze,[e("div",Ie,[s(l,{modelValue:t.dropupSelected,"onUpdate:modelValue":i[8]||(i[8]=o=>t.dropupSelected=o),"aria-label":"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",ke,"selected id: "+d(t.dropupSelected),1)]),Ae,e("div",Ee,[e("div",Ge,[s(l,{modelValue:t.withGroupSelected,"onUpdate:modelValue":i[9]||(i[9]=o=>t.withGroupSelected=o),placeholder:"With groups","aria-label":"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",Te,"selected id: "+d(t.withGroupSelected),1)]),Me]),e("section",null,[e("div",Ue,[e("div",Le,[s(h,{summary:"Show usage example"},{default:p(()=>[a(d(t.codeExample),1)]),_:1})])])]),e("section",null,[e("div",Ce,[e("div",Fe,[s(l,{modelValue:t.slottedSelected,"onUpdate:modelValue":i[10]||(i[10]=o=>t.slottedSelected=o),"aria-label":"A limited list",size:"3","possible-values":v.slottedExamplePossibleValue},{option:p(({slotData:o,isMissing:m,selectedValue:f}={slotData:{}})=>[m?(n(),u("div",Ne,[e("div",je,[e("div",Pe,"(MISSING) "+d(f),1)])])):(n(),u("div",He,[(n(),D(y(o.icon))),e("div",We,[e("div",Re,d(o.title),1),e("div",Ke,d(o.subtitle),1)]),e("div",Oe,d(o.year),1)]))]),_:1},8,["modelValue","possible-values"])]),e("div",qe,"selected id: "+d(t.slottedSelected),1)])]),e("section",null,[e("div",Je,[e("div",Qe,[s(h,{summary:"Show slotted usage example"},{default:p(()=>[a(d(t.slottedCodeExample),1)]),_:1}),s(h,{summary:"Show Dropdown.vue source code"},{default:p(()=>[a(d(v.code),1)]),_:1})])])])])}const lt=V($,[["render",Xe],["__scopeId","data-v-f986d5b8"]]);export{lt as default};
