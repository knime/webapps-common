import{C as I}from"./CodeExample-CEMuTgcl.js";import{o as e,c as s,b as n,_ as b,D as k,r as p,t as y,j as l,l as h,F as f,g,d as _,n as D,av as T,w as N,e as P,k as C,R as V,bf as $,aC as S,aD as A,p as M,f as O}from"./index-C9vqjUQ1.js";import{P as B}from"./PortIcon-C85RTv0r.js";import{C as L}from"./Collapser-Ca4WLG6b.js";import"./arrow-dropdown-CseSplwP.js";import"./ExpandTransition-r9usv-cD.js";const F={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},z=n("path",{d:"M13.2 6.2c-3.8 2.1-5.1 7-3 10.8s7 5.1 10.8 3l4.4-2.6-7.8-13.7zm6.9 1.9 5.7-3.2m-2.9 8.2 5.7-3.2M10.2 17c-1.9 1.1-7.3 1.8-5.1 5.9s-1.7 5.4-1.7 5.4"},null,-1),E=[z];function j(r,u){return e(),s("svg",F,[...E])}const R={render:j},W={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},K=n("path",{"stroke-linejoin":"round",d:"M29.604 16c0-2.2-4.4-9-13.5-9s-13.5 6.8-13.5 9m27 0c0 2.2-4.4 9-13.5 9s-13.5-6.8-13.5-9"},null,-1),U=n("path",{"stroke-linejoin":"round",d:"M16.104 20.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"},null,-1),Z=[K,U];function q(r,u){return e(),s("svg",W,[...Z])}const x={render:q},H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},J=n("path",{d:"M7 13.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.2-2.5-2.5-2.5zm9 5.1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm9-6.8c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm-9 11.5v4m0-22.6v14.1m-9-.5v9M7 4.7v9m18 2.8v10.8m0-22.6V12"},null,-1),Q=[J];function X(r,u){return e(),s("svg",H,[...Q])}const Y={render:X},G={components:{Description:k,PortIcon:B},props:{ports:{type:Array,default:()=>[]},title:{type:String,default:"Input ports"},groupDescription:{type:String,default:null}},computed:{dynamicPorts(){return!!this.groupDescription}}},ee={class:"wrapper"},te={class:"content"},oe={viewBox:"-4.5 -4.5 9 9",width:"12",height:"12"},ne={key:0,class:"port-name"};function se(r,u,t,v,m,i){const a=p("Description"),o=p("PortIcon");return e(),s("div",ee,[n("h6",null,y(t.title),1),n("div",te,[i.dynamicPorts?(e(),l(a,{key:0,text:t.groupDescription,"render-as-html":"",class:"dyn-ports-description"},null,8,["text"])):h("",!0),n("ol",null,[(e(!0),s(f,null,g(t.ports,(c,d)=>(e(),s("li",{key:d},[(e(),s("svg",oe,[_(o,{color:c.color,filled:!c.optional,type:c.type},null,8,["color","filled","type"])])),n("div",{class:D(["port-type",{fat:!i.dynamicPorts}])}," Type: "+y(c.typeName),3),!i.dynamicPorts&&c.name?(e(),s("div",ne,y(c.name),1)):h("",!0),!i.dynamicPorts&&c.description?(e(),l(a,{key:1,text:c.description,"render-as-html":"",class:"port-description"},null,8,["text"])):h("",!0)]))),128))])])])}const re=b(G,[["render",se],["__scopeId","data-v-4fa12c9b"]]),ie={components:{PortGroup:re},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0}}},ae={key:0,class:"ports-list"};function ce(r,u,t,v,m,i){const a=p("PortGroup");return i.hasPorts?(e(),s("div",ae,[t.inPorts.length?(e(),l(a,{key:0,class:"inports",title:"Input ports",ports:t.inPorts},null,8,["ports"])):h("",!0),t.outPorts.length?(e(),l(a,{key:1,class:"outports",title:"Output ports",ports:t.outPorts},null,8,["ports"])):h("",!0),(e(!0),s(f,null,g(t.dynInPorts,o=>(e(),l(a,{key:o.groupName,title:o.groupName+" (Dynamic Inport)","group-description":o.groupDescription,ports:o.types},null,8,["title","group-description","ports"]))),128)),(e(!0),s(f,null,g(t.dynOutPorts,o=>(e(),l(a,{key:o.groupName,title:o.groupName+" (Dynamic Outport)","group-description":o.groupDescription,ports:o.types},null,8,["title","group-description","ports"]))),128))])):h("",!0)}const le=b(ie,[["render",ce]]),pe={components:{Description:k,StandardIcon:x,InteractiveIcon:T},props:{views:{type:Array,default:()=>[]}}},de={key:0,class:"views-list"},ue={class:"content"},me={class:"name"};function ye(r,u,t,v,m,i){const a=p("InteractiveIcon"),o=p("StandardIcon"),c=p("Description");return t.views.length?(e(),s("ul",de,[(e(!0),s(f,null,g(t.views,(d,w)=>(e(),s("li",{key:w},[n("h6",null,[d.interactive?(e(),l(a,{key:0,class:"interactive"})):(e(),l(o,{key:1})),n("span",null,y(d.interactive?"Interactive":"Standard"),1)]),n("div",ue,[n("span",me,y(d.name),1),_(c,{text:d.description,"render-as-html":""},null,8,["text"])])]))),128))])):h("",!0)}const he=b(pe,[["render",ye],["__scopeId","data-v-f48e06d3"]]),_e={components:{Collapser:L,Description:k},props:{options:{type:Array,default:()=>[]},sanitizeContent:{type:Boolean,default:!1}},computed:{renderableOptions(){return this.options.filter(r=>r.fields&&r.fields.length||r.sectionDescription)}}},fe={key:0,class:"dialog-options"},ge={class:"panel"},be={class:"option-field-name"},ve={key:0,class:"optional"};function we(r,u,t,v,m,i){const a=p("Description");return i.renderableOptions.length?(e(),s("div",fe,[(e(!0),s(f,null,g(i.renderableOptions,(o,c)=>(e(),l(C(o.sectionName?"Collapser":"div"),{key:c,class:D(["options",{"with-section":o.sectionName}]),"initially-expanded":t.options.length===1},{title:N(()=>[n("h5",null,y(o.sectionName),1)]),default:N(()=>[o.sectionDescription?(e(),l(a,{key:0,text:o.sectionDescription,"render-as-html":!t.sanitizeContent,class:"section-description"},null,8,["text","render-as-html"])):h("",!0),n("ul",ge,[(e(!0),s(f,null,g(o.fields,(d,w)=>(e(),s("li",{key:w},[n("p",be,[P(y(d.name)+" ",1),d.optional?(e(),s("span",ve," (optional) ")):h("",!0)]),_(a,{class:"option-description",text:d.description,"render-as-html":!t.sanitizeContent},null,8,["text","render-as-html"])]))),128))])]),_:2},1032,["class","initially-expanded"]))),128))])):h("",!0)}const Ne=b(_e,[["render",we],["__scopeId","data-v-e648a96d"]]),Pe={components:{TabBar:V,DialogOptions:Ne,PortsList:le,ViewsList:he},props:{inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},dynInPorts:{type:Array,default:()=>[]},dynOutPorts:{type:Array,default:()=>[]},options:{type:Array,default:()=>[]},views:{type:Array,default:()=>[]},emptyText:{type:String,default:"This node does not provide any ports, options or views."},sanitizeContent:{type:Boolean,default:!1}},data(){return{activeTab:null}},computed:{hasPorts(){return this.inPorts.length>0||this.outPorts.length>0||this.dynInPorts.length>0||this.dynOutPorts.length>0},possibleTabValues(){return[{value:"ports",label:"Ports",icon:R,disabled:!this.hasPorts},{value:"node-dialog-options",label:"Options",icon:Y,disabled:this.options.length===0},{value:"views",label:"Views",icon:x,disabled:this.views.length===0}]}}},ke={class:"feature-list"},De={key:3,class:"placeholder"};function xe(r,u,t,v,m,i){const a=p("TabBar"),o=p("PortsList"),c=p("DialogOptions"),d=p("ViewsList");return e(),s("div",ke,[_(a,{modelValue:m.activeTab,"onUpdate:modelValue":u[0]||(u[0]=w=>m.activeTab=w),"possible-values":i.possibleTabValues,name:"feature"},null,8,["modelValue","possible-values"]),(e(),l($,null,[m.activeTab==="ports"?(e(),l(o,{key:0,"in-ports":t.inPorts,"out-ports":t.outPorts,"dyn-in-ports":t.dynInPorts,"dyn-out-ports":t.dynOutPorts},null,8,["in-ports","out-ports","dyn-in-ports","dyn-out-ports"])):m.activeTab==="node-dialog-options"?(e(),l(c,{key:1,"sanitize-content":t.sanitizeContent,options:t.options},null,8,["sanitize-content","options"])):m.activeTab==="views"?(e(),l(d,{key:2,views:t.views},null,8,["views"])):(e(),s("p",De,y(t.emptyText),1))],1024))])}const Ie=b(Pe,[["render",xe],["__scopeId","data-v-ab3752aa"]]),Te="",Ce=`<NodeFeatureList
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
/>`,Ve={inPorts:[{type:"table",typeName:"Table",optional:!1,name:"Corpus of Documents",description:"An input table containing the original corpus with the related document vectors."},{type:"other",color:"#9b9b9b",typeName:"DocumentVectorPortObject",optional:!0,name:"Document Vector Model",description:"A model containing node settings as well as column names of the term feature space."}],dynInPorts:[{groupName:"Captured workflow inputs",groupDescription:"The dynamic inputs of the workflow fragment starting with this node.",types:[{type:"table",typeName:"Table"},{type:"flowVariable",typeName:"Flow Variable"},{color:"#41be78",type:"other",typeName:"Image"},{color:"#9b9b9b",type:"other",typeName:"Distance Measure"},{color:"#1469af",type:"other",typeName:"PMML"},{color:"#1eb9dc",type:"other",typeName:"Naive Bayes"}]}],outPorts:[{type:"flowVariable",typeName:"Flow Variable",optional:!0,name:"Count of Most Similar Documents per Input Document",description:"A single variable set to the count of matching documents per input document"}],dynOutPorts:[{groupName:"Captured Workflow",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#2e992e",typeName:"Workflow",type:"other"},{color:"#9b9b9b",typeName:"Distance Measure",type:"other"}]},{groupName:"Second DynOutPortGroup",groupDescription:"The dynamic outputs of the workflow fragment starting with this node.",types:[{color:"#1eb9dc",typeName:"Sota",type:"other"}]}],views:[{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0},{name:"3D View",description:"Select any structure in the table view at the top and see the 3D representation at the bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate information.",interactive:!0}],options:[{fields:[{name:"Neighbor Count",description:"Selects the number of similar neighboring documents you would like to output.",optional:!1},{name:"Min Similarity",description:"Selects the minimum similarity values you would like to output.",optional:!1}]}]},$e={components:{NodeFeatureList:Ie,CodeExample:I},computed:{code(){return Te},codeExample(){return Ce},nodeFeatures(){return Ve}}},Se=r=>(M("data-v-6dd9bec9"),r=r(),O(),r),Ae={class:"demo"},Me=Se(()=>n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null," A container component that summarizes properties of nodes or components. In particular their ports, dialog options and views. "),n("p",null,"This component works best on gray background.")])],-1)),Oe={class:"grid-container"},Be={class:"grid-item-12"},Le={class:"grid-container"},Fe={class:"grid-item-12"};function ze(r,u,t,v,m,i){const a=p("NodeFeatureList",!0),o=p("CodeExample");return e(),s("div",null,[n("section",Ae,[Me,n("div",Oe,[n("div",Be,[_(a,S(A(i.nodeFeatures)),null,16)])])]),n("section",null,[n("div",Le,[n("div",Fe,[_(o,{summary:"Show usage example"},{default:N(()=>[P(y(i.codeExample),1)]),_:1}),_(o,{summary:"Show NodeFeatureList.vue source code"},{default:N(()=>[P(y(i.code),1)]),_:1})])])])])}const Ze=b($e,[["render",ze],["__scopeId","data-v-6dd9bec9"]]);export{Ze as default};
