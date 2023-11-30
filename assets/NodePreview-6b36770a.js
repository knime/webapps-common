import{C as M}from"./CodeExample-bf502003.js";import{P as E}from"./PortIcon-a0c8b0a8.js";import{S as T,b as N,c as D,d as H,e as _,Y as F,f as G,g as R,h as $,i as U,L as B,j as V,k as Y,l as L,A as z,H as O}from"./knimeColors-52e14242.js";import{_ as P,o as a,c as i,b as t,l as y,r as m,d as u,F as v,g as S,j as A,aq as b,ar as k,w,e as g,t as C,p as Q,f as q}from"./index-92c321cd.js";const I=T,K=N,W=D,j=H,J=_,Z=_,X=_,oo=F,eo=G,to=R,no=$,ro=U,ao=N,so=B,io=B,co=V,lo=Y,po=L,uo=L,mo=z,go=z,fo=Object.freeze(Object.defineProperty({__proto__:null,Component:I,Configuration:K,Container:W,Learner:j,Loop:J,LoopEnd:Z,LoopStart:X,Manipulator:oo,Metanode:eo,MetanodeSecondary:to,Other:no,Predictor:ro,QuickForm:ao,ScopeEnd:so,ScopeStart:io,Sink:co,Source:lo,VirtualIn:po,VirtualOut:uo,Visualizer:mo,Widget:go},Symbol.toStringTag,{value:"Module"})),yo=32,x={default:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3,32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30.7,0,29.2z",LoopEnd:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",LoopStart:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",ScopeEnd:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",ScopeStart:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",VirtualIn:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H6.5L0,25.9l5.2-10L0.7,7.2L6.5,0l22.7,0C30.7,0,32,1.3,32,2.8z",VirtualOut:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-5.8,7.2l4.5,8.7l-5.2,10L32,32H2.8C1.3,32,0,30.7,0,29.2z"},ho=.75,_o={props:{type:{type:String,default:null},isComponent:{type:Boolean,default:!1},icon:{type:String,default:null,validator:o=>o.startsWith("data:image/")}},computed:{backgroundPath(){return x[this.type]||x.default},backgroundColor(){return fo[this.type]||O},componentColor(){return I},componentBackgroundTransformation(){let o=yo/2;return`translate(${o}, ${o}) scale(${ho}) translate(-${o}, -${o})`}}},Po=["d","fill"],vo=["d","fill","transform"],So=["xlink:href"];function Ao(o,s,e,f,r,n){return a(),i("g",null,[t("path",{class:"bg",d:n.backgroundPath,fill:e.isComponent?n.componentColor:n.backgroundColor},null,8,Po),e.isComponent&&e.type?(a(),i("path",{key:0,class:"bg",d:n.backgroundPath,fill:n.backgroundColor,transform:n.componentBackgroundTransformation},null,8,vo)):y("",!0),e.icon?(a(),i("image",{key:1,"xlink:href":e.icon,x:"8",y:"8",width:"16",height:"16","pointer-events":"none"},null,8,So)):y("",!0)])}const bo=P(_o,[["render",Ao]]),ko={components:{PortIcon:E,NodeTorsoNormal:bo},props:{type:{type:String,default:null},isComponent:{type:Boolean,default:!1},inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},hasDynPorts:{type:Boolean,default:!1},icon:{type:String,default:null,validator:o=>o.startsWith("data:image/")}},data(){return{viewBox:"-19 -19 70 70"}},methods:{yPortShift(o,s){let r=1;s===2?r=12:s===3&&(r=1.5);let l=(32-(s*9+(s-1)*r))/2;return(r+9)*o+l+9/2}}},wo=["viewBox"],Co={key:0,stroke:"none"},xo=t("circle",{r:"1.2",cx:"4",cy:"27"},null,-1),No=t("circle",{r:"1.2",cx:"9",cy:"27"},null,-1),Bo=t("circle",{r:"1.2",cx:"14",cy:"27"},null,-1),Lo=[xo,No,Bo];function zo(o,s,e,f,r,n){const l=m("NodeTorsoNormal"),d=m("PortIcon");return a(),i("svg",{viewBox:r.viewBox},[u(l,{type:e.type,icon:e.icon,"is-component":e.isComponent},null,8,["type","icon","is-component"]),(a(!0),i(v,null,S(e.inPorts,(c,p)=>(a(),A(d,{key:`in-${p}`,color:c.color,filled:!c.optional,type:c.type,transform:`translate(-4.5, ${n.yPortShift(p,e.inPorts.length)})`},null,8,["color","filled","type","transform"]))),128)),(a(!0),i(v,null,S(e.outPorts,(c,p)=>(a(),A(d,{key:`out-${p}`,color:c.color,filled:!c.optional,type:c.type,transform:`translate(36.5, ${n.yPortShift(p,e.outPorts.length)})`},null,8,["color","filled","type","transform"]))),128)),e.hasDynPorts?(a(),i("g",Co,Lo)):y("",!0)],8,wo)}const Io=P(ko,[["render",zo]]),Mo=`<script>
import PortIcon from "./PortIcon.vue";
import NodeTorsoNormal from "./NodeTorsoNormal.vue";

/**
 * SVG icon preview for a node or component, generated from its attributes
 */
export default {
  components: {
    PortIcon,
    NodeTorsoNormal,
  },
  props: {
    /**
     * Type of node; determines the background color.
     * @example 'Reader'
     */
    type: {
      type: String,
      default: null,
    },
    /**
     * Use alternative rendering style:
     * Components always have a gray background and a smaller rectangle whose background indicates the node type
     */
    isComponent: {
      type: Boolean,
      default: false,
    },
    /**
     * List of incoming ports
     * Port: {
     *    color: String (css-compatible),
     *    optional: Boolean,
     *    type: String,
     *    ...
     * }
     *
     * The port format is further described in
     * https://bitbucket.org/KNIME/knime-com-shared/src/master/com.knime.gateway.codegen/src-gen/api/web-ui/gateway.yaml#lines-545
     */
    inPorts: {
      type: Array,
      default: () => [],
    },
    /**
     * List ouf outgoing ports
     */
    outPorts: {
      type: Array,
      default: () => [],
    },
    /**
     * Show three dots to indicate dynamic ports
     */
    hasDynPorts: {
      type: Boolean,
      default: false,
    },
    /**
     * URL of icon that is rendered inside the node. (Possibly \`data:\` URL)
     * Passed through to NodeTorsoNormal
     */
    icon: {
      type: String,
      default: null,
      validator: (url) => url.startsWith("data:image/"),
    },
  },
  data() {
    return {
      /*
       * Port icon size is 9x9 including stroke, background size is 32x32.
       * A height of 70 leaves whitespace and the top and bottom of the background, and allows for up to 7 ports
       * (i.e. Community Nodes > OpenMS > Utilities > SpectraSTSearchAdapter)
       * Keep in sync with iconRenderer:svgSize
       */
      viewBox: "-19 -19 70 70",
    };
  },
  methods: {
    // top edge of port icon relative to 32x32 background
    yPortShift(index, total) {
      const portSize = 9;
      const bgSize = 32;

      /* eslint-disable no-magic-numbers */
      let spacing = 1;
      if (total === 2) {
        spacing = 12;
      } else if (total === 3) {
        spacing = 1.5;
      }
      /* eslint-enable no-magic-numbers */

      let totalHeight = total * portSize + (total - 1) * spacing;
      let delta = (bgSize - totalHeight) / 2;
      return (spacing + portSize) * index + delta + portSize / 2;
    },
  },
};
<\/script>

<template>
  <svg :viewBox="viewBox">
    <NodeTorsoNormal :type="type" :icon="icon" :is-component="isComponent" />
    <PortIcon
      v-for="(port, index) in inPorts"
      :key="\`in-\${index}\`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="\`translate(-4.5, \${yPortShift(index, inPorts.length)})\`"
    />
    <PortIcon
      v-for="(port, index) in outPorts"
      :key="\`out-\${index}\`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="\`translate(36.5, \${yPortShift(index, outPorts.length)})\`"
    />
    <g v-if="hasDynPorts" stroke="none">
      <circle r="1.2" cx="4" cy="27" />
      <circle r="1.2" cx="9" cy="27" />
      <circle r="1.2" cx="14" cy="27" />
    </g>
  </svg>
</template>
`;const h="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiNAqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLTegGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJRU5ErkJggg==",Eo=`<NodePreview
  :hasDynPorts="false"
  isComponent
  type="Sink"
  :inPorts="[{ type: 'table' }]"
  :outPorts="[
      { type: 'other', color: '#1eb9dc' },
      { type: 'table' },
      { type: 'table', optional: true }
  ]"
  icon="${h}"
/>`,To={components:{NodePreview:Io,CodeExample:M},data(){return{codeExample:Eo,nodePreview:{hasDynPorts:!0,isComponent:!1,type:"Learner",inPorts:[{type:"table"}],outPorts:[{type:"other",color:"#1eb9dc"},{type:"table",optional:!0}],icon:h},componentPreview:{hasDynPorts:!1,isComponent:!0,type:"Sink",inPorts:[{type:"table"}],outPorts:[{type:"other",color:"#1eb9dc"},{type:"table"},{type:"table",optional:!0}],icon:h}}},computed:{sourceCode(){return Mo}}},Do=o=>(Q("data-v-09fcf78b"),o=o(),q(),o),Ho=Do(()=>t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[g(" A component that draws a Node (left, with dynamic ports) or a Component (right)."),t("br"),g(" This Component only draws regular nodes/components, no Metanodes, no Unknown nor Missing Nodes. ")])])],-1)),Fo={class:"grid-container"},Go={class:"grid-item-12 demo-items"},Ro={class:"grid-container"},$o={class:"grid-item-12"};function Uo(o,s,e,f,r,n){const l=m("NodePreview",!0),d=m("CodeExample");return a(),i("div",null,[t("section",null,[Ho,t("div",Fo,[t("div",Go,[t("div",null,[u(l,b(k(r.nodePreview)),null,16)]),t("div",null,[u(l,b(k(r.componentPreview)),null,16)])])])]),t("section",null,[t("div",Ro,[t("div",$o,[u(d,{summary:"Show usage example"},{default:w(()=>[g(C(r.codeExample),1)]),_:1}),u(d,{summary:"Show NodePreview.vue source code"},{default:w(()=>[g(C(n.sourceCode),1)]),_:1})])])])])}const qo=P(To,[["render",Uo],["__scopeId","data-v-09fcf78b"]]);export{qo as default};
