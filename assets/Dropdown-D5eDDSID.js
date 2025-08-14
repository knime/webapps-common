import{c as n,o as r,b as e,h as x,_ as B,r as m,a as f,d as l,t as i,e as a,w as c,k as V,p as D}from"./index-jB5fMxCO.js";import{R as v}from"./rocket-3L5LrwGo.js";import{C as _}from"./CodeExample-nhhIQv7B.js";import{L as y}from"./LoadingIcon-u0c-6MAf.js";import{D as z}from"./Dropdown-oZWuXCtd.js";import"./svgWithTitle-DUF2xWDV.js";import"./arrow-dropdown-BGZYwhnV.js";import"./useSearch-BQT7Qpme.js";import"./hotkeys-CoarEUTg.js";import"./navigator-npViAGhW.js";import"./v4-BKrj-4V8.js";const L={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function I(o,t){return r(),n("svg",L,t[0]||(t[0]=[e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1)]))}const b={render:I},A={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function k(o,t){return r(),n("svg",A,t[0]||(t[0]=[e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1)]))}const h={render:k},E={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function G(o,t){return r(),n("svg",E,t[0]||(t[0]=[e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1)]))}const g={render:G},T="",U=`<Dropdown
  v-model="selected"
  ariaLabel="A Dropdown"
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
/>`,M=`<Dropdown
  v-model="slottedSelected"
  ariaLabel="A Slotted dropdown"
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
`,C=x({components:{Dropdown:z,CodeExample:_,LoadingIcon:y,DisconnectIcon:g,RocketIcon:v,DiamondIcon:b,EarlyBirdIcon:h},data(){return{codeExample:U,slottedCodeExample:M,selected:"Id 123",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:""}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:g,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:v,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:b,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:h,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return T}}}),$={class:"grid-container"},F={class:"grid-item-5"},N={class:"grid-item-5"},P={class:"grid-item-2"},H={class:"grid-container"},W={class:"grid-item-5"},j={class:"grid-item-5"},R={class:"grid-item-2"},O={class:"grid-container"},K={class:"grid-item-5"},q={class:"grid-item-2"},J={class:"grid-container"},Q={class:"grid-item-5"},X={class:"grid-item-2"},Y={class:"grid-container"},Z={class:"grid-item-5"},ee={class:"grid-item-2"},te={class:"grid-container"},oe={class:"grid-item-5"},de={class:"grid-item-2"},ie={class:"grid-container"},le={class:"grid-item-5"},se={class:"grid-item-2"},ae={class:"grid-container"},re={class:"grid-item-5"},ne={class:"grid-item-2"},ce={class:"grid-container"},ue={class:"grid-item-12"},pe={class:"grid-container"},me={class:"grid-item-5"},ve={key:0,class:"slot-option"},be={class:"description"},he={class:"title"},ge={key:1,class:"slot-option"},we={class:"description"},Se={class:"title"},xe={class:"subtitle"},Be={class:"year"},fe={class:"grid-item-2"},Ve={class:"grid-container"},De={class:"grid-item-12"};function _e(o,t,ye,ze,Le,Ie){const s=m("Dropdown",!0),w=m("LoadingIcon"),p=m("CodeExample");return r(),n("div",null,[e("section",null,[t[11]||(t[11]=f('<div class="grid-container" data-v-ea4d8852><div class="grid-item-12" data-v-ea4d8852><p data-v-ea4d8852> A list of choices the user must choose one of them, so it emits an <code data-v-ea4d8852>input</code> event when something is selected, and it has a <code data-v-ea4d8852>value</code>. Keyboard navigation works (<code data-v-ea4d8852>Enter</code><code data-v-ea4d8852>Up</code>/<code data-v-ea4d8852>Down</code> and <code data-v-ea4d8852>Home</code>/<code data-v-ea4d8852>End</code>, leave with <code data-v-ea4d8852>Esc</code>). </p></div></div>',1)),e("div",$,[e("div",F,[l(s,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=d=>o.selected=d),ariaLabel:"A List","possible-values":[{id:"specialOption",text:"Some special option",isSpecial:!0},...Array.from({length:1e3},(d,u)=>({id:`Id ${u}`,text:`Option ${u}`}))]},null,8,["modelValue","possible-values"])]),e("div",N,[l(s,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=d=>o.selected=d),ariaLabel:"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",P,"selected id: "+i(o.selected),1)]),t[12]||(t[12]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The "),e("code",null,"placeholder"),a(" will be shown when no or empty "),e("code",null,"value"),a(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),a(") state. ")])])],-1)),e("div",H,[e("div",W,[l(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=d=>o.placeholderModel=d),placeholder:"Placeholder…",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",j,[l(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=d=>o.placeholderModel=d),placeholder:"Placeholder…","is-valid":!1,ariaLabel:"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",R,"selected id: "+i(o.placeholderModel),1)]),t[13]||(t[13]=e("br",null,null,-1)),e("div",O,[e("div",K,[l(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=d=>o.disabledSelected=d),placeholder:"Disabled...",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",q,"selected id: "+i(o.disabledSelected),1)]),t[14]||(t[14]=e("br",null,null,-1)),e("div",J,[e("div",Q,[l(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[5]||(t[5]=d=>o.disabledSelected=d),placeholder:"No values present",ariaLabel:"A List"},null,8,["modelValue"])]),e("div",X,"selected id: "+i(o.disabledSelected),1)]),t[15]||(t[15]=e("br",null,null,-1)),e("div",Y,[e("div",Z,[l(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[6]||(t[6]=d=>o.withSlotsSelected=d),placeholder:"With slots...",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":c(()=>[l(w)]),_:1},8,["modelValue"])]),e("div",ee,"selected id: "+i(o.withSlotsSelected),1)]),t[16]||(t[16]=e("br",null,null,-1)),e("div",te,[e("div",oe,[l(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[7]||(t[7]=d=>o.withSlotsSelected=d),placeholder:"In compact mode",ariaLabel:"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",de,"selected id: "+i(o.withSlotsSelected),1)]),t[17]||(t[17]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The optional "),e("code",null,"direction"),a(" property can be used to display the dropdown above the input field. ")])])],-1)),e("div",ie,[e("div",le,[l(s,{modelValue:o.dropupSelected,"onUpdate:modelValue":t[8]||(t[8]=d=>o.dropupSelected=d),ariaLabel:"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",se,"selected id: "+i(o.dropupSelected),1)]),t[18]||(t[18]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),e("div",ae,[e("div",re,[l(s,{modelValue:o.withGroupSelected,"onUpdate:modelValue":t[9]||(t[9]=d=>o.withGroupSelected=d),placeholder:"With groups",ariaLabel:"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",ne,"selected id: "+i(o.withGroupSelected),1)]),t[19]||(t[19]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[a(" The optional "),e("code",null,"slotData"),a(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1))]),e("section",null,[e("div",ce,[e("div",ue,[l(p,{summary:"Show usage example"},{default:c(()=>[a(i(o.codeExample),1)]),_:1})])])]),e("section",null,[e("div",pe,[e("div",me,[l(s,{modelValue:o.slottedSelected,"onUpdate:modelValue":t[10]||(t[10]=d=>o.slottedSelected=d),ariaLabel:"A limited list",size:"3","possible-values":o.slottedExamplePossibleValue},{option:c(({slotData:d,isMissing:u,selectedValue:S}={slotData:{}})=>[u?(r(),n("div",ve,[e("div",be,[e("div",he,"(MISSING) "+i(S),1)])])):(r(),n("div",ge,[(r(),V(D(d.icon))),e("div",we,[e("div",Se,i(d.title),1),e("div",xe,i(d.subtitle),1)]),e("div",Be,i(d.year),1)]))]),_:1},8,["modelValue","possible-values"])]),e("div",fe,"selected id: "+i(o.slottedSelected),1)])]),e("section",null,[e("div",Ve,[e("div",De,[l(p,{summary:"Show slotted usage example"},{default:c(()=>[a(i(o.slottedCodeExample),1)]),_:1}),l(p,{summary:"Show Dropdown.vue source code"},{default:c(()=>[a(i(o.code),1)]),_:1})])])])])}const Pe=B(C,[["render",_e],["__scopeId","data-v-ea4d8852"]]);export{Pe as default};
