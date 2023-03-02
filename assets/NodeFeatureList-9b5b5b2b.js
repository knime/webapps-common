import{C as k}from"./CodeExample-7b407f07.js";import{o as e,c as s,b as o,_ as f,D,r as p,t as y,j as c,l as h,F as g,g as v,d as _,n as x,a3 as T,w as P,e as N,k as V,O as L,a4 as O,a1 as C,a2 as A,p as S,f as $}from"./index-0daf2d62.js";import{P as B}from"./PortIcon-256b5fb0.js";import{C as F}from"./Collapser-ab06d0ce.js";import"./arrow-dropdown-5800a229.js";import"./ExpandTransition-733bcc7a.js";const z={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},M=o("path",{d:"M13.2 6.2c-3.8 2.1-5.1 7-3 10.8s7 5.1 10.8 3l4.4-2.6-7.8-13.7-4.4 2.5zm6.9 1.9 5.7-3.2m-2.9 8.2 5.7-3.2M10.2 17c-1.9 1.1-7.3 1.8-5.1 5.9s-1.7 5.4-1.7 5.4"},null,-1),E=[M];function j(i,u){return e(),s("svg",z,E)}const K={render:j},W={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},R=o("path",{d:"M29.5 16c0-2.2-4.4-9-13.5-9S2.5 13.8 2.5 16m27 0c0 2.2-4.4 9-13.5 9S2.5 18.2 2.5 16"},null,-1),U=o("circle",{cx:"16",cy:"16",r:"4.5"},null,-1),q=[R,U];function H(i,u){return e(),s("svg",W,q)}const I={render:H},J={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Q=o("path",{d:"M7 13.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.2-2.5-2.5-2.5zm9 5.1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm9-6.8c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm-9 11.5v4m0-22.6v14.1m-9-.5v9M7 4.7v9m18 2.8v10.8m0-22.6V12"},null,-1),X=[Q];function Y(i,u){return e(),s("svg",J,X)}const Z={render:Y};const G={components:{Description:D,PortIcon:B},props:{ports:{type:Array,default:()=>[]},title:{type:String,default:"Input ports"},groupDescription:{type:String,default:null}},computed:{dynamicPorts(){return Boolean(this.groupDescription)}}},ee={class:"wrapper"},te={class:"content"},oe={viewBox:"-4.5 -4.5 9 9",width:"12",height:"12"},ne={key:0,class:"port-name"};function se(i,u,t,b,m,r){const a=p("Description"),n=p("PortIcon");return e(),s("div",ee,[o("h6",null,y(t.title),1),o("div",te,[r.dynamicPorts?(e(),c(a,{key:0,text:t.groupDescription,"render-as-html":"",class:"dyn-ports-description"},null,8,["text"])):h("",!0),o("ol",null,[(e(!0),s(g,null,v(t.ports,(l,d)=>(e(),s("li",{key:d},[(e(),s("svg",oe,[_(n,{color:l.color,filled:!l.optional,type:l.type},null,8,["color","filled","type"])])),o("div",{class:x(["port-type",{fat:!r.dynamicPorts}])},"Type: "+y(l.typeName),3),!r.dynamicPorts&&l.name?(e(),s("div",ne,y(l.name),1)):h("",!0),!r.dynamicPorts&&l.description?(e(),c(a,{key:1,text:l.description,"render-as-html":"",class:"port-description"},null,8,["text"])):h("",!0)]))),128))])])])}const ie=f(G,[["render",se],["__scopeId","data-v-d1ff6aa3"]]),re={components:{PortGroup:ie},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0}}},ae={key:0,class:"ports-list"};function le(i,u,t,b,m,r){const a=p("PortGroup");return r.hasPorts?(e(),s("div",ae,[t.inPorts.length?(e(),c(a,{key:0,class:"inports",title:"Input ports",ports:t.inPorts},null,8,["ports"])):h("",!0),t.outPorts.length?(e(),c(a,{key:1,class:"outports",title:"Output ports",ports:t.outPorts},null,8,["ports"])):h("",!0),(e(!0),s(g,null,v(t.dynInPorts,n=>(e(),c(a,{key:n.groupName,title:n.groupName+" (Dynamic Inport)","group-description":n.groupDescription,ports:n.types},null,8,["title","group-description","ports"]))),128)),(e(!0),s(g,null,v(t.dynOutPorts,n=>(e(),c(a,{key:n.groupName,title:n.groupName+" (Dynamic Outport)","group-description":n.groupDescription,ports:n.types},null,8,["title","group-description","ports"]))),128))])):h("",!0)}const ce=f(re,[["render",le]]);const pe={components:{Description:D,StandardIcon:I,InteractiveIcon:T},props:{views:{type:Array,default:()=>[]}}},de={key:0,class:"views-list"},ue={class:"content"},me={class:"name"};function ye(i,u,t,b,m,r){const a=p("InteractiveIcon"),n=p("StandardIcon"),l=p("Description");return t.views.length?(e(),s("ul",de,[(e(!0),s(g,null,v(t.views,(d,w)=>(e(),s("li",{key:w},[o("h6",null,[d.interactive?(e(),c(a,{key:0,class:"interactive"})):(e(),c(n,{key:1})),o("span",null,y(d.interactive?"Interactive":"Standard"),1)]),o("div",ue,[o("span",me,y(d.name),1),_(l,{text:d.description,"render-as-html":""},null,8,["text"])])]))),128))])):h("",!0)}const he=f(pe,[["render",ye],["__scopeId","data-v-3de5b6cb"]]);const _e={components:{Collapser:F,Description:D},props:{options:{type:Array,default:()=>[]},sanitizeContent:{type:Boolean,default:!1}},computed:{renderableOptions(){return this.options.filter(i=>i.fields&&i.fields.length||i.sectionDescription)}}},ge={key:0,class:"dialog-options"},ve={class:"panel"},fe={class:"option-field-name"},be={key:0,class:"optional"};function we(i,u,t,b,m,r){const a=p("Description");return r.renderableOptions.length?(e(),s("div",ge,[(e(!0),s(g,null,v(r.renderableOptions,(n,l)=>(e(),c(V(n.sectionName?"Collapser":"div"),{key:l,class:x(["options",{"with-section":n.sectionName}]),"initially-expanded":t.options.length===1},{title:P(()=>[o("h5",null,y(n.sectionName),1)]),default:P(()=>[n.sectionDescription?(e(),c(a,{key:0,text:n.sectionDescription,"render-as-html":!t.sanitizeContent,class:"section-description"},null,8,["text","render-as-html"])):h("",!0),o("ul",ve,[(e(!0),s(g,null,v(n.fields,(d,w)=>(e(),s("li",{key:w},[o("p",fe,[N(y(d.name)+" ",1),d.optional?(e(),s("span",be," (optional) ")):h("",!0)]),_(a,{class:"option-description",text:d.description,"render-as-html":!t.sanitizeContent},null,8,["text","render-as-html"])]))),128))])]),_:2},1032,["class","initially-expanded"]))),128))])):h("",!0)}const Pe=f(_e,[["render",we],["__scopeId","data-v-ce0c531c"]]);const Ne={components:{TabBar:L,DialogOptions:Pe,PortsList:ce,ViewsList:he},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]},options:{type:Array,default:()=>[]},views:{type:Array,default:()=>[]},emptyText:{type:String,default:"This node does not provide any ports, options or views."},sanitizeContent:{type:Boolean,default:!1}},data(){return{activeTab:null}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0},possibleTabValues(){return[{value:"ports",label:"Ports",icon:K,disabled:!this.hasPorts},{value:"node-dialog-options",label:"Options",icon:Z,disabled:this.options.length===0},{value:"views",label:"Views",icon:I,disabled:this.views.length===0}]}}},De={class:"feature-list"},xe={key:3,class:"placeholder"};function Ie(i,u,t,b,m,r){const a=p("TabBar"),n=p("PortsList"),l=p("DialogOptions"),d=p("ViewsList");return e(),s("div",De,[_(a,{modelValue:m.activeTab,"onUpdate:modelValue":u[0]||(u[0]=w=>m.activeTab=w),"possible-values":r.possibleTabValues,name:"feature"},null,8,["modelValue","possible-values"]),(e(),c(O,null,[m.activeTab==="ports"?(e(),c(n,{key:0,"in-ports":t.inPorts,"out-ports":t.outPorts,"dyn-in-ports":t.dynInPorts,"dyn-out-ports":t.dynOutPorts},null,8,["in-ports","out-ports","dyn-in-ports","dyn-out-ports"])):m.activeTab==="node-dialog-options"?(e(),c(l,{key:1,"sanitize-content":t.sanitizeContent,options:t.options},null,8,["sanitize-content","options"])):m.activeTab==="views"?(e(),c(d,{key:2,views:t.views},null,8,["views"])):(e(),s("p",xe,y(t.emptyText),1))],1024))])}const ke=f(Ne,[["render",Ie],["__scopeId","data-v-bb9ed88b"]]),Te=`<script>
import PortIcon from '../../assets/img/icons/plugin.svg';
import ViewsIcon from '../../assets/img/icons/eye.svg';
import OptionsIcon from '../../assets/img/icons/settings.svg';
import TabBar from '../TabBar.vue';
import PortsList from './PortsList.vue';
import ViewsList from './ViewsList.vue';
import DialogOptions from './DialogOptions.vue';

export default {
    components: {
        TabBar,
        DialogOptions,
        PortsList,
        ViewsList
    },
    props: {
        /** Passed through to PortsList.vue */
        inPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        outPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        dynInPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        dynOutPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to DialogOptions.vue */
        options: {
            type: Array,
            default: () => []
        },
        /** Passed through to ViewsList.vue */
        views: {
            type: Array,
            default: () => []
        },
        /** Text that is show if node has neither views, options nor ports */
        emptyText: {
            type: String,
            default: 'This node does not provide any ports, options or views.'
        },
        /** Passed through to DialogOptions.vue */
        sanitizeContent: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeTab: null
        };
    },
    computed: {
        hasPorts() {
            return this.inPorts.length > 0 || this.outPorts.length > 0 || this.dynInPorts.length > 0 ||
            this.dynOutPorts.length > 0;
        },
        possibleTabValues() {
            return [{
                value: 'ports',
                label: 'Ports',
                icon: PortIcon,
                disabled: !this.hasPorts
            }, {
                value: 'node-dialog-options',
                label: 'Options',
                icon: OptionsIcon,
                disabled: this.options.length === 0
            }, {
                value: 'views',
                label: 'Views',
                icon: ViewsIcon,
                disabled: this.views.length === 0
            }];
        }
    }
};
<\/script>

<template>
  <div class="feature-list">
    <TabBar
      v-model="activeTab"
      :possible-values="possibleTabValues"
      name="feature"
    />
    <KeepAlive>
      <PortsList
        v-if="activeTab === 'ports'"
        :in-ports="inPorts"
        :out-ports="outPorts"
        :dyn-in-ports="dynInPorts"
        :dyn-out-ports="dynOutPorts"
      />
      <DialogOptions
        v-else-if="activeTab === 'node-dialog-options'"
        :sanitize-content="sanitizeContent"
        :options="options"
      />
      <ViewsList
        v-else-if="activeTab === 'views'"
        :views="views"
      />
      <p
        v-else
        class="placeholder"
      >
        {{ emptyText }}
      </p>
    </KeepAlive>
  </div>
</template>

<style lang="postcss" scoped>
.placeholder {
  font-size: 13px;
  font-weight: 300;
  color: var(--knime-dove-gray);
}
</style>
`;const Ve=`<NodeFeatureList
  :in-ports="[{
    type: 'table',
    typeName: 'Table',
    optional: false,
    name: 'Corpus of Documents',
    description: 'An input table containing the original corpus with the related document vectors.'
  }]"
  :dyn-in-ports="[{
    groupName: 'Captured workflow inputs',
    groupDescription: 'The dynamic inputs of the workflow fragment starting with this node.',
    types: [
      { type: 'table', typeName: 'Table' },
      { type: 'flowVariable', typeName: 'Flow Variable' },
      { color: '#41be78', type: 'other', typeName: 'Image' },
      { color: '#9b9b9b', type: 'other', typeName: 'Distance Measure' },
      { color: '#1469af', type: 'other', typeName: 'PMML' },
      { color: '#1eb9dc', type: 'other', typeName: 'Naive Bayes' },
    ]
  }]"
  :out-ports="[{
    type: 'table',
    typeName: 'Table',
    optional: false,
    name: 'Corpus of Documents',
    description: 'An input table containing the original corpus with the related document vectors.'
  }]"
  :dyn-out-ports="[{
    groupName: 'Captured workflow inputs',
    groupDescription: 'The dynamic inputs of the workflow fragment starting with this node.',
    types: [
      { type: 'table', typeName: 'Table' },
      { type: 'flowVariable', typeName: 'Flow Variable' },
      { color: '#41be78', type: 'other', typeName: 'Image' },
      { color: '#9b9b9b', type: 'other', typeName: 'Distance Measure' },
      { color: '#1469af', type: 'other', typeName: 'PMML' },
      { color: '#1eb9dc', type: 'other', typeName: 'Naive Bayes' },
    ]
  }]"
  :views="[{
    name: '3D View',
    description: 'Select any structure in the table view at the top',
    interactive: true
  }]"
  :options="[{
    fields: [{
      name: 'Neighbor Count',
      description: 'Selects the number of similar neighboring documents you would like to output.',
      optional: false
    }]
  }]"
/>`,Le={inPorts:[{type:"table",typeName:"Table",optional:!1,name:"Corpus of Documents",description:"An input table containing the original corpus with the related document vectors."},{type:"other",color:"#9b9b9b",typeName:"DocumentVectorPortObject",optional:!0,name:"Document Vector Model",description:"A model containing node settings as well as column names of the term feature space."}],dynInPorts:[{groupName:"Captured workflow inputs",groupDescription:"The dynamic inputs of the workflow fragment starting with this node.",types:[{type:"table",typeName:"Table"},{type:"flowVariable",typeName:"Flow Variable"},{color:"#41be78",type:"other",typeName:"Image"},{color:"#9b9b9b",type:"other",typeName:"Distance Measure"},{color:"#1469af",type:"other",typeName:"PMML"},{color:"#1eb9dc",type:"other",typeName:"Naive Bayes"}]}],outPorts:[{type:"flowVariable",typeName:"Flow Variable",optional:!0,name:"Count of Most Similar Documents per Input Document",description:"A single variable set to the count of matching documents per input document"}],dynOutPorts:[{groupName:"Captured Workflow",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#2e992e",typeName:"Workflow",type:"other"},{color:"#9b9b9b",typeName:"Distance Measure",type:"other"}]},{groupName:"Second DynOutPortGroup",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#1eb9dc",typeName:"Sota",type:"other"}]}],views:[{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0},{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0}],options:[{fields:[{name:"Neighbor Count",description:"Selects the number of similar neighboring documents you would like to output.",optional:!1},{name:"Min Similarity",description:"Selects the minimum similarity values you would like to output.",optional:!1}]}]},Oe={components:{NodeFeatureList:ke,CodeExample:k},computed:{code(){return Te},codeExample(){return Ve},nodeFeatures(){return Le}}},Ce=i=>(S("data-v-aac32ba2"),i=i(),$(),i),Ae={class:"demo"},Se=Ce(()=>o("div",{class:"grid-container"},[o("div",{class:"grid-item-12"},[o("h2",null,"NodeFeatureList"),o("p",null," A container component that summarizes properties of nodes or components. In particular their ports, dialog options and views. "),o("p",null," This component works best on gray background. ")])],-1)),$e={class:"grid-container"},Be={class:"grid-item-12"},Fe={class:"grid-container"},ze={class:"grid-item-12"};function Me(i,u,t,b,m,r){const a=p("NodeFeatureList",!0),n=p("CodeExample");return e(),s("div",null,[o("section",Ae,[Se,o("div",$e,[o("div",Be,[_(a,C(A(r.nodeFeatures)),null,16)])])]),o("section",null,[o("div",Fe,[o("div",ze,[_(n,{summary:"Show usage example"},{default:P(()=>[N(y(r.codeExample),1)]),_:1}),_(n,{summary:"Show NodeFeatureList.vue source code"},{default:P(()=>[N(y(r.code),1)]),_:1})])])])])}const qe=f(Oe,[["render",Me],["__scopeId","data-v-aac32ba2"]]);export{qe as default};
