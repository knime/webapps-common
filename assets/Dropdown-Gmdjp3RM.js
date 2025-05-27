import{o as r,c as n,b as e,_ as f,r as v,a as B,d,t as l,e as a,w as c,k as V,p as D}from"./index-Cf8PFgZN.js";import{R as h}from"./rocket-BuF67wTw.js";import{C as y}from"./CodeExample-DYCRcHNt.js";import{D as z}from"./Dropdown-Bj5I_-53.js";import{L as I}from"./LoadingIcon-0VnkBM-P.js";import"./arrow-dropdown-B8_ozbBp.js";import"./useSearch-Ku4Ow47B.js";import"./hotkeys-CSYqpiEJ.js";import"./navigator-D8UnuLAa.js";import"./svgWithTitle-kORUq3hD.js";const A={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function k(p,t){return r(),n("svg",A,t[0]||(t[0]=[e("path",{d:"m16 27.716 13.785-16.782H2.215zM6.81 4.284l-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.189zm9.189 0-4.595 6.65h9.19zm-4.595 6.65 4.595-6.65h-9.189zm-9.189 0 4.595-6.65H6.81zm9.189 0L16 27.716l-4.596-16.782"},null,-1)]))}const x={render:k},E={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function G(p,t){return r(),n("svg",E,t[0]||(t[0]=[e("path",{d:"M15.19 6.12c1.35-2.5 4-4.19 7.04-4.19 4.42 0 8 3.58 8 8 0 3.57-2.34 6.6-5.58 7.63m1.27-5.39-3.7-2.13V5.45M11.51 20.12a5 5 0 0 1-.23-1.51v-1.76m4.98 8.46c-.66.2-1.35.31-2.07.31a6.97 6.97 0 0 1-6.97-6.97c0-1.93.78-3.67 2.04-4.93a4.52 4.52 0 0 1-3.21-1.33c-1.77-1.77-1.77-4.65 0-6.42s4.65-1.77 6.42 0l15.59 19.58-9.4-1.82H16.4c-1.77 0-3.33-.9-4.25-2.27m2.04 4.16v3.47h-3.11M4.76 8.6l-2.98 1.53 3.44 1.13"},null,-1),e("line",{"stroke-linecap":"round",transform:"matrix(1.6 0 0 1.6 8.3 9)"},null,-1)]))}const g={render:G},T={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function U(p,t){return r(),n("svg",T,t[0]||(t[0]=[e("path",{d:"M27.5 3.214h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm-16 15.572h-7c-.825 0-1.5.675-1.5 1.5v7c0 .825.675 1.5 1.5 1.5h7c.825 0 1.5-.675 1.5-1.5v-7c0-.825-.675-1.5-1.5-1.5zm6.996-.068 4.879 4.879m-1.006-4.613A10.96 10.96 0 0 0 24 13.214M12.991 24.223c2.116 0 4.092-.597 5.77-1.632m-15.32-3.364 9.118 9.118m6.882-24.69 9.118 9.118"},null,-1)]))}const _={render:U},L="",M=`<Dropdown
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
/>`,C=`<Dropdown
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
`,F={components:{Dropdown:z,CodeExample:y,LoadingIcon:I,DisconnectIcon:_,RocketIcon:h,DiamondIcon:x,EarlyBirdIcon:g},data(){return{codeExample:M,slottedCodeExample:C,selected:"Id 123",placeholderModel:"",disabledSelected:"",withSlotsSelected:"",slottedSelected:"1",dropupSelected:"bar",withGroupSelected:""}},computed:{slottedExamplePossibleValue(){return[{id:"1",text:"The Sundering",slotData:{icon:_,title:"The Sundering",subtitle:"Gods of the Earth",year:"2008"}},{id:"2",text:"Iron Swan",slotData:{icon:h,title:"Iron Swan",subtitle:"Age of Winters",year:"2006"}},{id:"3",text:"The Dreamthieves",slotData:{icon:x,title:"The Dreamthieves",subtitle:"Low Country",year:"2016"}},{id:"4",text:"Twilight Sunrise",slotData:{icon:g,title:"Twilight Sunrise",subtitle:"Used Future",year:"2018"}}]},code(){return L}}},N={class:"grid-container"},P={class:"grid-item-5"},H={class:"grid-item-5"},W={class:"grid-item-2"},j={class:"grid-container"},R={class:"grid-item-5"},O={class:"grid-item-5"},K={class:"grid-item-2"},q={class:"grid-container"},J={class:"grid-item-5"},Q={class:"grid-item-2"},X={class:"grid-container"},Y={class:"grid-item-5"},Z={class:"grid-item-2"},$={class:"grid-container"},ee={class:"grid-item-5"},te={class:"grid-item-2"},oe={class:"grid-container"},ie={class:"grid-item-5"},le={class:"grid-item-2"},de={class:"grid-container"},se={class:"grid-item-5"},ae={class:"grid-item-2"},re={class:"grid-container"},ne={class:"grid-item-5"},ce={class:"grid-item-2"},ue={class:"grid-container"},pe={class:"grid-item-12"},me={class:"grid-container"},ve={class:"grid-item-5"},be={key:0,class:"slot-option"},he={class:"description"},xe={class:"title"},ge={key:1,class:"slot-option"},_e={class:"description"},we={class:"title"},Se={class:"subtitle"},fe={class:"year"},Be={class:"grid-item-2"},Ve={class:"grid-container"},De={class:"grid-item-12"};function ye(p,t,ze,Ie,o,b){const s=v("Dropdown",!0),w=v("LoadingIcon"),m=v("CodeExample");return r(),n("div",null,[e("section",null,[t[11]||(t[11]=B('<div class="grid-container" data-v-36925f8c><div class="grid-item-12" data-v-36925f8c><p data-v-36925f8c> A list of choices the user must choose one of them, so it emits an <code data-v-36925f8c>input</code> event when something is selected, and it has a <code data-v-36925f8c>value</code>. Keyboard navigation works (<code data-v-36925f8c>Enter</code><code data-v-36925f8c>Up</code>/<code data-v-36925f8c>Down</code> and <code data-v-36925f8c>Home</code>/<code data-v-36925f8c>End</code>, leave with <code data-v-36925f8c>Esc</code>). </p></div></div>',1)),e("div",N,[e("div",P,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=i=>o.selected=i),"aria-label":"A List","possible-values":[{id:"specialOption",text:"Some special option",isSpecial:!0},...Array.from({length:1e3},(i,u)=>({id:`Id ${u}`,text:`Option ${u}`}))]},null,8,["modelValue","possible-values"])]),e("div",H,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=i=>o.selected=i),"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",W,"selected id: "+l(o.selected),1)]),t[12]||(t[12]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The "),e("code",null,"placeholder"),a(" will be shown when no or empty "),e("code",null,"value"),a(" is set. Also it provides an invalid ("),e("code",null,"isValid=false"),a(") state. ")])])],-1)),e("div",j,[e("div",R,[d(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[2]||(t[2]=i=>o.placeholderModel=i),placeholder:"Placeholder…","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",O,[d(s,{modelValue:o.placeholderModel,"onUpdate:modelValue":t[3]||(t[3]=i=>o.placeholderModel=i),placeholder:"Placeholder…","is-valid":!1,"aria-label":"A limited list",size:"3","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"bar2",text:"Bar 2"},{id:"bar3",text:"Bar 3"},{id:"bar4",text:"Bar 4"},{id:"bar5",text:"Bar 5"},{id:"bar6",text:"Bar 6"},{id:"bar7",text:"Bar 8"},{id:"bar9",text:"Bar 9"},{id:"bar10",text:"Bar 10"},{id:"bar11",text:"Bar 11"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",K,"selected id: "+l(o.placeholderModel),1)]),t[13]||(t[13]=e("br",null,null,-1)),e("div",q,[e("div",J,[d(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[4]||(t[4]=i=>o.disabledSelected=i),placeholder:"Disabled...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",Q,"selected id: "+l(o.disabledSelected),1)]),t[14]||(t[14]=e("br",null,null,-1)),e("div",X,[e("div",Y,[d(s,{modelValue:o.disabledSelected,"onUpdate:modelValue":t[5]||(t[5]=i=>o.disabledSelected=i),placeholder:"No values present","aria-label":"A List"},null,8,["modelValue"])]),e("div",Z,"selected id: "+l(o.disabledSelected),1)]),t[15]||(t[15]=e("br",null,null,-1)),e("div",$,[e("div",ee,[d(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[6]||(t[6]=i=>o.withSlotsSelected=i),placeholder:"With slots...","aria-label":"A List","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},{"icon-right":c(()=>[d(w)]),_:1},8,["modelValue"])]),e("div",te,"selected id: "+l(o.withSlotsSelected),1)]),t[16]||(t[16]=e("br",null,null,-1)),e("div",oe,[e("div",ie,[d(s,{modelValue:o.withSlotsSelected,"onUpdate:modelValue":t[7]||(t[7]=i=>o.withSlotsSelected=i),placeholder:"In compact mode","aria-label":"A List",compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",le,"selected id: "+l(o.withSlotsSelected),1)]),t[17]||(t[17]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" The optional "),e("code",null,"direction"),a(" property can be used to display the dropdown above the input field. ")])])],-1)),e("div",de,[e("div",se,[d(s,{modelValue:o.dropupSelected,"onUpdate:modelValue":t[8]||(t[8]=i=>o.dropupSelected=i),"aria-label":"A Dropup","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],direction:"up"},null,8,["modelValue"])]),e("div",ae,"selected id: "+l(o.dropupSelected),1)]),t[18]||(t[18]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Dropdown with option groups")])],-1)),e("div",re,[e("div",ne,[d(s,{modelValue:o.withGroupSelected,"onUpdate:modelValue":t[9]||(t[9]=i=>o.withGroupSelected=i),placeholder:"With groups","aria-label":"Dropdown with groups","possible-values":[{id:"foo",text:"Foo",group:"Group a"},{id:"bar",text:"Bar",group:"Group a"},{id:"bar2",text:"Bar 2",group:"Group a"},{id:"bar3",text:"Bar 3",group:"Group b"},{id:"bar4",text:"Bar 4",group:"Group b"},{id:"bar5",text:"Bar 5",group:"Group c"},{id:"bar6",text:"Bar 6",group:"Group c"},{id:"bar7",text:"Bar 8",group:"Group c"},{id:"bar9",text:"Bar 9",group:"Group c"},{id:"bar10",text:"Bar 10",group:"Group c"}]},null,8,["modelValue"])]),e("div",ce,"selected id: "+l(o.withGroupSelected),1)]),t[19]||(t[19]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h4",null,"Slotted Dropdown"),e("p",null,[a(" The optional "),e("code",null,"slotData"),a(" property can be used to incorporate a slot into the dropdown list and render additional data in a styled fashion. The local value is passed through and available as a slot prop. Please keep in mind that the property names must match. ")])])],-1))]),e("section",null,[e("div",ue,[e("div",pe,[d(m,{summary:"Show usage example"},{default:c(()=>[a(l(o.codeExample),1)]),_:1})])])]),e("section",null,[e("div",me,[e("div",ve,[d(s,{modelValue:o.slottedSelected,"onUpdate:modelValue":t[10]||(t[10]=i=>o.slottedSelected=i),"aria-label":"A limited list",size:"3","possible-values":b.slottedExamplePossibleValue},{option:c(({slotData:i,isMissing:u,selectedValue:S}={slotData:{}})=>[u?(r(),n("div",be,[e("div",he,[e("div",xe,"(MISSING) "+l(S),1)])])):(r(),n("div",ge,[(r(),V(D(i.icon))),e("div",_e,[e("div",we,l(i.title),1),e("div",Se,l(i.subtitle),1)]),e("div",fe,l(i.year),1)]))]),_:1},8,["modelValue","possible-values"])]),e("div",Be,"selected id: "+l(o.slottedSelected),1)])]),e("section",null,[e("div",Ve,[e("div",De,[d(m,{summary:"Show slotted usage example"},{default:c(()=>[a(l(o.slottedCodeExample),1)]),_:1}),d(m,{summary:"Show Dropdown.vue source code"},{default:c(()=>[a(l(b.code),1)]),_:1})])])])])}const Ne=f(F,[["render",ye],["__scopeId","data-v-36925f8c"]]);export{Ne as default};
