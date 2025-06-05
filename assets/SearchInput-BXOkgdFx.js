import{F as h}from"./filter-BpQL3F07.js";import{C as V}from"./CodeExample-DJVnkR8W.js";import{_ as v,a$ as S,r as i,o as b,c as f,b as l,e as s,d as n,w as r,t as c}from"./index-C4N8Hs82.js";const I="",F=`<SearchInput
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
`,w={components:{SearchInput:S,FilterIcon:h,CodeExample:V},data(){return{codeExample:F,inputValue:"",inputValue2:"",inputValue3:"Demo",inputValue4:"",inputValue5:"Demo"}},computed:{code(){return I}},methods:{alert(a){window.alert(a)}}},C={class:"grid-container"},g={class:"grid-item-6 inputs"},x={class:"grid-item-6"},U={class:"grid-container"},y={class:"grid-item-12"};function E(a,e,B,P,o,d){const u=i("SearchInput",!0),m=i("FilterIcon"),p=i("CodeExample");return b(),f("div",null,[l("section",null,[e[13]||(e[13]=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,[s(" Single line string search input with search icon and clear button. It acts as a form element, so it emits "),l("code",null,"input"),s(" events and it has a "),l("code",null,"value"),s(". Optionally, buttons for case-sensitive search and inverse searchc an be shown. ")])])],-1)),l("div",C,[l("div",g,[n(u,{modelValue:o.inputValue,"onUpdate:modelValue":e[0]||(e[0]=t=>o.inputValue=t),label:"Search things",placeholder:"Placeholder"},null,8,["modelValue"]),n(u,{modelValue:o.inputValue2,"onUpdate:modelValue":e[1]||(e[1]=t=>o.inputValue2=t)},null,8,["modelValue"]),n(u,{"model-value":"disabled: no search possible here",disabled:""}),e[8]||(e[8]=s(' The clear-all button emits a "clear" event that can be listend to: ')),n(u,{modelValue:o.inputValue3,"onUpdate:modelValue":e[2]||(e[2]=t=>o.inputValue3=t),placeholder:"Placeholder",onClear:e[3]||(e[3]=t=>d.alert("Search cleared"))},null,8,["modelValue"]),e[9]||(e[9]=s(" It's possible to use a different icon: ")),n(u,{modelValue:o.inputValue4,"onUpdate:modelValue":e[4]||(e[4]=t=>o.inputValue4=t),placeholder:"A different icon",onFocus:a.onFocus},{icon:r(()=>[n(m)]),_:1},8,["modelValue","onFocus"]),e[10]||(e[10]=s(" Buttons for the search options case-sensitivity and inverse-search can be displayed. ")),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[5]||(e[5]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,placeholder:"Search",onFocus:a.onFocus},null,8,["modelValue","onFocus"]),e[11]||(e[11]=s(" Custom title for the buttons ")),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[6]||(e[6]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,tooltips:{clear:"Custom clear tooltip",inverseSearch:"Custom inverse tooltip",caseSensitive:"Custom case sensitive tooltip"},placeholder:"Search",onFocus:a.onFocus},null,8,["modelValue","onFocus"]),e[12]||(e[12]=s(" Compact mode ")),n(u,{modelValue:o.inputValue5,"onUpdate:modelValue":e[7]||(e[7]=t=>o.inputValue5=t),"show-case-sensitive-search-button":!0,"show-inverse-search-button":!0,"initial-inverse-search":!0,tooltips:{clear:"Custom clear tooltip",inverseSearch:"Custom inverse tooltip",caseSensitive:"Custom case sensitive tooltip"},placeholder:"Search",compact:"",onFocus:a.onFocus},null,8,["modelValue","onFocus"])]),l("div",x,"input value: "+c(o.inputValue),1)])]),l("section",null,[l("div",U,[l("div",y,[n(p,{summary:"Show usage example"},{default:r(()=>[s(c(o.codeExample),1)]),_:1}),n(p,{summary:"Show SearchInput.vue source code"},{default:r(()=>[s(c(d.code),1)]),_:1})])])])])}const T=v(w,[["render",E],["__scopeId","data-v-0f8df632"]]);export{T as default};
