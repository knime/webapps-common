import{C as I}from"./CodeExample-58ee106e.js";import{S as E,A as N,a as T,M as D,b as _,Y as H,c as F,d as G,W as R,e as $,L as B,C as U,f as V,g as L,h as z,H as Y,P as O}from"./PortIcon-c50eb444.js";import{_ as P,o as a,c as i,b as o,l as f,r as m,d as u,F as v,g as S,j as A,a8 as w,a9 as C,w as b,e as g,t as k,p as Q,f as W}from"./index-2e4a1f3e.js";const M=E,q=N,K=T,j=D,J=_,Z=_,X=_,ee=H,oe=F,ne=G,te=R,re=$,ae=N,se=B,ie=B,ce=U,le=V,de=L,pe=L,ue=z,me=z,ge=Object.freeze(Object.defineProperty({__proto__:null,Component:M,Configuration:q,Container:K,Learner:j,Loop:J,LoopEnd:Z,LoopStart:X,Manipulator:ee,Metanode:oe,MetanodeSecondary:ne,Other:te,Predictor:re,QuickForm:ae,ScopeEnd:se,ScopeStart:ie,Sink:ce,Source:le,VirtualIn:de,VirtualOut:pe,Visualizer:ue,Widget:me},Symbol.toStringTag,{value:"Module"})),ye=32,x={default:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3,32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30.7,0,29.2z",LoopEnd:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",LoopStart:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",ScopeEnd:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z",ScopeStart:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-4,15.9L32,32H2.8C1.3,32,0,30.7,0,29.2z",VirtualIn:"M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H6.5L0,25.9l5.2-10L0.7,7.2L6.5,0l22.7,0C30.7,0,32,1.3,32,2.8z",VirtualOut:"M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0L32,0l-5.8,7.2l4.5,8.7l-5.2,10L32,32H2.8C1.3,32,0,30.7,0,29.2z"},fe=.75,he={props:{type:{type:String,default:null},isComponent:{type:Boolean,default:!1},icon:{type:String,default:null,validator:e=>e.startsWith("data:image/")}},computed:{backgroundPath(){return x[this.type]||x.default},backgroundColor(){return ge[this.type]||Y},componentColor(){return M},componentBackgroundTransformation(){let e=ye/2;return`translate(${e}, ${e}) scale(${fe}) translate(-${e}, -${e})`}}},_e=["d","fill"],Pe=["d","fill","transform"],ve=["xlink:href"];function Se(e,s,n,y,r,t){return a(),i("g",null,[o("path",{class:"bg",d:t.backgroundPath,fill:n.isComponent?t.componentColor:t.backgroundColor},null,8,_e),n.isComponent&&n.type?(a(),i("path",{key:0,class:"bg",d:t.backgroundPath,fill:t.backgroundColor,transform:t.componentBackgroundTransformation},null,8,Pe)):f("",!0),n.icon?(a(),i("image",{key:1,"xlink:href":n.icon,x:"8",y:"8",width:"16",height:"16","pointer-events":"none"},null,8,ve)):f("",!0)])}const Ae=P(he,[["render",Se]]),we={components:{PortIcon:O,NodeTorsoNormal:Ae},props:{type:{type:String,default:null},isComponent:{type:Boolean,default:!1},inPorts:{type:Array,default:()=>[]},outPorts:{type:Array,default:()=>[]},hasDynPorts:{type:Boolean,default:!1},icon:{type:String,default:null,validator:e=>e.startsWith("data:image/")}},data(){return{viewBox:"-19 -19 70 70"}},methods:{yPortShift(e,s){let r=1;s===2?r=12:s===3&&(r=1.5);let l=(32-(s*9+(s-1)*r))/2;return(r+9)*e+l+9/2}}},Ce=["viewBox"],be={key:0,stroke:"none"},ke=o("circle",{r:"1.2",cx:"4",cy:"27"},null,-1),xe=o("circle",{r:"1.2",cx:"9",cy:"27"},null,-1),Ne=o("circle",{r:"1.2",cx:"14",cy:"27"},null,-1),Be=[ke,xe,Ne];function Le(e,s,n,y,r,t){const l=m("NodeTorsoNormal"),d=m("PortIcon");return a(),i("svg",{viewBox:r.viewBox},[u(l,{type:n.type,icon:n.icon,"is-component":n.isComponent},null,8,["type","icon","is-component"]),(a(!0),i(v,null,S(n.inPorts,(c,p)=>(a(),A(d,{key:`in-${p}`,color:c.color,filled:!c.optional,type:c.type,transform:`translate(-4.5, ${t.yPortShift(p,n.inPorts.length)})`},null,8,["color","filled","type","transform"]))),128)),(a(!0),i(v,null,S(n.outPorts,(c,p)=>(a(),A(d,{key:`out-${p}`,color:c.color,filled:!c.optional,type:c.type,transform:`translate(36.5, ${t.yPortShift(p,n.outPorts.length)})`},null,8,["color","filled","type","transform"]))),128)),n.hasDynPorts?(a(),i("g",be,Be)):f("",!0)],8,Ce)}const ze=P(we,[["render",Le]]),Me=`<script>
import PortIcon from './PortIcon.vue';
import NodeTorsoNormal from './NodeTorsoNormal.vue';

/**
 * SVG icon preview for a node or component, generated from its attributes
 */
export default {
    components: {
        PortIcon,
        NodeTorsoNormal
    },
    props: {
        /**
         * Type of node; determines the background color.
         * @example 'Reader'
         */
        type: {
            type: String,
            default: null
        },
        /**
         * Use alternative rendering style:
         * Components always have a gray background and a smaller rectangle whose background indicates the node type
         */
        isComponent: {
            type: Boolean,
            default: false
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
            default: () => []
        },
        /**
         * List ouf outgoing ports
         */
        outPorts: {
            type: Array,
            default: () => []
        },
        /**
         * Show three dots to indicate dynamic ports
         */
        hasDynPorts: {
            type: Boolean,
            default: false
        },
        /**
         * URL of icon that is rendered inside the node. (Possibly \`data:\` URL)
         * Passed through to NodeTorsoNormal
         */
        icon: {
            type: String,
            default: null,
            validator: url => url.startsWith('data:image/')
        }
    },
    data() {
        return {
            /*
            * Port icon size is 9x9 including stroke, background size is 32x32.
            * A height of 70 leaves whitespace and the top and bottom of the background, and allows for up to 7 ports
            * (i.e. Community Nodes > OpenMS > Utilities > SpectraSTSearchAdapter)
            * Keep in sync with iconRenderer:svgSize
            */
            viewBox: '-19 -19 70 70'
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
        }
    }
};
<\/script>

<template>
  <svg :viewBox="viewBox">
    <NodeTorsoNormal
      :type="type"
      :icon="icon"
      :is-component="isComponent"
    />
    <PortIcon
      v-for="(port, index) in inPorts"
      :key="\`in-\${index}\`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="\`translate(-4.5, \${ yPortShift(index, inPorts.length) })\`"
    />
    <PortIcon
      v-for="(port, index) in outPorts"
      :key="\`out-\${index}\`"
      :color="port.color"
      :filled="!port.optional"
      :type="port.type"
      :transform="\`translate(36.5, \${ yPortShift(index, outPorts.length) })\`"
    />
    <g
      v-if="hasDynPorts"
      stroke="none"
    >
      <circle
        r="1.2"
        cx="4"
        cy="27"
      />
      <circle
        r="1.2"
        cx="9"
        cy="27"
      />
      <circle
        r="1.2"
        cx="14"
        cy="27"
      />
    </g>
  </svg>
</template>
`;const h="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiNAqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLTegGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJRU5ErkJggg==",Ie=`<NodePreview
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
/>`,Ee={components:{NodePreview:ze,CodeExample:I},data(){return{codeExample:Ie,nodePreview:{hasDynPorts:!0,isComponent:!1,type:"Learner",inPorts:[{type:"table"}],outPorts:[{type:"other",color:"#1eb9dc"},{type:"table",optional:!0}],icon:h},componentPreview:{hasDynPorts:!1,isComponent:!0,type:"Sink",inPorts:[{type:"table"}],outPorts:[{type:"other",color:"#1eb9dc"},{type:"table"},{type:"table",optional:!0}],icon:h}}},computed:{sourceCode(){return Me}}},Te=e=>(Q("data-v-4fedd0ec"),e=e(),W(),e),De=Te(()=>o("div",{class:"grid-container"},[o("div",{class:"grid-item-12"},[o("h2",null,"NodePreview"),o("p",null,[g(" A component that draws a Node (left, with dynamic ports) or a Component (right)."),o("br"),g(" This Component only draws regular nodes/components, no Metanodes, no Unknown nor Missing Nodes. ")])])],-1)),He={class:"grid-container"},Fe={class:"grid-item-12 demo-items"},Ge={class:"grid-container"},Re={class:"grid-item-12"};function $e(e,s,n,y,r,t){const l=m("NodePreview",!0),d=m("CodeExample");return a(),i("div",null,[o("section",null,[De,o("div",He,[o("div",Fe,[o("div",null,[u(l,w(C(r.nodePreview)),null,16)]),o("div",null,[u(l,w(C(r.componentPreview)),null,16)])])])]),o("section",null,[o("div",Ge,[o("div",Re,[u(d,{summary:"Show usage example"},{default:b(()=>[g(k(r.codeExample),1)]),_:1}),u(d,{summary:"Show NodePreview.vue source code"},{default:b(()=>[g(k(t.sourceCode),1)]),_:1})])])])])}const Oe=P(Ee,[["render",$e],["__scopeId","data-v-4fedd0ec"]]);export{Oe as default};
