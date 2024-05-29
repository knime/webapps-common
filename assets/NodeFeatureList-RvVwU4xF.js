import{C as x}from"./CodeExample-oz6H8A5_.js";import{o as t,c as s,b as n,_ as v,D,r as p,t as h,j as c,l as y,F as f,g,d as _,n as k,aq as T,w as P,e as N,k as V,S as O,aT as L,aw as C,ax as A,p as S,f as $}from"./index-099kMGOp.js";import{P as B}from"./PortIcon-VhchhsE5.js";import{C as M}from"./Collapser-d0t01mVW.js";import"./knimeColors-ODfrymY5.js";import"./arrow-dropdown-rO8_jLCP.js";import"./ExpandTransition-5rmgQ2m5.js";const z={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},F=n("path",{d:"M13.2 6.2c-3.8 2.1-5.1 7-3 10.8s7 5.1 10.8 3l4.4-2.6-7.8-13.7zm6.9 1.9 5.7-3.2m-2.9 8.2 5.7-3.2M10.2 17c-1.9 1.1-7.3 1.8-5.1 5.9s-1.7 5.4-1.7 5.4"},null,-1),E=[F];function j(i,u){return t(),s("svg",z,[...E])}const K={render:j},W={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},q=n("path",{"stroke-linejoin":"round",d:"M29.604 16c0-2.2-4.4-9-13.5-9s-13.5 6.8-13.5 9m27 0c0 2.2-4.4 9-13.5 9s-13.5-6.8-13.5-9"},null,-1),R=n("path",{"stroke-linejoin":"round",d:"M16.104 20.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"},null,-1),U=[q,R];function Z(i,u){return t(),s("svg",W,[...U])}const I={render:Z},H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},J=n("path",{d:"M7 13.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.2-2.5-2.5-2.5zm9 5.1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm9-6.8c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm-9 11.5v4m0-22.6v14.1m-9-.5v9M7 4.7v9m18 2.8v10.8m0-22.6V12"},null,-1),Q=[J];function X(i,u){return t(),s("svg",H,[...Q])}const Y={render:X},G={components:{Description:D,PortIcon:B},props:{ports:{type:Array,default:()=>[]},title:{type:String,default:"Input ports"},groupDescription:{type:String,default:null}},computed:{dynamicPorts(){return!!this.groupDescription}}},tt={class:"wrapper"},et={class:"content"},ot={viewBox:"-4.5 -4.5 9 9",width:"12",height:"12"},nt={key:0,class:"port-name"};function st(i,u,e,b,m,r){const a=p("Description"),o=p("PortIcon");return t(),s("div",tt,[n("h6",null,h(e.title),1),n("div",et,[r.dynamicPorts?(t(),c(a,{key:0,text:e.groupDescription,"render-as-html":"",class:"dyn-ports-description"},null,8,["text"])):y("",!0),n("ol",null,[(t(!0),s(f,null,g(e.ports,(l,d)=>(t(),s("li",{key:d},[(t(),s("svg",ot,[_(o,{color:l.color,filled:!l.optional,type:l.type},null,8,["color","filled","type"])])),n("div",{class:k(["port-type",{fat:!r.dynamicPorts}])}," Type: "+h(l.typeName),3),!r.dynamicPorts&&l.name?(t(),s("div",nt,h(l.name),1)):y("",!0),!r.dynamicPorts&&l.description?(t(),c(a,{key:1,text:l.description,"render-as-html":"",class:"port-description"},null,8,["text"])):y("",!0)]))),128))])])])}const it=v(G,[["render",st],["__scopeId","data-v-c16feddc"]]),rt={components:{PortGroup:it},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0}}},at={key:0,class:"ports-list"};function lt(i,u,e,b,m,r){const a=p("PortGroup");return r.hasPorts?(t(),s("div",at,[e.inPorts.length?(t(),c(a,{key:0,class:"inports",title:"Input ports",ports:e.inPorts},null,8,["ports"])):y("",!0),e.outPorts.length?(t(),c(a,{key:1,class:"outports",title:"Output ports",ports:e.outPorts},null,8,["ports"])):y("",!0),(t(!0),s(f,null,g(e.dynInPorts,o=>(t(),c(a,{key:o.groupName,title:o.groupName+" (Dynamic Inport)","group-description":o.groupDescription,ports:o.types},null,8,["title","group-description","ports"]))),128)),(t(!0),s(f,null,g(e.dynOutPorts,o=>(t(),c(a,{key:o.groupName,title:o.groupName+" (Dynamic Outport)","group-description":o.groupDescription,ports:o.types},null,8,["title","group-description","ports"]))),128))])):y("",!0)}const ct=v(rt,[["render",lt]]),pt={components:{Description:D,StandardIcon:I,InteractiveIcon:T},props:{views:{type:Array,default:()=>[]}}},dt={key:0,class:"views-list"},ut={class:"content"},mt={class:"name"};function ht(i,u,e,b,m,r){const a=p("InteractiveIcon"),o=p("StandardIcon"),l=p("Description");return e.views.length?(t(),s("ul",dt,[(t(!0),s(f,null,g(e.views,(d,w)=>(t(),s("li",{key:w},[n("h6",null,[d.interactive?(t(),c(a,{key:0,class:"interactive"})):(t(),c(o,{key:1})),n("span",null,h(d.interactive?"Interactive":"Standard"),1)]),n("div",ut,[n("span",mt,h(d.name),1),_(l,{text:d.description,"render-as-html":""},null,8,["text"])])]))),128))])):y("",!0)}const yt=v(pt,[["render",ht],["__scopeId","data-v-02120ab1"]]),_t={components:{Collapser:M,Description:D},props:{options:{type:Array,default:()=>[]},sanitizeContent:{type:Boolean,default:!1}},computed:{renderableOptions(){return this.options.filter(i=>i.fields&&i.fields.length||i.sectionDescription)}}},ft={key:0,class:"dialog-options"},gt={class:"panel"},vt={class:"option-field-name"},bt={key:0,class:"optional"};function wt(i,u,e,b,m,r){const a=p("Description");return r.renderableOptions.length?(t(),s("div",ft,[(t(!0),s(f,null,g(r.renderableOptions,(o,l)=>(t(),c(V(o.sectionName?"Collapser":"div"),{key:l,class:k(["options",{"with-section":o.sectionName}]),"initially-expanded":e.options.length===1},{title:P(()=>[n("h5",null,h(o.sectionName),1)]),default:P(()=>[o.sectionDescription?(t(),c(a,{key:0,text:o.sectionDescription,"render-as-html":!e.sanitizeContent,class:"section-description"},null,8,["text","render-as-html"])):y("",!0),n("ul",gt,[(t(!0),s(f,null,g(o.fields,(d,w)=>(t(),s("li",{key:w},[n("p",vt,[N(h(d.name)+" ",1),d.optional?(t(),s("span",bt," (optional) ")):y("",!0)]),_(a,{class:"option-description",text:d.description,"render-as-html":!e.sanitizeContent},null,8,["text","render-as-html"])]))),128))])]),_:2},1032,["class","initially-expanded"]))),128))])):y("",!0)}const Pt=v(_t,[["render",wt],["__scopeId","data-v-f60077f7"]]),Nt={components:{TabBar:O,DialogOptions:Pt,PortsList:ct,ViewsList:yt},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]},options:{type:Array,default:()=>[]},views:{type:Array,default:()=>[]},emptyText:{type:String,default:"This node does not provide any ports, options or views."},sanitizeContent:{type:Boolean,default:!1}},data(){return{activeTab:null}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0},possibleTabValues(){return[{value:"ports",label:"Ports",icon:K,disabled:!this.hasPorts},{value:"node-dialog-options",label:"Options",icon:Y,disabled:this.options.length===0},{value:"views",label:"Views",icon:I,disabled:this.views.length===0}]}}},Dt={class:"feature-list"},kt={key:3,class:"placeholder"};function It(i,u,e,b,m,r){const a=p("TabBar"),o=p("PortsList"),l=p("DialogOptions"),d=p("ViewsList");return t(),s("div",Dt,[_(a,{modelValue:m.activeTab,"onUpdate:modelValue":u[0]||(u[0]=w=>m.activeTab=w),"possible-values":r.possibleTabValues,name:"feature"},null,8,["modelValue","possible-values"]),(t(),c(L,null,[m.activeTab==="ports"?(t(),c(o,{key:0,"in-ports":e.inPorts,"out-ports":e.outPorts,"dyn-in-ports":e.dynInPorts,"dyn-out-ports":e.dynOutPorts},null,8,["in-ports","out-ports","dyn-in-ports","dyn-out-ports"])):m.activeTab==="node-dialog-options"?(t(),c(l,{key:1,"sanitize-content":e.sanitizeContent,options:e.options},null,8,["sanitize-content","options"])):m.activeTab==="views"?(t(),c(d,{key:2,views:e.views},null,8,["views"])):(t(),s("p",kt,h(e.emptyText),1))],1024))])}const xt=v(Nt,[["render",It],["__scopeId","data-v-87e91d81"]]),Tt=`<script>
import PortIcon from "../../assets/img/icons/plugin.svg";
import ViewsIcon from "../../assets/img/icons/eye.svg";
import OptionsIcon from "../../assets/img/icons/settings.svg";
import TabBar from "../TabBar.vue";
import PortsList from "./PortsList.vue";
import ViewsList from "./ViewsList.vue";
import DialogOptions from "./DialogOptions.vue";

export default {
  components: {
    TabBar,
    DialogOptions,
    PortsList,
    ViewsList,
  },
  props: {
    /** Passed through to PortsList.vue */
    inPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    outPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    dynInPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    dynOutPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to DialogOptions.vue */
    options: {
      type: Array,
      default: () => [],
    },
    /** Passed through to ViewsList.vue */
    views: {
      type: Array,
      default: () => [],
    },
    /** Text that is show if node has neither views, options nor ports */
    emptyText: {
      type: String,
      default: "This node does not provide any ports, options or views.",
    },
    /** Passed through to DialogOptions.vue */
    sanitizeContent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: null,
    };
  },
  computed: {
    hasPorts() {
      return (
        this.inPorts.length > 0 ||
        this.outPorts.length > 0 ||
        this.dynInPorts.length > 0 ||
        this.dynOutPorts.length > 0
      );
    },
    possibleTabValues() {
      return [
        {
          value: "ports",
          label: "Ports",
          icon: PortIcon,
          disabled: !this.hasPorts,
        },
        {
          value: "node-dialog-options",
          label: "Options",
          icon: OptionsIcon,
          disabled: this.options.length === 0,
        },
        {
          value: "views",
          label: "Views",
          icon: ViewsIcon,
          disabled: this.views.length === 0,
        },
      ];
    },
  },
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
      <ViewsList v-else-if="activeTab === 'views'" :views="views" />
      <p v-else class="placeholder">
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
`,Vt=`<NodeFeatureList
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
/>`,Ot={inPorts:[{type:"table",typeName:"Table",optional:!1,name:"Corpus of Documents",description:"An input table containing the original corpus with the related document vectors."},{type:"other",color:"#9b9b9b",typeName:"DocumentVectorPortObject",optional:!0,name:"Document Vector Model",description:"A model containing node settings as well as column names of the term feature space."}],dynInPorts:[{groupName:"Captured workflow inputs",groupDescription:"The dynamic inputs of the workflow fragment starting with this node.",types:[{type:"table",typeName:"Table"},{type:"flowVariable",typeName:"Flow Variable"},{color:"#41be78",type:"other",typeName:"Image"},{color:"#9b9b9b",type:"other",typeName:"Distance Measure"},{color:"#1469af",type:"other",typeName:"PMML"},{color:"#1eb9dc",type:"other",typeName:"Naive Bayes"}]}],outPorts:[{type:"flowVariable",typeName:"Flow Variable",optional:!0,name:"Count of Most Similar Documents per Input Document",description:"A single variable set to the count of matching documents per input document"}],dynOutPorts:[{groupName:"Captured Workflow",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#2e992e",typeName:"Workflow",type:"other"},{color:"#9b9b9b",typeName:"Distance Measure",type:"other"}]},{groupName:"Second DynOutPortGroup",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#1eb9dc",typeName:"Sota",type:"other"}]}],views:[{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0},{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0}],options:[{fields:[{name:"Neighbor Count",description:"Selects the number of similar neighboring documents you would like to output.",optional:!1},{name:"Min Similarity",description:"Selects the minimum similarity values you would like to output.",optional:!1}]}]},Lt={components:{NodeFeatureList:xt,CodeExample:x},computed:{code(){return Tt},codeExample(){return Vt},nodeFeatures(){return Ot}}},Ct=i=>(S("data-v-0477360a"),i=i(),$(),i),At={class:"demo"},St=Ct(()=>n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null," A container component that summarizes properties of nodes or components. In particular their ports, dialog options and views. "),n("p",null,"This component works best on gray background.")])],-1)),$t={class:"grid-container"},Bt={class:"grid-item-12"},Mt={class:"grid-container"},zt={class:"grid-item-12"};function Ft(i,u,e,b,m,r){const a=p("NodeFeatureList",!0),o=p("CodeExample");return t(),s("div",null,[n("section",At,[St,n("div",$t,[n("div",Bt,[_(a,C(A(r.nodeFeatures)),null,16)])])]),n("section",null,[n("div",Mt,[n("div",zt,[_(o,{summary:"Show usage example"},{default:P(()=>[N(h(r.codeExample),1)]),_:1}),_(o,{summary:"Show NodeFeatureList.vue source code"},{default:P(()=>[N(h(r.code),1)]),_:1})])])])])}const Zt=v(Lt,[["render",Ft],["__scopeId","data-v-0477360a"]]);export{Zt as default};
