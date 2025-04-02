import{o as c,c as u,b as e,_ as B,r as v,d,t as s,w as p,e as a,l as V,s as D,a as y,p as z,f as I}from"./index-VrLgZFLX.js";import{R as b}from"./rocket-mJoefDJJ.js";import{C as A}from"./CodeExample-CdSUoY0s.js";import{D as E}from"./Dropdown-BGL3eTr8.js";import{L as G}from"./LoadingIcon-Dh2snNle.js";import"./arrow-dropdown-CiLAmt95.js";import"./useSearch-04VZBE1l.js";import"./svgWithTitle-Bi5qeWTE.js";const T={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},k=e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1),U=[k];function L(n,i){return c(),u("svg",T,[...U])}const x={render:L},M={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),F=e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1),N=[C,F];function P(n,i){return c(),u("svg",M,[...N])}const g={render:P},H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},W=e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1),j=[W];function R(n,i){return c(),u("svg",H,[...j])}const w={render:R},O="",K=`<Dropdown
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
/>`,q=`<Dropdown
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
`,J={components:{Dropdown:E,CodeExample:A,LoadingIcon:G,DisconnectIcon:w,RocketIcon:b,DiamondIcon:x,EarlyBirdIcon:g},data(){return{codeExample:K,slottedCodeExample:q,selected:"Id 123",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:""}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:w,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:b,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:x,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:g,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return O}}},r=n=>(z("data-v-36925f8c"),n=n(),I(),n),Q=y('<div class="grid-container" data-v-36925f8c><div class="grid-item-12" data-v-36925f8c><p data-v-36925f8c> A list of choices the user must choose one of them, so it emits an <code data-v-36925f8c>input</code> event when something is selected, and it has a <code data-v-36925f8c>value</code>. Keyboard navigation works (<code data-v-36925f8c>Enter</code><code data-v-36925f8c>Up</code>/<code data-v-36925f8c>Down</code> and <code data-v-36925f8c>Home</code>/<code data-v-36925f8c>End</code>, leave with <code data-v-36925f8c>Esc</code>). </p></div></div>',1),X={class:"grid-container"},Y={class:"grid-item-5"},Z={class:"grid-item-5"},$={class:"grid-item-2"},ee=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The "),e("code",null,"placeholder"),a(" will be shown when no or empty "),e("code",null,"value"),a(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),a(") state. ")])])],-1)),te={class:"grid-container"},oe={class:"grid-item-5"},ie={class:"grid-item-5"},se={class:"grid-item-2"},de=r(()=>e("br",null,null,-1)),le={class:"grid-container"},ae={class:"grid-item-5"},re={class:"grid-item-2"},ne=r(()=>e("br",null,null,-1)),ce={class:"grid-container"},ue={class:"grid-item-5"},pe={class:"grid-item-2"},me=r(()=>e("br",null,null,-1)),he={class:"grid-container"},ve={class:"grid-item-5"},_e={class:"grid-item-2"},be=r(()=>e("br",null,null,-1)),xe={class:"grid-container"},ge={class:"grid-item-5"},we={class:"grid-item-2"},Se=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The optional "),e("code",null,"direction"),a(" property can be used to display the dropdown above the input field. ")])])],-1)),fe={class:"grid-container"},Be={class:"grid-item-5"},Ve={class:"grid-item-2"},De=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),ye={class:"grid-container"},ze={class:"grid-item-5"},Ie={class:"grid-item-2"},Ae=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[a(" The optional "),e("code",null,"slotData"),a(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1)),Ee={class:"grid-container"},Ge={class:"grid-item-12"},Te={class:"grid-container"},ke={class:"grid-item-5"},Ue={key:0,class:"slot-option"},Le={class:"description"},Me={class:"title"},Ce={key:1,class:"slot-option"},Fe={class:"description"},Ne={class:"title"},Pe={class:"subtitle"},He={class:"year"},We={class:"grid-item-2"},je={class:"grid-container"},Re={class:"grid-item-12"};function Oe(n,i,Ke,qe,t,_){const l=v("Dropdown",!0),S=v("LoadingIcon"),h=v("CodeExample");return c(),u("div",null,[e("section",null,[Q,e("div",X,[e("div",Y,[d(l,{modelValue:t.selected,"onUpdate:modelValue":i[0]||(i[0]=o=>t.selected=o),"aria-label":"A List","possible-values":[{id:"specialOption",text:"Some special option",isSpecial:!0},...Array.from({length:1e3},(o,m)=>({id:`Id ${m}`,text:`Option ${m}`}))]},null,8,["modelValue","possible-values"])]),e("div",Z,[d(l,{modelValue:t.selected,"onUpdate:modelValue":i[1]||(i[1]=o=>t.selected=o),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",$,"selected id: "+s(t.selected),1)]),ee,e("div",te,[e("div",oe,[d(l,{modelValue:t.placeholderModel,"onUpdate:modelValue":i[2]||(i[2]=o=>t.placeholderModel=o),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",ie,[d(l,{modelValue:t.placeholderModel,"onUpdate:modelValue":i[3]||(i[3]=o=>t.placeholderModel=o),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",se,"selected id: "+s(t.placeholderModel),1)]),de,e("div",le,[e("div",ae,[d(l,{modelValue:t.disabledSelected,"onUpdate:modelValue":i[4]||(i[4]=o=>t.disabledSelected=o),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",re,"selected id: "+s(t.disabledSelected),1)]),ne,e("div",ce,[e("div",ue,[d(l,{modelValue:t.disabledSelected,"onUpdate:modelValue":i[5]||(i[5]=o=>t.disabledSelected=o),placeholder:"No values present","aria-label":"A List"},null,8,["modelValue"])]),e("div",pe,"selected id: "+s(t.disabledSelected),1)]),me,e("div",he,[e("div",ve,[d(l,{modelValue:t.withSlotsSelected,"onUpdate:modelValue":i[6]||(i[6]=o=>t.withSlotsSelected=o),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":p(()=>[d(S)]),_:1},8,["modelValue"])]),e("div",_e,"selected id: "+s(t.withSlotsSelected),1)]),be,e("div",xe,[e("div",ge,[d(l,{modelValue:t.withSlotsSelected,"onUpdate:modelValue":i[7]||(i[7]=o=>t.withSlotsSelected=o),placeholder:"In compact mode","aria-label":"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",we,"selected id: "+s(t.withSlotsSelected),1)]),Se,e("div",fe,[e("div",Be,[d(l,{modelValue:t.dropupSelected,"onUpdate:modelValue":i[8]||(i[8]=o=>t.dropupSelected=o),"aria-label":"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",Ve,"selected id: "+s(t.dropupSelected),1)]),De,e("div",ye,[e("div",ze,[d(l,{modelValue:t.withGroupSelected,"onUpdate:modelValue":i[9]||(i[9]=o=>t.withGroupSelected=o),placeholder:"With groups","aria-label":"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",Ie,"selected id: "+s(t.withGroupSelected),1)]),Ae]),e("section",null,[e("div",Ee,[e("div",Ge,[d(h,{summary:"Show usage example"},{default:p(()=>[a(s(t.codeExample),1)]),_:1})])])]),e("section",null,[e("div",Te,[e("div",ke,[d(l,{modelValue:t.slottedSelected,"onUpdate:modelValue":i[10]||(i[10]=o=>t.slottedSelected=o),"aria-label":"A limited list",size:"3","possible-values":_.slottedExamplePossibleValue},{option:p(({slotData:o,isMissing:m,selectedValue:f}={slotData:{}})=>[m?(c(),u("div",Ue,[e("div",Le,[e("div",Me,"(MISSING) "+s(f),1)])])):(c(),u("div",Ce,[(c(),V(D(o.icon))),e("div",Fe,[e("div",Ne,s(o.title),1),e("div",Pe,s(o.subtitle),1)]),e("div",He,s(o.year),1)]))]),_:1},8,["modelValue","possible-values"])]),e("div",We,"selected id: "+s(t.slottedSelected),1)])]),e("section",null,[e("div",je,[e("div",Re,[d(h,{summary:"Show slotted usage example"},{default:p(()=>[a(s(t.slottedCodeExample),1)]),_:1}),d(h,{summary:"Show Dropdown.vue source code"},{default:p(()=>[a(s(_.code),1)]),_:1})])])])])}const ot=B(J,[["render",Oe],["__scopeId","data-v-36925f8c"]]);export{ot as default};
