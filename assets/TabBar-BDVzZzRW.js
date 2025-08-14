import{_ as m,a3 as c,r as u,c as v,o as T,b as l,d as b,e as s,t as n,w as p,H as f,h as B}from"./index-DRvYTa_0.js";import{H as C,S as g}from"./star-BoR9RpYm.js";import{C as V}from"./CodeExample-WcEVHjl5.js";const k="",x=`<script>
import TabBar from "~/webapps-common/ui/components/TabBar.vue";
import BulbIcon from "~/@knime/styles/img/icons/bulb.svg";
import HelpIcon from "~/@knime/styles/img/icons/circle-help.svg";

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
</template>`,S=[{value:"apples",label:"Apples",title:"Click for apples",icon:f},{value:"oranges",label:"Oranges",title:"Click for oranges",icon:C},{label:"Bananas (out of stock)",title:"Currently no bananas, sorry!",value:"bananas",extraComponent:B({template:`<button class="extra-component" onclick="alert('Bananas ordered')">Order more</button>`}),disabled:!0}],I={components:{TabBar:c,CodeExample:V},data(){return{activeTab:null,tabbarCode:k,codeExampleStandalone:x,activeTabStandalone:"oranges",disabled:!1,bananasDisabled:!0}},computed:{possibleTabValuesStandalone(){let t=[...this.possibleTabValues];return t[2]={...t[2],disabled:this.bananasDisabled,label:this.bananasDisabled?"Bananas (out of stock)":"Bananas!",title:this.bananasDisabled?"Currently no bananas, sorry!":"Click for bananas",icon:this.bananasDisabled?null:g},[...t]},possibleTabValues(){return S}}},y={class:"grid-container"},D={class:"grid-item-12"};function w(t,e,E,H,a,i){const r=u("TabBar",!0),d=u("CodeExample");return T(),v("section",null,[l("div",y,[l("div",D,[e[8]||(e[8]=l("p",null,[s(" The tab bar can be used as a standalone component or together with the included mixin, which syncs the selected value to the "),l("code",null,"activeTab"),s(" value: ")],-1)),e[9]||(e[9]=l("h4",null,"Standalone",-1)),b(r,{modelValue:a.activeTabStandalone,"onUpdate:modelValue":e[0]||(e[0]=o=>a.activeTabStandalone=o),disabled:a.disabled,"possible-values":i.possibleTabValuesStandalone,name:"t1"},null,8,["modelValue","disabled","possible-values"]),l("p",null,[e[4]||(e[4]=l("b",null,"active tab:",-1)),s(" "+n(a.activeTabStandalone),1)]),l("p",null,[e[5]||(e[5]=s(" Individual items can be disabled ",-1)),l("button",{onClick:e[1]||(e[1]=o=>a.bananasDisabled=!a.bananasDisabled)},n(a.bananasDisabled?"enable":"disable"),1),e[6]||(e[6]=s(", also the whole bar can be disabled: ",-1)),l("button",{onClick:e[2]||(e[2]=o=>a.disabled=!a.disabled)},n(a.disabled?"enable":"disable"),1)]),b(d,{summary:"Show usage example (standalone)"},{default:p(()=>[s(n(a.codeExampleStandalone),1)]),_:1}),e[10]||(e[10]=l("h4",null,"With Mixin",-1)),b(r,{modelValue:a.activeTab,"onUpdate:modelValue":e[3]||(e[3]=o=>a.activeTab=o),"possible-values":i.possibleTabValues,name:"t2"},null,8,["modelValue","possible-values"]),l("p",null,[e[7]||(e[7]=l("b",null,"active tab:",-1)),s(" "+n(a.activeTab),1)]),b(d,{summary:"Show TabBar.vue source code"},{default:p(()=>[s(n(a.tabbarCode),1)]),_:1})])])])}const A=m(I,[["render",w],["__scopeId","data-v-f92ab2d1"]]);export{A as default};
