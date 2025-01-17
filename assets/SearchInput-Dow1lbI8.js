import{F as h}from"./filter-Bj1-RX7z.js";import{C as V}from"./CodeExample-C48iMfwn.js";import{_ as v,aU as S,r as i,o as f,c as b,b as l,d as n,e as a,w as r,t as c,p as I,f as F}from"./index-BBUP89dB.js";const w="",C=`<SearchInput
  v-model="inputValue"
  label="Search things"
  placeholder="Placeholder"
/>
<SearchInput />
<SearchInput
  model-value="disabled: no search possible here"
  disabled
/>
<SearchInput
  v-model="inputValue3"
  placeholder="Placeholder"
  @clear="alert('Search cleared')"
/>
<SearchInput
  v-model="inputValue"
  @focus="onFocus"
/>
<SearchInput
  v-model="inputValue4"
  @focus="onFocus"
>
  <template #icon>
    <FilterIcon />
  </template>
</SearchInput>
<SearchInput
  v-model="inputValue5"
  :show-case-sensitive-search-button="true"
  :show-inverse-search-button="true"
  :initial-inverse-search="true"
  @focus="onFocus"
/>
`,g={components:{SearchInput:S,FilterIcon:h,CodeExample:V},data(){return{codeExample:C,inputValue:"",inputValue2:"",inputValue3:"Demo",inputValue4:"",inputValue5:"Demo"}},computed:{code(){return w}},methods:{alert(s){window.alert(s)}}},_=s=>(I("data-v-0f8df632"),s=s(),F(),s),U=_(()=>l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,[a(" Single line string search input with search icon and clear button. It acts as a form element, so it emits "),l("code",null,"input"),a(" events and it has a "),l("code",null,"value"),a(". Optionally, buttons for case-sensitive search and inverse searchc an be shown. ")])])],-1)),x={class:"grid-container"},y={class:"grid-item-6 inputs"},E={class:"grid-item-6"},B={class:"grid-container"},P={class:"grid-item-12"};function D(s,e,N,k,o,p){const u=i("SearchInput",!0),m=i("FilterIcon"),d=i("CodeExample");return f(),b("div",null,[l("section",null,[U,l("div",x,[l("div",y,[n(u,{modelValue:o.inputValue,"onUpdate:modelValue":e[0]||(e[0]=t=>o.inputValue=t),label:"Search things",placeholder:"Placeholder"},null,8,["modelValue"]),n(u,{modelValue:o.inputValue2,"onUpdate:modelValue":e[1]||(e[1]=t=>o.inputValue2=t)},null,8,["modelValue"]),n(u,{"model-value":"disabled: no search possible here",disabled:""}),a(' The clear-all button emits a "clear" event that can be listend to: '),n(u,{modelValue:o.inputValue3,"onUpdate:modelValue":e[2]||(e[2]=t=>o.inputValue3=t),placeholder:"Placeholder",onClear:e[3]||(e[3]=t=>p.alert("Search cleared"))},null,8,["modelValue"]),a(" It's possible to use a different icon: "),n(u,{modelValue:o.inputValue4,"onUpdate:modelValue":e[4]||(e[4]=t=>o.inputValue4=t),placeholder:"A different icon",onFocus:s.onFocus},{icon:r(()=>[n(m)]),_:1},8,["modelValue","onFocus"]),a(" Buttons for the search options case-sensitivity and inverse-search can be displayed. "),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[5]||(e[5]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,placeholder:"Search",onFocus:s.onFocus},null,8,["modelValue","onFocus"]),a(" Custom title for the buttons "),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[6]||(e[6]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,tooltips:{clear:"Custom clear tooltip",inverseSearch:"Custom inverse tooltip",caseSensitive:"Custom case sensitive tooltip"},placeholder:"Search",onFocus:s.onFocus},null,8,["modelValue","onFocus"]),a(" Compact mode "),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[7]||(e[7]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,tooltips:{clear:"Custom clear tooltip",inverseSearch:"Custom inverse tooltip",caseSensitive:"Custom case sensitive tooltip"},placeholder:"Search",compact:"",onFocus:s.onFocus},null,8,["modelValue","onFocus"])]),l("div",E,"input value: "+c(o.inputValue),1)])]),l("section",null,[l("div",B,[l("div",P,[n(d,{summary:"Show usage example"},{default:r(()=>[a(c(o.codeExample),1)]),_:1}),n(d,{summary:"Show SearchInput.vue source code"},{default:r(()=>[a(c(p.code),1)]),_:1})])])])])}const j=v(g,[["render",D],["__scopeId","data-v-0f8df632"]]);export{j as default};
