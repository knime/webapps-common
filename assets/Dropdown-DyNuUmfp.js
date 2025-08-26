import{c as n,o as r,b as e,h as B,_ as V,r as m,a as D,d as l,t as d,e as a,w as c,k as h,p as _,g as z,F as g,l as L}from"./index-fPNLXK0t.js";import{R as S}from"./rocket-evHh1GEN.js";import{C as I}from"./CodeExample-tX4Zf7wt.js";import{D as T}from"./index-DMRRYotr.js";import{L as k}from"./LoadingIcon-BtmmGZbG.js";import{D as A}from"./Dropdown-BHECnAfd.js";import"./svgWithTitle-BykM9kE_.js";import"./arrow-dropdown-BBOnwNMq.js";import"./useSearch-BVlclUHe.js";import"./hotkeys-CoarEUTg.js";import"./navigator-npViAGhW.js";import"./v4-BKrj-4V8.js";const G={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function M(o,t){return r(),n("svg",G,t[0]||(t[0]=[e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1)]))}const w={render:M},E={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function U(o,t){return r(),n("svg",E,t[0]||(t[0]=[e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1)]))}const x={render:U},C={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function F(o,t){return r(),n("svg",C,t[0]||(t[0]=[e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1)]))}const y={render:F},$="",N=`<Dropdown
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
/>`,P=`<Dropdown
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
`,W=B({components:{DataType:T,Dropdown:A,CodeExample:I,LoadingIcon:k,DisconnectIcon:y,RocketIcon:S,DiamondIcon:w,EarlyBirdIcon:x},data(){return{codeExample:N,slottedCodeExample:P,selected:"Id 123",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:"",slottedSmallSelected:"missing"}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:y,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:S,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:w,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:x,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return $}}}),H={class:"grid-container"},j={class:"grid-item-5"},R={class:"grid-item-5"},O={class:"grid-item-2"},K={class:"grid-container"},q={class:"grid-item-5"},J={class:"grid-item-5"},Q={class:"grid-item-2"},X={class:"grid-container"},Y={class:"grid-item-5"},Z={class:"grid-item-2"},ee={class:"grid-container"},te={class:"grid-item-5"},oe={class:"grid-item-2"},ie={class:"grid-container"},de={class:"grid-item-5"},le={class:"grid-item-2"},se={class:"grid-container"},ae={class:"grid-item-5"},re={class:"grid-item-2"},ne={class:"grid-container"},pe={class:"grid-item-5"},ce={class:"grid-item-2"},ue={class:"grid-container"},me={class:"grid-item-5"},ve={class:"grid-item-2"},be={class:"grid-container"},he={class:"grid-item-12"},ge={class:"grid-container"},Se={class:"grid-item-5"},we={key:0,class:"slot-option"},xe={class:"description"},ye={class:"title"},fe={key:1,class:"slot-option"},Be={class:"description"},Ve={class:"title"},De={class:"subtitle"},_e={class:"year"},ze={class:"grid-item-2"},Le={class:"grid-container"},Ie={class:"grid-item-5"},Te={class:"grid-item-2"},ke={class:"grid-container"},Ae={class:"grid-item-12"};function Ge(o,t,Me,Ee,Ue,Ce){const s=m("Dropdown",!0),f=m("LoadingIcon"),v=m("CodeExample"),b=m("DataType");return r(),n("div",null,[e("section",null,[t[12]||(t[12]=D('<div class="grid-container" data-v-f365844b><div class="grid-item-12" data-v-f365844b><p data-v-f365844b> A list of choices the user must choose one of them, so it emits an <code data-v-f365844b>input</code> event when something is selected, and it has a <code data-v-f365844b>value</code>. Keyboard navigation works (<code data-v-f365844b>Enter</code><code data-v-f365844b>Up</code>/<code data-v-f365844b>Down</code> and <code data-v-f365844b>Home</code>/<code data-v-f365844b>End</code>, leave with <code data-v-f365844b>Esc</code>). </p></div></div>',1)),e("div",H,[e("div",j,[l(s,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=i=>o.selected=i),ariaLabel:"A List","possible-values":[{id:"specialOption",text:"Some special option",isSpecial:!0},...Array.from({length:1e3},(i,p)=>({id:`Id ${p}`,text:`Option ${p}`}))]},null,8,["modelValue","possible-values"])]),e("div",R,[l(s,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=i=>o.selected=i),ariaLabel:"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",O,"selected id: "+d(o.selected),1)]),t[13]||(t[13]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The "),e("code",null,"placeholder"),a(" will be shown when no or empty "),e("code",null,"value"),a(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),a(") state. ")])])],-1)),e("div",K,[e("div",q,[l(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=i=>o.placeholderModel=i),placeholder:"Placeholder…",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",J,[l(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=i=>o.placeholderModel=i),placeholder:"Placeholder…","is-valid":!1,ariaLabel:"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",Q,"selected id: "+d(o.placeholderModel),1)]),t[14]||(t[14]=e("br",null,null,-1)),e("div",X,[e("div",Y,[l(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=i=>o.disabledSelected=i),placeholder:"Disabled...",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",Z,"selected id: "+d(o.disabledSelected),1)]),t[15]||(t[15]=e("br",null,null,-1)),e("div",ee,[e("div",te,[l(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[5]||(t[5]=i=>o.disabledSelected=i),placeholder:"No values present",ariaLabel:"A List"},null,8,["modelValue"])]),e("div",oe,"selected id: "+d(o.disabledSelected),1)]),t[16]||(t[16]=e("br",null,null,-1)),e("div",ie,[e("div",de,[l(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[6]||(t[6]=i=>o.withSlotsSelected=i),placeholder:"With slots...",ariaLabel:"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":c(()=>[l(f)]),_:1},8,["modelValue"])]),e("div",le,"selected id: "+d(o.withSlotsSelected),1)]),t[17]||(t[17]=e("br",null,null,-1)),e("div",se,[e("div",ae,[l(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[7]||(t[7]=i=>o.withSlotsSelected=i),placeholder:"In compact mode",ariaLabel:"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",re,"selected id: "+d(o.withSlotsSelected),1)]),t[18]||(t[18]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The optional "),e("code",null,"direction"),a(" property can be used to display the dropdown above the input field. ")])])],-1)),e("div",ne,[e("div",pe,[l(s,{modelValue:o.dropupSelected,"onUpdate:modelValue":t[8]||(t[8]=i=>o.dropupSelected=i),ariaLabel:"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",ce,"selected id: "+d(o.dropupSelected),1)]),t[19]||(t[19]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),e("div",ue,[e("div",me,[l(s,{modelValue:o.withGroupSelected,"onUpdate:modelValue":t[9]||(t[9]=i=>o.withGroupSelected=i),placeholder:"With groups",ariaLabel:"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",ve,"selected id: "+d(o.withGroupSelected),1)])]),e("section",null,[e("div",be,[e("div",he,[l(v,{summary:"Show usage example"},{default:c(()=>[a(d(o.codeExample),1)]),_:1})])])]),e("section",null,[t[20]||(t[20]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[a(" The optional "),e("code",null,"slotData"),a(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1)),e("div",ge,[e("div",Se,[l(s,{modelValue:o.slottedSelected,"onUpdate:modelValue":t[10]||(t[10]=i=>o.slottedSelected=i),ariaLabel:"A limited list",size:"3","possible-values":o.slottedExamplePossibleValue},{option:c(({slotData:i,isMissing:p,selectedValue:u}={slotData:{}})=>[p?(r(),n("div",we,[e("div",xe,[e("div",ye,"(MISSING) "+d(u),1)])])):(r(),n("div",fe,[(r(),h(_(i.icon))),e("div",Be,[e("div",Ve,d(i.title),1),e("div",De,d(i.subtitle),1)]),e("div",_e,d(i.year),1)]))]),_:1},8,["modelValue","possible-values"])]),e("div",ze,"selected id: "+d(o.slottedSelected),1)]),t[21]||(t[21]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown (With datatypes)")])],-1)),e("div",Le,[e("div",Ie,[l(s,{modelValue:o.slottedSmallSelected,"onUpdate:modelValue":t[11]||(t[11]=i=>o.slottedSmallSelected=i),ariaLabel:"A limited list","possible-values":[{id:"withoutType",text:"Without Type",slotData:{text:"Without Type"}},{id:"string",text:"String",slotData:{text:"String",typeId:"string-datatype",typeText:"String Value"}},{id:"set",text:"Set",slotData:{text:"Set",typeId:"collection-set-datatype",typeText:"Set Value"}},{id:"pmml",text:"PMML",slotData:{text:"PMML",typeId:"model-pmml-datatype",typeText:"PMML Value"}}]},{option:c(({slotData:i,selectedValue:p,isMissing:u}={slotData:{}})=>[e("div",{class:z(["data-type-entry",{missing:u,"with-type":u||i.typeId}])},[u?(r(),n(g,{key:0},[l(b,{size:"small"}),e("span",null,"(MISSING) "+d(p),1)],64)):(r(),n(g,{key:1},[i.typeId?(r(),h(b,{key:0,"icon-name":i.typeId,"icon-title":i.typeText,size:"small"},null,8,["icon-name","icon-title"])):L("",!0),e("span",null,d(i.text),1)],64))],2)]),_:1},8,["modelValue"])]),e("div",Te,"selected id: "+d(o.slottedSmallSelected),1)])]),e("section",null,[e("div",ke,[e("div",Ae,[l(v,{summary:"Show slotted usage example"},{default:c(()=>[a(d(o.slottedCodeExample),1)]),_:1}),l(v,{summary:"Show Dropdown.vue source code"},{default:c(()=>[a(d(o.code),1)]),_:1})])])])])}const Qe=V(W,[["render",Ge],["__scopeId","data-v-f365844b"]]);export{Qe as default};
