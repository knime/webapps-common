import{B as m}from"./bulb-CtbK_kPA.js";import{S as v,H as T}from"./star-DAyyD1qt.js";import{C as f}from"./CodeExample-C-SDKnkE.js";import{_ as h,a7 as _,r as c,o as B,c as g,b as a,d as b,e as o,t as n,w as p,p as V,f as C}from"./index-B4-vpAm-.js";const S="",k=`<script>
import TabBar from '~/webapps-common/ui/components/TabBar.vue';
import BulbIcon from '~/@knime/styles/img/icons/bulb.svg';
import HelpIcon from '~/@knime/styles/img/icons/circle-help.svg';

export default {
    components: {
        TabBar,
        BulbIcon,
        HelpIcon
    },
    data() {
        return {
            activeTab: 'oranges'
        };
    },
    computed: {
        possibleTabValues() {
            return [{
                value: 'apples',
                label: 'Apples',
                title: 'Click for apples',
                icon: BulbIcon
            }, {
                value: 'oranges',
                label: 'Oranges',
                title: 'Click for oranges',
                icon: HelpIcon
            }, {
                label: 'Bananas (out of stock)',
                value: 'bananas',
                title: 'Click for bananas',
                disabled: true
            }];
        }
    }
};
<\/script>

<template>
  <TabBar
    :model-value="oranges"
    :possible-values="possibleTabValues"
    :disabled="false"
    @update:modelValue="activeTab = $event"
  />
  <!-- OR -->
  <TabBar
    v-model="oranges"
    :possible-values="possibleTabValues"
    :disabled="false"
  />
</template>`,x=[{value:"apples",label:"Apples",title:"Click for apples",icon:m},{value:"oranges",label:"Oranges",title:"Click for oranges",icon:T},{label:"Bananas (out of stock)",title:"Currently no bananas, sorry!",value:"bananas",disabled:!0}],I={components:{TabBar:_,CodeExample:f},data(){return{activeTab:null,tabbarCode:S,codeExampleStandalone:k,activeTabStandalone:"oranges",disabled:!1,bananasDisabled:!0}},computed:{possibleTabValuesStandalone(){let l=[...this.possibleTabValues];return l[2]={...l[2],disabled:this.bananasDisabled,label:this.bananasDisabled?"Bananas (out of stock)":"Bananas!",title:this.bananasDisabled?"Currently no bananas, sorry!":"Click for bananas",icon:this.bananasDisabled?null:v},[...l]},possibleTabValues(){return x}}},i=l=>(V("data-v-e62d22f0"),l=l(),C(),l),y={class:"grid-container"},w={class:"grid-item-12"},D=i(()=>a("p",null,[o(" The tab bar can be used as a standalone component or together with the included mixin, which syncs the selected value to the "),a("code",null,"activeTab"),o(" value: ")],-1)),E=i(()=>a("h4",null,"Standalone",-1)),H=i(()=>a("b",null,"active tab:",-1)),N=i(()=>a("h4",null,"With Mixin",-1)),O=i(()=>a("b",null,"active tab:",-1));function A(l,s,U,M,e,r){const d=c("TabBar",!0),u=c("CodeExample");return B(),g("section",null,[a("div",y,[a("div",w,[D,E,b(d,{modelValue:e.activeTabStandalone,"onUpdate:modelValue":s[0]||(s[0]=t=>e.activeTabStandalone=t),disabled:e.disabled,"possible-values":r.possibleTabValuesStandalone,name:"t1"},null,8,["modelValue","disabled","possible-values"]),a("p",null,[H,o(" "+n(e.activeTabStandalone),1)]),a("p",null,[o(" Individual items can be disabled "),a("button",{onClick:s[1]||(s[1]=t=>e.bananasDisabled=!e.bananasDisabled)},n(e.bananasDisabled?"enable":"disable"),1),o(", also the whole bar can be disabled: "),a("button",{onClick:s[2]||(s[2]=t=>e.disabled=!e.disabled)},n(e.disabled?"enable":"disable"),1)]),b(u,{summary:"Show usage example (standalone)"},{default:p(()=>[o(n(e.codeExampleStandalone),1)]),_:1}),N,b(d,{modelValue:e.activeTab,"onUpdate:modelValue":s[3]||(s[3]=t=>e.activeTab=t),"possible-values":r.possibleTabValues,name:"t2"},null,8,["modelValue","possible-values"]),a("p",null,[O,o(" "+n(e.activeTab),1)]),b(u,{summary:"Show TabBar.vue source code"},{default:p(()=>[o(n(e.tabbarCode),1)]),_:1})])])])}const z=h(I,[["render",A],["__scopeId","data-v-e62d22f0"]]);export{z as default};
