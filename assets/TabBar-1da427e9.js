import{C as m}from"./CodeExample-60532086.js";import{_ as v,X as h,o as f,c as g,b as n,d as r,e as t,t as s,w as u,r as c,p as k,f as x}from"./index-7a3f45dd.js";import{B as T}from"./bulb-c5682d5d.js";import{S as y,H as _}from"./star-0c66e0cf.js";const w=`<script>
import Carousel from './Carousel.vue';

/**
 * A radio button group that looks like a tab bar
*/
export default {
    components: {
        Carousel
    },
    props: {
        /**
         * Make the whole tab bar read-only
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Selected value. Should be one of the value attributes in the \`possibleValues\` prop.
         */
        modelValue: {
            type: String,
            default: ''
        },
        /**
         * Name of the form elements. This is useful when using the tab bar inside a <form>.
         * Defaults to \`value\`.
         * If you have multiple tab bars on one page, make sure to include them in separate forms or use unique \`name\`
         * properties. Otherwise the browser will not allow to select more than one tab in total.
         */
        name: {
            type: String,
            default: 'value'
        },
        /**
         * @example
           [{
               value: 'all',
               label: 'All',
               icon: null,
               title: 'everything',
               disabled: false
           }, {
               value: 'nodes',
               label: 'Nodes',
               icon: NodeIcon,
               title: 'Nodes!',
               disabled: true
           }, {
               value: 'workflows',
               label: 'Workflows',
               icon: WorkflowIcon,
               disabled: true
           }]
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(items = []) {
                if (!Array.isArray(items)) {
                    return false;
                }
                return items.every(item => item.value);
            }
        }
    },
    emits: ['update:modelValue'],
    created() {
        const firstTab = this.possibleValues.find(tab => !tab.disabled);
        consola.trace('TabBar: Setting initial tab', firstTab);
        this.$emit('update:modelValue', firstTab ? firstTab.value : null);
    },
    methods: {
        onChange(value) {
            /**
             * Update event. Fired when the selection is changed.
             *
             * @event update:value
             * @type {String}
             */
            consola.trace('TabBar value changed to', value);
            this.$emit('update:modelValue', value);
        }
    }
};
<\/script>

<template>
  <Carousel>
    <div class="tab-bar">
      <div class="overflow">
        <label
          v-for="item in possibleValues"
          :key="item.value"
          :title="item.title"
        >
          <input
            :name="name"
            :value="item.value"
            :disabled="disabled || item.disabled"
            type="radio"
            :checked="item.value === modelValue"
            @change="onChange(item.value)"
          >
          <span>
            <Component
              :is="item.icon"
              v-if="item.icon"
            />
            {{ item.label }}
          </span>
        </label>
      </div>
    </div>
  </Carousel>
</template>

<style lang="postcss" scoped>
.tab-bar {
  width: 100%;
  position: relative;
  margin-top: -20px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: inline-block;
  z-index: 1; /* create local stacking context */

  & .overflow {
    height: 55px;
  }
}

:deep(.carousel::after) {
  content: "";
  display: block;
  position: absolute;
  border-bottom: 1px solid var(--knime-silver-sand);
  left: var(--grid-gap-width);
  right: var(--grid-gap-width);
  bottom: 26px;
}


label {
  position: relative;
}

input[type="radio"] {
  /* https://accessibility.18f.gov/hidden-content/ */
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  top: 0; /* top/left prevent right margin mobile safari */
  left: 0;
}

span {
  position: relative;
  font-size: 16px;
  font-weight: 500;
  padding: 0 10px;
  display: inline-block;
  height: 51px;
  line-height: 51px;
  color: var(--knime-dove-gray);
}

label:not(:last-child) {
  margin-right: 10px;
}

svg {
  display: inline-block;
  vertical-align: -5px;
  width: 21px;
  height: 21px;
  margin-right: 2px;
  stroke: var(--knime-dove-gray);
  stroke-width: calc(32px / 21);
}

input:disabled + span {
  color: var(--knime-silver-sand);

  & svg {
    stroke: var(--knime-silver-sand);
  }
}

input:not(:checked, :disabled) + span {
  cursor: pointer;
}

input:not(:disabled):checked + span,
input:not(:disabled) + span:hover {
  color: var(--knime-masala);

  & svg {
    stroke: var(--knime-masala);
  }
}

input:checked:not(:disabled) + span::after {
  content: "";
  position: absolute;
  display: block;
  bottom: 1px;
  left: 0;
  right: 0;
  border-top: 3px solid var(--knime-masala);
  z-index: 1; /* local stacking context because Carousel.vue has isolation: isolate; */
}

</style>
`;const B=`<script>
import TabBar from '~/webapps-common/ui/components/TabBar.vue';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';
import HelpIcon from '~/webapps-common/ui/assets/img/icons/circle-help.svg';

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
</template>`,V=[{value:"apples",label:"Apples",title:"Click for apples",icon:T},{value:"oranges",label:"Oranges",title:"Click for oranges",icon:_},{label:"Bananas (out of stock)",title:"Currently no bananas, sorry!",value:"bananas",disabled:!0}],C={components:{TabBar:h,CodeExample:m},data(){return{activeTab:null,tabbarCode:w,codeExampleStandalone:B,activeTabStandalone:"oranges",disabled:!1,bananasDisabled:!0}},computed:{possibleTabValuesStandalone(){let a=[...this.possibleTabValues];return a[2]={...a[2],disabled:this.bananasDisabled,label:this.bananasDisabled?"Bananas (out of stock)":"Bananas!",title:this.bananasDisabled?"Currently no bananas, sorry!":"Click for bananas",icon:this.bananasDisabled?null:y},[...a]},possibleTabValues(){return V}}},o=a=>(k("data-v-dffb3f38"),a=a(),x(),a),S={class:"grid-container"},I={class:"grid-item-12"},D=o(()=>n("h2",null,"TabBar",-1)),A=o(()=>n("p",null,[t(" The tab bar can be used as a standalone component or together with the included mixin, which syncs the selected value to the "),n("code",null,"activeTab"),t(" value: ")],-1)),N=o(()=>n("h4",null,"Standalone",-1)),E=o(()=>n("b",null,"active tab:",-1)),H=o(()=>n("h4",null,"With Mixin",-1)),O=o(()=>n("b",null,"active tab:",-1));function z(a,l,U,W,e,d){const b=c("TabBar",!0),p=c("CodeExample");return f(),g("section",null,[n("div",S,[n("div",I,[D,A,N,r(b,{modelValue:e.activeTabStandalone,"onUpdate:modelValue":l[0]||(l[0]=i=>e.activeTabStandalone=i),disabled:e.disabled,"possible-values":d.possibleTabValuesStandalone,name:"t1"},null,8,["modelValue","disabled","possible-values"]),n("p",null,[E,t(" "+s(e.activeTabStandalone),1)]),n("p",null,[t(" Individual items can be disabled "),n("button",{onClick:l[1]||(l[1]=i=>e.bananasDisabled=!e.bananasDisabled)},s(e.bananasDisabled?"enable":"disable"),1),t(", also the whole bar can be disabled: "),n("button",{onClick:l[2]||(l[2]=i=>e.disabled=!e.disabled)},s(e.disabled?"enable":"disable"),1)]),r(p,{summary:"Show usage example (standalone)"},{default:u(()=>[t(s(e.codeExampleStandalone),1)]),_:1}),H,r(b,{modelValue:e.activeTab,"onUpdate:modelValue":l[3]||(l[3]=i=>e.activeTab=i),"possible-values":d.possibleTabValues,name:"t2"},null,8,["modelValue","possible-values"]),n("p",null,[O,t(" "+s(e.activeTab),1)]),r(p,{summary:"Show TabBar.vue source code"},{default:u(()=>[t(s(e.tabbarCode),1)]),_:1})])])])}const X=v(C,[["render",z],["__scopeId","data-v-dffb3f38"]]);export{X as default};
